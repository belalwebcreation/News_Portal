import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  errorMessage = null, // ✅ NEW — modal-এর ভেতরেই fail-এর কারণ দেখাবে, backdrop-এর নিচে চাপা পড়বে না
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 transition-all duration-200">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <MdOutlineDeleteOutline size={22} />
        </div>
        <h2 id="confirm-dialog-title" className="mt-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>}

        {errorMessage && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;