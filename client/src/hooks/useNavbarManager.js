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

  // প্রটেক্টড রিকোয়েস্টগুলোর জন্য হেডার জেনারেট করার হেল্পার ফাংশন
  const getAuthHeaders = (contentType = true) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (contentType) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  // ৬) fetchData এখন সম্পূর্ণ পাবলিক (কোনো টোকেন বা হেডার ছাড়াই ডাটা ফেচ করবে)
  const fetchData = useCallback(async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch(NAVBAR_API),
        fetch(CATEGORY_API),
      ]);

      if (!menuRes.ok || !catRes.ok) {
        throw new Error("নেভবার ডাটা লোড করতে ব্যর্থ হয়েছে।");
      }

      const menuData = await menuRes.json();
      const catData = await catRes.json();

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
      const res = await fetch(NAVBAR_API, {
        method: "POST",
        headers: getAuthHeaders(true), 
        body: JSON.stringify({
          category: categoryId, 
          position,
        }),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add menu");

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
      const res = await fetch(`${NAVBAR_API}/${id}`, {
        method: "PUT", 
        headers: getAuthHeaders(true), 
        body: JSON.stringify(updateData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update menu");

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
      const res = await fetch(`${NAVBAR_API}/${id}/toggle`, { 
        method: "PATCH",
        headers: getAuthHeaders(false) 
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to toggle visibility");

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
      const res = await fetch(`${NAVBAR_API}/reorder`, {
        method: "PATCH",
        headers: getAuthHeaders(true), 
        body: JSON.stringify({
          menus: reorderedItems, 
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to reorder");

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
      const res = await fetch(`${NAVBAR_API}/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(false) 
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete menu");

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