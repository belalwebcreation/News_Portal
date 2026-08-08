import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { baseUrl } from "../config/Config";

// ১) API Endpoints
const NAVBAR_API = `${baseUrl}/api/site-settings/navbar`;
const CATEGORY_API = `${baseUrl}/api/categories`;

export const useNavbarManager = () => {
  const [menus, setMenus] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState({
    initial: true,
    mutating: false,
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // প্রটেক্টড রিকোয়েস্টগুলোর জন্য হেডার জেনারেট করার হেল্পার ফাংশন
  // (backend এখন httpOnly cookie-কে primary auth হিসেবে ধরে, Bearer token শুধু fallback)
  const getAuthHeaders = (contentType = true) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (contentType) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  // 🆕 সব API কল এখন এই কমন হেল্পার দিয়ে যায়, যাতে:
  //    ১. credentials: "include" প্রতিটা রিকোয়েস্টে যায় (নাহলে ব্রাউজার
  //       cross-origin রিকোয়েস্টে httpOnly accessToken cookie পাঠায় না — এটাই
  //       delete/reorder-এ 401 আসার মূল কারণ ছিল)
  //    ২. response সবসময় valid JSON না-ও হতে পারে (backend crash করলে HTML
  //       ফেরত দিতে পারে) — সেটা যাতে পুরো ফ্লো না ভাঙে তার জন্য safe parsing
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      credentials: "include", // 🔑 accessToken cookie পাঠানোর জন্য must
    });

    const raw = await res.text();
    let json = {};
    if (raw) {
      try {
        json = JSON.parse(raw);
      } catch {
        json = { message: raw };
      }
    }

    if (!res.ok) {
      throw new Error(json.message || `Request failed (${res.status})`);
    }

    return json;
  };

  // ৬) fetchData এখন সম্পূর্ণ পাবলিক (কোনো টোকেন বা হেডার ছাড়াই ডাটা ফেচ করবে)
  const fetchData = useCallback(async () => {
    try {
      const [menuData, catData] = await Promise.all([
        apiFetch(NAVBAR_API),
        apiFetch(CATEGORY_API),
      ]);

      // ব্যাকএন্ড অবজেক্ট স্ট্রাকচার অনুযায়ী স্টেট সেট
      setMenus(menuData.menus || []);
      setAvailableCategories(catData.categories || catData.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ২) Add menu
  const addMenu = async (categoryId, position) => {
    setLoading((prev) => ({ ...prev, mutating: true }));
    try {
      await apiFetch(NAVBAR_API, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          category: categoryId,
          position,
        }),
      });

      await fetchData();
      toast.success("ক্যাটাগরি নেভবারে যুক্ত হয়েছে");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, mutating: false }));
    }
  };

  // ৩) Update method "PUT"
  const updateMenu = async (id, updateData) => {
    setLoading((prev) => ({ ...prev, mutating: true }));
    try {
      await apiFetch(`${NAVBAR_API}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(updateData),
      });

      await fetchData();
      toast.success("মেনু সফলভাবে আপডেট করা হয়েছে");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, mutating: false }));
    }
  };

  // ৪) Toggle visibility
  const toggleVisibility = async (id) => {
    setLoading((prev) => ({ ...prev, mutating: true }));
    try {
      await apiFetch(`${NAVBAR_API}/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(false),
      });

      await fetchData();
      toast.success("ভিসিবিলিটি স্ট্যাটাস আপডেট হয়েছে");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, mutating: false }));
    }
  };

  // ৫) Reorder
  const reorder = async (reorderedItems) => {
    setLoading((prev) => ({ ...prev, mutating: true }));
    try {
      await apiFetch(`${NAVBAR_API}/reorder`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          menus: reorderedItems,
        }),
      });

      await fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, mutating: false }));
    }
  };

  // Delete menu
  const deleteMenu = async (id) => {
    setLoading((prev) => ({ ...prev, mutating: true }));
    try {
      await apiFetch(`${NAVBAR_API}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });

      await fetchData();
      toast.success("মেনু সফলভাবে মুছে ফেলা হয়েছে");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, mutating: false }));
      closeConfirmModal();
    }
  };

  const confirmDelete = (id, title) => {
    setConfirmModal({
      isOpen: true,
      message: `আপনি কি নিশ্চিতভাবে "${title}" মেনুটি ডিলিট করতে চান?`,
      onConfirm: () => deleteMenu(id),
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
  };

  return {
    menus,
    availableCategories,
    loading,
    error,
    confirmModal,
    actions: {
      addMenu,
      updateMenu,
      toggleVisibility,
      reorder,
      confirmDelete,
      closeConfirmModal,
    },
  };
};
