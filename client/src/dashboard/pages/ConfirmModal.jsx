// src/components/ui/ConfirmModal.jsx
import React from "react";
import { AlertTriangle, ShieldAlert, Trash2, ArrowUpRight, ArrowDownRight, X, CheckCircle2 } from "lucide-react";

const TYPE_CONFIG = {
  promote: {
    icon: ArrowUpRight,
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500/20",
    title: "Promote User",
  },
  demote: {
    icon: ArrowDownRight,
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500/20",
    title: "Demote User",
  },
  delete: {
    icon: Trash2,
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/20",
    title: "Delete User",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500/20",
    title: "Success",
  },
  default: {
    icon: AlertTriangle,
    iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300",
    confirmBtn: "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900/20",
    title: "Confirm Action",
  },
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "default",
  isLoading = false,
  hideCancel = false,     // NEW: true -> শুধু একটা "OK" button দেখাবে
  confirmText,            // NEW: override button label (default "Confirm Action" / "OK")
}) => {
  if (!isOpen) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;
  const Icon = config.icon;

  // hideCancel হলে OK চাপলেই close হয়ে যাক, না হলে যেভাবে ছিল সেভাবেই onConfirm call হবে
  const handlePrimaryClick = () => {
    if (hideCancel && !onConfirm) {
      onClose();
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {title || config.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hideCancel ? "" : "Please confirm your action below."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700/60 dark:hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/60">
          {message}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {!hideCancel && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handlePrimaryClick}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-all focus:ring-2 disabled:opacity-50 ${config.confirmBtn}`}
          >
            {isLoading && (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isLoading ? "Processing..." : confirmText || (hideCancel ? "OK" : "Confirm Action")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;