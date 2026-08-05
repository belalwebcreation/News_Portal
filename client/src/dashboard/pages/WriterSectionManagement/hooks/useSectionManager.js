import { useState, useCallback } from "react";
import { SECTION_LAYOUTS, INITIAL_NEWS_POOL } from "../constants/section";
import { uploadImageToCloudinary } from "../services/cloudinary";

// ১. গ্লোবাল ফর্ম ইনিশিয়াল স্টেট (সব ম্যানেজারের জন্য স্ট্যান্ডার্ডাইজড)
const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  image: "",
  categorySlug: "",
  tags: "",
  isHidden: false,
};

/**
 * Industry-Level Normalized Section Manager Hook with Shared Form Controller
 * @param {string} sectionKey - The configuration key (e.g., 'hero', 'sports')
 */
export const useSectionManager = (sectionKey) => {
  // লেআউট এবং সেন্ট্রাল নিউজ পুল স্টেট
  const [layout, setLayout] = useState(SECTION_LAYOUTS[sectionKey] || {});
  const [newsPool, setNewsPool] = useState(INITIAL_NEWS_POOL);

  // ডাইনামিক ফর্ম স্টেট (শেয়ারড ফর্ম কন্ট্রোলার)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // ফাইন-গ্রেইন্ড লোডিং স্টেট
  const [loading, setLoading] = useState({
    fetch: false,
    add: false,
    update: false,
    delete: false,
    upload: false,
  });

  // ফাইন-গ্রেইন্ড এরর স্টেট
  const [errors, setErrors] = useState({
    fetch: null,
    add: null,
    update: null,
    delete: null,
    upload: null,
  });

  // কনফার্মেশন মোডাল স্টেট (window.confirm এর বিকল্প)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // সাধারণ মোডাল স্টেট
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,       // 'add' | 'edit' | 'banner'
    slotKey: null,    // যেমন: 'left', 'center', 'right'
    selectedId: null, // এডিটের সময় নিউজ আইডি
  });

  // ==========================================
  // ২. ফর্ম কন্ট্রোল মেথডস (Form Controllers)
  // ==========================================
  
  // ফর্ম রিসেট করার ফাংশন
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  // কনফার্মেশন কন্ট্রোলার
  const requestConfirmation = useCallback((message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: async () => {
        await onConfirmAction();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
  }, []);

  // মোডাল ওপেন এবং ফর্ম ডাইনামিক ফিলিং মেথড
  const openModal = useCallback((type, slotKey = null, selectedId = null) => {
    setModal({ isOpen: true, type, slotKey, selectedId });

    // এডিট মোড হলে মূল নিউজ পুল থেকে ডেটা নিয়ে ফর্মে অটোমেটিক বসিয়ে দেবে
    if (type === "edit" && selectedId) {
      const existingNews = newsPool[selectedId];
      if (existingNews) {
        setFormData({
          title: existingNews.title || "",
          description: existingNews.description || "",
          image: existingNews.image || "",
          categorySlug: existingNews.categorySlug || "",
          tags: existingNews.tags || "",
          isHidden: existingNews.isHidden || false,
        });
        return; // ফর্ম ফিলিং শেষ, ফাংশন রিটার্ন
      }
    }
    
    // 'add' মোড হলে ফর্ম একদম ফ্রেশ থাকবে
    setFormData(INITIAL_FORM_STATE);
  }, [newsPool]);

  // মোডাল বন্ধের সাথে সাথে ফর্ম রিসেট ও এরর ক্লিন করা
  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null, slotKey: null, selectedId: null });
    resetForm();
    setErrors({ fetch: null, add: null, update: null, delete: null, upload: null });
  }, [resetForm]);

  // ==========================================
  // ৩. কোর সার্ভিসেস (Cloudinary Wrapper)
  // ==========================================
  const handleImageUpload = useCallback(async (file) => {
    setLoading((prev) => ({ ...prev, upload: true }));
    setErrors((prev) => ({ ...prev, upload: null }));
    try {
      const url = await uploadImageToCloudinary(file);
      // ইমেজ আপলোড সফল হলে সরাসরি ফর্মের ইমেজে সেট করে দেওয়া হবে
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
      }
      return url;
    } catch (err) {
      setErrors((prev) => ({ ...prev, upload: err.message }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  }, []);

  // ==========================================
  // ৪. CORE CRUD OPERATIONS (Normalized)
  // ==========================================

  // Add News
  const addNews = useCallback(async (newsData, slotKey) => {
    setLoading((prev) => ({ ...prev, add: true }));
    setErrors((prev) => ({ ...prev, add: null }));
    try {
      const newNewsId = crypto.randomUUID ? crypto.randomUUID() : `news_${Date.now()}`;
      const newNewsItem = {
        id: newNewsId,
        ...newsData,
        isHidden: false,
        createdAt: new Date().toISOString(),
      };

      setNewsPool((prevPool) => ({
        ...prevPool,
        [newNewsId]: newNewsItem,
      }));

      setLayout((prevLayout) => {
        const currentSlotValue = prevLayout[slotKey];
        if (Array.isArray(currentSlotValue)) {
          return { ...prevLayout, [slotKey]: [newNewsId, ...currentSlotValue] };
        } else {
          return { ...prevLayout, [slotKey]: newNewsId };
        }
      });

      closeModal();
    } catch (err) {
      setErrors((prev) => ({ ...prev, add: err.message || "সংবাদটি যুক্ত করা যায়নি।" }));
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  }, [closeModal]);

  // Update News
  const updateNews = useCallback(async (newsId, updatedData) => {
    setLoading((prev) => ({ ...prev, update: true }));
    setErrors((prev) => ({ ...prev, update: null }));
    try {
      setNewsPool((prevPool) => {
        if (!prevPool[newsId]) return prevPool;
        return {
          ...prevPool,
          [newsId]: { ...prevPool[newsId], ...updatedData },
        };
      });
      closeModal();
    } catch (err) {
      setErrors((prev) => ({ ...prev, update: err.message || "সংবাদটি আপডেট করা যায়নি।" }));
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  }, [closeModal]);

  // Delete News
  const deleteNews = useCallback((newsId) => {
    requestConfirmation("আপনি কি নিশ্চিতভাবে এই খবরটি ডিলিট করতে চান?", async () => {
      setLoading((prev) => ({ ...prev, delete: true }));
      setErrors((prev) => ({ ...prev, delete: null }));
      try {
        setLayout((prevLayout) => {
          const updatedLayout = { ...prevLayout };
          Object.keys(updatedLayout).forEach((key) => {
            if (Array.isArray(updatedLayout[key])) {
              updatedLayout[key] = updatedLayout[key].filter((id) => id !== newsId);
            } else if (updatedLayout[key] === newsId) {
              updatedLayout[key] = null;
            }
          });
          return updatedLayout;
        });

        setNewsPool((prevPool) => {
          const updatedPool = { ...prevPool };
          delete updatedPool[newsId];
          return updatedPool;
        });
      } catch (err) {
        setErrors((prev) => ({ ...prev, delete: err.message || "সংবাদটি ডিলিট করা যায়নি।" }));
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    });
  }, [requestConfirmation]);

  // Toggle news visibility
  const toggleNewsVisibility = useCallback(async (newsId) => {
    setNewsPool((prevPool) => {
      if (!prevPool[newsId]) return prevPool;
      return {
        ...prevPool,
        [newsId]: { ...prevPool[newsId], isHidden: !prevPool[newsId].isHidden },
      };
    });
  }, []);

  // Update Banner
  const updateBanner = useCallback(async (bannerData) => {
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      setLayout((prevLayout) => ({
        ...prevLayout,
        banner: { ...prevLayout.banner, ...bannerData },
      }));
      closeModal();
    } catch (err) {
      setErrors((prev) => ({ ...prev, update: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  }, [closeModal]);

  // Reorder
  const reorderNews = useCallback((slotKey, activeId, overId) => {
    let originalLayout;
    setLayout((prevLayout) => {
      originalLayout = prevLayout;
      const currentSlotList = prevLayout[slotKey];
      if (!Array.isArray(currentSlotList)) return prevLayout;

      const oldIndex = currentSlotList.indexOf(activeId);
      const newIndex = currentSlotList.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) return prevLayout;

      const updatedList = [...currentSlotList];
      const [movedItem] = updatedList.splice(oldIndex, 1);
      updatedList.splice(newIndex, 0, movedItem);

      return {
        ...prevLayout,
        [slotKey]: updatedList,
      };
    });
  }, []);

  // ==========================================
  // ৫. CENTRALIZED FORM SUBMIT HANDLER
  // ==========================================
  // React standard form onSubmit-এর সাথে সরাসরি বাইন্ড করার জন্য 'e.preventDefault()' অ্যাড করা হয়েছে
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (modal.type === "add") {
      await addNews(formData, modal.slotKey);
    } else if (modal.type === "edit") {
      await updateNews(modal.selectedId, formData);
    }
  }, [modal, formData, addNews, updateNews]);

  return {
    // States
    layout,
    newsPool,
    loading,
    errors,
    modal,
    confirmModal,
    formData,
    // Setters & Actions
    setFormData,
    openModal,
    closeModal,
    closeConfirmModal,
    resetForm,
    handleSubmit,
    // Operations
    addNews,
    updateNews,
    deleteNews,
    toggleNewsVisibility,
    updateBanner,
    reorderNews,
    handleImageUpload,
  };
};