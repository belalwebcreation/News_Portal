import { Edit3, Trash2, Layers } from "lucide-react";

const CategoryCard = ({ category, onEdit, onDelete, disabled = false }) => {
  const { name, slug, description, newsCount = 0, isActive = true } = category;

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
            <Layers size={18} />
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white mb-0.5">{name}</h3>
        <p className="text-[11px] font-mono text-slate-500 mb-2">/{slug}</p>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{description || "কোনো বিবরণ নেই।"}</p>
      </div>

      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between mt-auto text-xs">
        <div className="text-slate-500">
          মোট নিউজ:{" "}
          <span className="text-slate-200 font-bold bg-slate-800 px-2 py-0.5 rounded-md ml-1">
            {newsCount.toLocaleString("bn-BD")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            disabled={disabled}
            aria-label={`"${name}" সম্পাদনা করুন`}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            disabled={disabled}
            aria-label={`"${name}" মুছে ফেলুন`}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
