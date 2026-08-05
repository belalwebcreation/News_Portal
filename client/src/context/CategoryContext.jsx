import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { categoryService } from "../features/category/services/categoryService";

const CategoryContext = createContext(null);

// পজিশন ও বাংলা নাম অনুযায়ী সর্টিং লজিক
const sortCategories = (categories = []) =>
  [...categories].sort((a, b) => {
    const positionDiff =
      Number(a?.position ?? 0) - Number(b?.position ?? 0);

    if (positionDiff !== 0) return positionDiff;

    return (a?.name ?? '').localeCompare(
      b?.name ?? '',
      'bn'
    );
  });

const toMessage = (error) => error?.message || error || 'ক্যাটাগরি সংক্রান্ত কাজটি সম্পন্ন করা যায়নি।';

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshCategories = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsFetching(true);
    if (!silent) setError(null);

    try {
      const nextCategories = await categoryService.getAllCategories();

      console.log("API Response =>", nextCategories);

      const sortedCategories = sortCategories(nextCategories);
      setCategories(sortedCategories);
      return sortedCategories;
    } catch (requestError) {
      const message = toMessage(requestError);
      if (!silent) setError(message);
      throw new Error(message);
    } finally {
      if (!silent) setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories().catch(() => undefined);
  }, [refreshCategories]);

  const createCategory = useCallback(
    async (payload) => {
      setIsMutating(true);
      setError(null);
      try {
        const created = await categoryService.createCategory(payload);
        setCategories((current) => sortCategories([...current, created]));
        refreshCategories({ silent: true }).catch(() => undefined);
        return created;
      } catch (requestError) {
        const message = toMessage(requestError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [refreshCategories],
  );

  const updateCategory = useCallback(
    async (id, payload) => {
      setIsMutating(true);
      setError(null);
      try {
        const updated = await categoryService.updateCategory(id, payload);
        setCategories((current) => sortCategories(current.map((item) => (item._id === id ? updated : item))));
        refreshCategories({ silent: true }).catch(() => undefined);
        return updated;
      } catch (requestError) {
        const message = toMessage(requestError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [refreshCategories],
  );

  const deleteCategory = useCallback(
    async (id) => {
      setIsMutating(true);
      setError(null);
      try {
        await categoryService.deleteCategory(id);
        setCategories((current) => current.filter((item) => item._id !== id));
        refreshCategories({ silent: true }).catch(() => undefined);
      } catch (requestError) {
        const message = toMessage(requestError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [refreshCategories],
  );

  const value = useMemo(
    () => ({
      categories,
      error,
      isFetching,
      isMutating,
      refreshCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      clearError,
    }),
    [categories, error, isFetching, isMutating, refreshCategories, createCategory, updateCategory, deleteCategory, clearError],
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories অবশ্যই CategoryProvider-এর ভিতরে ব্যবহার করতে হবে।');
  }
  return context;
}