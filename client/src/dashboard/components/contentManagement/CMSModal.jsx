import { X } from "lucide-react";

const CMSModal = ({
  open,
  onClose,
  title,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">

      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-800">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800">

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-8 max-h-[75vh] overflow-y-auto text-slate-700 dark:text-slate-200">

          {children}

        </div>

      </div>
    </div>
  );
};

export default CMSModal;