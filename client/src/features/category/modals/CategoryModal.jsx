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
      <div onClick={handleBackdropClick} className="fixed inset-0 bg-ink/60 backdrop-blur-xs" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 font-meta text-xs text-ink shadow-2xl shadow-black/20 dark:border-paper/10 dark:bg-ink dark:text-paper">
        {/* press-dispatch accent rule */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />

        <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-4 dark:border-paper/10">
          <h2 className="font-display text-sm font-medium tracking-tight text-ink dark:text-paper">
            {mode === "create" ? "নতুন ক্যাটাগরি তৈরি করুন" : "ক্যাটাগরি সংশোধন করুন"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-graphite transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]/50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-paper"
            type="button"
            aria-label="বন্ধ করুন"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div
            className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60">
              ক্যাটাগরির নাম
            </label>
            <input
              ref={nameInputRef}
              id="category-name"
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-ink placeholder:text-graphite/70 transition focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-paper/15 dark:bg-ink dark:text-paper dark:placeholder:text-graphite"
              placeholder="উদা: রাজনীতি"
            />
          </div>

          <div>
            <label htmlFor="category-slug" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60">
              স্লাগ (URL ফ্রেন্ডলি)
            </label>
            <input
              id="category-slug"
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
              className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-mono text-ink placeholder:text-graphite/70 transition focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-paper/15 dark:bg-ink dark:text-paper dark:placeholder:text-graphite"
              placeholder="উদা: politics"
            />
          </div>

          <div>
            <label htmlFor="category-description" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60">
              সংক্ষিপ্ত বিবরণ
            </label>
            <textarea
              id="category-description"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-ink placeholder:text-graphite/70 transition focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-paper/15 dark:bg-ink dark:text-paper dark:placeholder:text-graphite"
              placeholder="ক্যাটাগরি সম্পর্কে কিছু লিখুন..."
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-ink/[0.03] p-3 dark:border-paper/10 dark:bg-paper/5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60">স্ট্যাটাস একটিভ রাখুন</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 cursor-pointer rounded-sm border-ink/20 bg-paper accent-[var(--accent)] transition focus:ring-2 focus:ring-[var(--accent)]/30 dark:border-paper/20 dark:bg-ink"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-ink/15 px-4 py-2.5 font-bold text-ink transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]/40 disabled:opacity-50 dark:border-paper/15 dark:text-paper dark:hover:bg-paper/10"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 font-bold text-paper shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110 active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-50"
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