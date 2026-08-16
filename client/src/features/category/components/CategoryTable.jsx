import { ChevronDown, ChevronUp, ChevronsUpDown, Edit3, Layers, Trash2 } from "lucide-react";

const COLUMNS = [
  { key: "name", label: "ক্যাটাগরি", sortable: true },
  { key: "slug", label: "স্লাগ", sortable: true },
  { key: "description", label: "ডেসক্রিপশন", sortable: false },
  { key: "isActive", label: "স্ট্যাটাস", sortable: true, align: "center" },
  { key: "newsCount", label: "মোট নিউজ", sortable: true, align: "center" },
];

// প্রিভিউ/ফলব্যাক ডেটা — প্রকৃত ব্যবহারে useCategoryManager() থেকে `categories` prop পাস হবে
const DEMO_CATEGORIES = [
  {
    _id: "1",
    name: "রাজনীতি",
    slug: "politics",
    description: "জাতীয় ও আন্তর্জাতিক রাজনীতি সংক্রান্ত সর্বশেষ প্রতিবেদন ও বিশ্লেষণ।",
    newsCount: 1284,
    isActive: true,
  },
  {
    _id: "2",
    name: "খেলাধুলা",
    slug: "sports",
    description: "ক্রিকেট, ফুটবলসহ দেশ-বিদেশের খেলার সর্বশেষ আপডেট।",
    newsCount: 842,
    isActive: true,
  },
  {
    _id: "3",
    name: "বিনোদন",
    slug: "entertainment",
    description: "চলচ্চিত্র, সংগীত ও তারকাদের খবর।",
    newsCount: 356,
    isActive: false,
  },
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
        className={`flex w-full items-center gap-1.5 px-6 py-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent dark:hover:text-paper ${alignClass} ${
          isActive ? "text-ink dark:text-paper" : ""
        }`}
        aria-label={`${column.label} অনুযায়ী সাজান`}
      >
        {column.label}
        <Icon size={13} className={isActive ? "text-accent" : "text-graphite/50 dark:text-paper/30"} aria-hidden="true" />
      </button>
    </th>
  );
}

const CategoryTable = ({
  categories = DEMO_CATEGORIES,
  onEdit = () => {},
  onDelete = () => {},
  disabled = false,
  sortConfig = { key: "newsCount", direction: "desc" },
  onSort = () => {},
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm dark:border-paper/10 dark:bg-paper/[0.04] dark:shadow-none">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 bg-ink/[0.02] font-meta text-[11px] font-bold uppercase tracking-wider text-graphite dark:border-paper/10 dark:bg-paper/[0.03] dark:text-paper/50">
              {COLUMNS.map((column) => (
                <SortableHeader key={column.key} column={column} sortConfig={sortConfig} onSort={onSort} />
              ))}
              <th className="px-6 py-4 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 text-xs dark:divide-paper/10">
            {categories.map((cat) => (
              <tr key={cat._id} className="transition-colors hover:bg-ink/[0.02] dark:hover:bg-paper/[0.03]">
                <td className="flex items-center gap-3 px-6 py-4 font-display font-semibold text-ink dark:text-paper">
                  <div className="rounded-lg bg-accent/10 p-2 text-accent">
                    <Layers size={14} />
                  </div>
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-meta text-[11px] tracking-wide text-graphite dark:text-paper/50">
                  {cat.slug}
                </td>
                <td className="max-w-xs truncate px-6 py-4 font-display text-ink/60 dark:text-paper/60">
                  {cat.description || "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`rounded-full border px-2.5 py-1 font-meta text-[10px] font-bold uppercase tracking-wide ${
                      cat.isActive
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-accent/20 bg-accent/10 text-accent"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-meta text-graphite dark:text-paper/50">
                  <span className="rounded-md bg-ink/5 px-2 py-0.5 font-bold text-ink dark:bg-paper/10 dark:text-paper">
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
                      title="Edit"
                      className="rounded-lg p-2 text-graphite transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40 dark:text-paper/40 dark:hover:bg-paper/10 dark:hover:text-paper dark:focus-visible:outline-paper"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(cat)}
                      disabled={disabled}
                      aria-label={`"${cat.name}" মুছে ফেলুন`}
                      title="Delete"
                      className="rounded-lg p-2 text-graphite transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 dark:text-paper/40"
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
    </div>
  );
};

export default CategoryTable;