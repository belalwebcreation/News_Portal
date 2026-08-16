import { useRef } from "react";
import { AlertCircle, AlertTriangle, X } from "lucide-react";
import { useModalA11y } from "../hooks/useModalA11y";

const DeleteCategoryModal = ({ category, error, loading, onClose, onConfirm }) => {
  const cancelBtnRef = useRef(null);

  // FIX: focuses Cancel by default (not Delete) — for a destructive
  // confirmation, an accidental Enter-key press should never trigger the
  // delete. Also adds Escape-to-close, focus trap, and scroll lock, which
  // this modal didn't have before.
  const containerRef = useModalA11y({ onClose, loading, autoFocusRef: cancelBtnRef });

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={handleBackdropClick} className="fixed inset-0 bg-ink/60 backdrop-blur-xs" />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 font-meta text-xs text-ink shadow-2xl shadow-black/20 dark:border-paper/10 dark:bg-ink dark:text-paper">
        {/* danger accent rule */}
        <div className="absolute inset-x-0 top-0 h-1 bg-rose-500" />

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-graphite transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]/50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-paper"
          type="button"
          aria-label="বন্ধ করুন"
        >
          <X size={16} />
        </button>

        <div className="mt-2 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
            <AlertTriangle size={22} />
          </div>
          <h3 className="mb-2 font-display text-sm font-medium tracking-tight text-ink dark:text-paper">আপনি কি নিশ্চিত?</h3>
          <p className="px-2 leading-relaxed text-graphite dark:text-paper/70">
            আপনি কি <span className="font-bold text-rose-600 dark:text-rose-400">"{category?.name || "এই"}"</span> ক্যাটাগরি স্থায়ীভাবে মুছে ফেলতে চান? এর সাথে থাকা নিউজ পোস্টগুলোতে ফিল্টারিং সমস্যা হতে পারে। এই অ্যাকশনটি ফেরানো সম্ভব নয়।
          </p>
        </div>

        {error && (
          <div
            className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-ink/15 py-2.5 font-bold text-ink transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]/40 disabled:opacity-50 dark:border-paper/15 dark:text-paper dark:hover:bg-paper/10"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 py-2.5 font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500 active:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:opacity-50"
          >
            {loading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;