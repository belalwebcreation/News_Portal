// src/modules/WriterSectionManagement/modals/ConfirmModal.jsx

import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle
              size={24}
              className="text-red-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              Please confirm before continuing.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-7 text-slate-600">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;