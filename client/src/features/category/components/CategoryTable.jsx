import { ChevronDown, ChevronUp, ChevronsUpDown, Edit3, Layers, Trash2 } from "lucide-react";

const COLUMNS = [
  { key: "name", label: "ক্যাটাগরি", sortable: true },
  { key: "slug", label: "স্লাগ", sortable: true },
  { key: "description", label: "ডেসক্রিপশন", sortable: false },
  { key: "isActive", label: "স্ট্যাটাস", sortable: true, align: "center" },
  { key: "newsCount", label: "মোট নিউজ", sortable: true, align: "center" },
];

// FEATURE ADD: sortable column headers. `sortConfig`/`onSort` come from
// useCategoryManager() so sort state lives in one place alongside
// search/status filtering, the same pattern the card/table split already
// shares for `categories`.
function SortableHeader({ column, sortConfig, onSort }) {
  const alignClass = column.align === "center" ? "justify-center" : "justify-start";

  if (!column.sortable) {
    return (
      <th className={`px-6 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>{column.label}</th>
    );
  }

  const isActive = sortConfig.key === column.key;
  const Icon = isActive ? (sortConfig.direction === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;

  return (
    <th className={column.align === "center" ? "text-center" : "text-left"}>
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={`flex w-full items-center gap-1.5 px-6 py-4 transition hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-400 ${alignClass} ${
          isActive ? "text-slate-200" : ""
        }`}
        aria-label={`${column.label} অনুযায়ী সাজান`}
      >
        {column.label}
        <Icon size={13} className={isActive ? "text-indigo-400" : "text-slate-600"} aria-hidden="true" />
      </button>
    </th>
  );
}

const CategoryTable = ({ categories, onEdit, onDelete, disabled = false, sortConfig, onSort }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {COLUMNS.map((column) => (
              <SortableHeader key={column.key} column={column} sortConfig={sortConfig} onSort={onSort} />
            ))}
            <th className="px-6 py-4 text-center">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 text-xs text-slate-300">
          {categories.map((cat) => (
            <tr key={cat._id} className="hover:bg-slate-900/60 transition-colors">
              <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-indigo-400 rounded-lg">
                  <Layers size={14} />
                </div>
                {cat.name}
              </td>
              <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{cat.slug}</td>
              <td className="px-6 py-4 max-w-xs truncate text-slate-400">{cat.description || "—"}</td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    cat.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded-md text-slate-200">
                  {(cat.newsCount || 0).toLocaleString("bn-BD")}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(cat)}
                    disabled={disabled}
                    aria-label={`"${cat.name}" সম্পাদনা করুন`}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cat)}
                    disabled={disabled}
                    aria-label={`"${cat.name}" মুছে ফেলুন`}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
