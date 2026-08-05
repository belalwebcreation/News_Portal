// src/components/ui/Toast.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return ReactDOM.createPortal(
    <div className="fixed top-5 right-5 z-[10001] flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-top-3 fade-in duration-200 min-w-[280px] max-w-md">
      <div className={isSuccess ? "text-emerald-400" : "text-rose-400"}>
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <p className="text-xs font-medium flex-1 text-slate-100">{message}</p>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>,
    document.body
  );
};

export default Toast;