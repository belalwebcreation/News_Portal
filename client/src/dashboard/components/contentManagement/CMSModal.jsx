import { X } from "lucide-react";

const CMSModal = ({
  open,
  onClose,
  title,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-5 border-b">

          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-8 max-h-[75vh] overflow-y-auto">

          {children}

        </div>

      </div>
    </div>
  );
};

export default CMSModal;