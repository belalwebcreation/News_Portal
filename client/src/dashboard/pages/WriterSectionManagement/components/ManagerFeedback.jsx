import { AlertCircle, Loader2 } from "lucide-react";

export const ManagerPageLoader = ({ message = "কন্টেন্ট লোড হচ্ছে..." }) => (
  <div
    className="min-h-64 flex flex-col items-center justify-center gap-3 text-slate-400"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="animate-spin text-red-500" size={30} aria-hidden="true" />
    <p className="text-xs font-semibold">{message}</p>
  </div>
);

export const ManagerErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300"
      role="alert"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={14} aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="font-bold text-red-200 hover:text-white"
          aria-label="ত্রুটি বার্তাটি বন্ধ করুন"
        >
          বন্ধ
        </button>
      )}
    </div>
  );
};

