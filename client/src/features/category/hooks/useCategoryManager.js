import { useMemo, useState } from "react";
import { useCategories } from "../../../context/CategoryContext";

export const useCategoryManager = () => {
  const {
    categories,
    isFetching,
    isMutating,
    error: contextError,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    clearError,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalError, setModalError] = useState(null);

  // FEATURE ADD: sortable table columns (name / slug / status / newsCount).
  // Lives here alongside search/status so filtering + sorting stay in one
  // place instead of being split between the hook and the table component.
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  };

  const [editor, setEditor] = useState({ isOpen: false, mode: "create", data: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateModal = () => {
    setModalError(null);
    setEditor({ isOpen: true, mode: "create", data: null });
  };

  const openEditModal = (category) => {
    setModalError(null);
    setEditor({ isOpen: true, mode: "edit", data: category });
  };

  const closeEditor = () => {
    setEditor({ isOpen: false, mode: "create", data: null });
    setModalError(null);
  };

  // FIX: openDeleteModal/closeDeleteModal never cleared modalError before —
  // a failed delete's error message could stay set and (incorrectly) show
  // up again the next time a delete modal opens for a different category.
  const openDeleteModal = (category) => {
    setModalError(null);
    setDeleteTarget(category);
  };
  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setModalError(null);
  };

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((cat) => {
      const matchesSearch =
        (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.slug || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && cat.isActive) ||
        (statusFilter === "inactive" && !cat.isActive);

      return matchesSearch && matchesStatus;
    });

    const { key, direction } = sortConfig;
    const dir = direction === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (key === "newsCount") {
        return ((a.newsCount || 0) - (b.newsCount || 0)) * dir;
      }
      if (key === "isActive") {
        return (Number(a.isActive) - Number(b.isActive)) * dir;
      }
      const valA = (a[key] || "").toString().toLowerCase();
      const valB = (b[key] || "").toString().toLowerCase();
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }, [categories, searchTerm, statusFilter, sortConfig]);

  const saveCategory = async (formData) => {
    setModalError(null);
    try {
      if (editor.mode === "create") {
        await createCategory(formData);
      } else {
        await updateCategory(editor.data._id, formData);
      }
      closeEditor();
    } catch (err) {
      setModalError(err.message || "ক্যাটাগরি সেভ করতে সমস্যা হয়েছে।");
    }
  };

  // FIX: this used to call alert(err.message) — a jarring native browser
  // popup, inconsistent with the rest of the app, AND it bypassed the
  // error UI DeleteCategoryModal already renders (its `error` prop was
  // always wired up in CategoryManagement.jsx but never actually set on
  // failure). Now it does the same thing saveCategory does.
  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setModalError(null);
    try {
      await deleteCategory(deleteTarget._id);
      closeDeleteModal();
    } catch (err) {
      setModalError(err.message || "ক্যাটাগরি মুছে ফেলা যায়নি।");
    }
  };

  return {
    categories: filteredCategories,

    totalCount: categories.length,
    activeCount: categories.filter((item) => item.isActive).length,

    isFetching,
    isMutating,

    error: contextError,
    modalError,

    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,

    sortConfig,
    toggleSort,

    editor,
    deleteTarget,

    openCreateModal,
    openEditModal,
    closeEditor,
    openDeleteModal,
    closeDeleteModal,
    saveCategory,
    confirmDelete,

    refreshCategories,
    clearError,
  };
};
