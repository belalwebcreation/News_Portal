import { useEffect, useRef, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { generateSlug } from "../utils/generateSlug";
import { useModalA11y } from "../hooks/useModalA11y";

const CategoryModal = ({ mode, data, loading, error, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", isActive: true });
  const nameInputRef = useRef(null);

  // FIX: previously had its own inline `formatSlug` that stripped
  // non-ASCII characters — meaning a Bangla-only category name produced
  // an EMPTY slug. Now uses the shared, Bangla-safe generateSlug().
  const containerRef = useModalA11y({ onClose, loading, autoFocusRef: nameInputRef });

  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        name: data?.name || "",
        slug: data?.slug || "",
        description: data?.description || "",
        isActive: data?.isActive ?? true,
      });
    } else {
      setFormData({ name: "", slug: "", description: "", isActive: true });
    }
  }, [mode, data]);

  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    if (mode === "create") {
      setFormData((prev) => ({
        ...prev,
        name: nameValue,
        slug: generateSlug(nameValue),
      }));
    } else {
      // এডিট মোডে নাম পরিবর্তনে স্লাগ অটো-চেঞ্জ হয় না ইচ্ছাকৃতভাবে —
      // slug URL/SEO-তে ব্যবহৃত হয়, existing link ভাঙতে না দেওয়ার জন্য।
      setFormData((prev) => ({ ...prev, name: nameValue }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={handleBackdropClick} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-sm font-black text-slate-900">
            {mode === "create" ? "নতুন ক্যাটাগরি তৈরি করুন" : "ক্যাটাগরি সংশোধন করুন"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-slate-400 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="বন্ধ করুন"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700" role="alert">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="mb-1.5 block font-semibold text-slate-600">
              ক্যাটাগরির নাম
            </label>
            <input
              ref={nameInputRef}
              id="category-name"
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-hidden"
              placeholder="উদা: রাজনীতি"
            />
          </div>

          <div>
            <label htmlFor="category-slug" className="mb-1.5 block font-semibold text-slate-600">
              স্লাগ (URL ফ্রেন্ডলি)
            </label>
            <input
              id="category-slug"
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-hidden"
              placeholder="উদা: politics"
            />
          </div>

          <div>
            <label htmlFor="category-description" className="mb-1.5 block font-semibold text-slate-600">
              সংক্ষিপ্ত বিবরণ
            </label>
            <textarea
              id="category-description"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-hidden"
              placeholder="ক্যাটাগরি সম্পর্কে কিছু লিখুন..."
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="font-semibold text-slate-600">স্ট্যাটাস একটিভ রাখুন</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 cursor-pointer rounded-sm border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-50"
            >
              {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
