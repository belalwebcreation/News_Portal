import { Edit3, Trash2, Layers } from "lucide-react";

// প্রিভিউ/ফলব্যাক ডেটা — প্রকৃত ব্যবহারে ক্যালার থেকে `category` prop পাস হবে
const DEMO_CATEGORY = {
  name: "রাজনীতি",
  slug: "politics",
  description: "জাতীয় ও আন্তর্জাতিক রাজনীতি সংক্রান্ত সর্বশেষ প্রতিবেদন ও বিশ্লেষণ।",
  newsCount: 1284,
  isActive: true,
};

const CategoryCard = ({
  category = DEMO_CATEGORY,
  onEdit = () => {},
  onDelete = () => {},
  disabled = false,
}) => {
  const { name, slug, description, newsCount = 0, isActive = true } = category;

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-paper/10 dark:bg-paper/[0.04] dark:shadow-none dark:hover:shadow-black/40">
      {/* মাসথেড রুল — "press dispatch" আইডেন্টিটির একমাত্র accent স্বাক্ষর */}
      <span className="absolute inset-x-0 top-0 h-[3px] bg-accent/70 transition-colors duration-300 group-hover:bg-accent" />

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="rounded-xl bg-accent/10 p-2.5 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            <Layers size={18} />
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-meta text-[10px] font-bold uppercase tracking-wide ${
              isActive
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-accent/20 bg-accent/10 text-accent"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <h3 className="mb-0.5 font-display text-base font-semibold leading-snug text-ink dark:text-paper">
          {name}
        </h3>
        <p className="mb-2 font-meta text-[11px] tracking-wide text-graphite dark:text-paper/50">
          /{slug}
        </p>
        <p className="line-clamp-2 font-display text-xs leading-relaxed text-ink/60 dark:text-paper/60">
          {description || "কোনো বিবরণ নেই।"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink/10 px-5 py-4 text-xs dark:border-paper/10">
        <div className="font-meta text-graphite dark:text-paper/50">
          <span className="uppercase tracking-wide">মোট নিউজ</span>
          <span className="ml-1.5 rounded-md bg-ink/5 px-2 py-0.5 font-bold text-ink dark:bg-paper/10 dark:text-paper">
            {newsCount.toLocaleString("bn-BD")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            disabled={disabled}
            aria-label={`"${name}" সম্পাদনা করুন`}
            className="rounded-xl p-2 text-graphite transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40 dark:text-paper/40 dark:hover:bg-paper/10 dark:hover:text-paper dark:focus-visible:outline-paper"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            disabled={disabled}
            aria-label={`"${name}" মুছে ফেলুন`}
            className="rounded-xl p-2 text-graphite transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 dark:text-paper/40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;