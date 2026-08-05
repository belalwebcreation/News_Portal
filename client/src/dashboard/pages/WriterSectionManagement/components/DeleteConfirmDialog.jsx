import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmDialog = ({ isOpen, itemName, isLoading, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <section
        className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 id="delete-dialog-title" className="flex items-center gap-2 text-sm font-black text-white">
            <AlertTriangle className="text-red-400" size={17} aria-hidden="true" />
            ভিডিও মুছে ফেলবেন?
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="text-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="ডিলিট ডায়ালগ বন্ধ করুন"
          >
            <X size={17} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <p id="delete-dialog-description" className="text-xs leading-5 text-slate-300">
            <span className="font-bold text-white">{itemName}</span> স্থায়ীভাবে মুছে যাবে এবং এটি সব স্লট থেকেও বাদ পড়বে।
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50"
            >
              {isLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeleteConfirmDialog;

