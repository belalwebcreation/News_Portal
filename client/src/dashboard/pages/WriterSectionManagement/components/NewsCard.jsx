import { memo, useCallback } from "react";
import ActionMenu from "./ActionMenu";
import StatusBadge from "./StatusBadge";

// Lucide Icons
import { ImageOff, Clock3, Folder, ChevronUp, ChevronDown } from "lucide-react";

/**
 * এন্টারপ্রাইজ গ্রেড রিইউজেবল নিউজ কার্ড কম্পোনেন্ট
 */
const NewsCard = ({
  news,
  index,
  totalCount,
  onEdit,
  onDelete,
  onToggleVisibility, 
  onDuplicate,
  onPin,
  onSchedule,
  onMoveUp,
  onMoveDown,
  isLoading, 
}) => {
  if (!news) return null;

  // ডিফেন্সিভ কোডিং: 'hidden' অথবা 'isVisible' উভয় স্কিমকেই সাপোর্ট করার জন্য সেফ চেক
  const isHidden = news.hidden ?? (news.isVisible !== undefined ? !news.isVisible : false);

  // useCallback দিয়ে মেমোয়াইজড করা ইমেজ এরর হ্যান্ডলার
  const handleImageError = useCallback((e) => {
    e.currentTarget.onerror = null; // প্রিভেন্ট ইনফিনিট লুপ
    e.currentTarget.src = "/placeholder.webp";
  }, []);

  return (
    <article
      className={`
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        ${isLoading ? "opacity-60 pointer-events-none select-none" : "hover:-translate-y-1 hover:shadow-lg"}
      `}
    >
      {/* Image / Media Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {news.image ? (
          <img
            src={news.image}
            alt={news.title || "সংবাদের ছবি"}
            onError={handleImageError}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="h-10 w-10 text-slate-400" />
          </div>
        )}

        {/* Action Panel: Reorder Controls & Action Menu */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 z-10">
          {/* রি-অর্ডার বাটন গ্রুপ */}
          {(onMoveUp || onMoveDown) && (
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/80 bg-white/95 p-0.5 shadow-sm backdrop-blur-sm">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0 || isLoading}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                title="উপরে স্থানান্তর করুন"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === totalCount - 1 || isLoading}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                title="নিচে স্থানান্তর করুন"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* অ্যাকশন ড্রপডাউন মেনু (Clean & Standard Prop Passing) */}
          <ActionMenu
            hidden={isHidden}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleVisibility={onToggleVisibility}
            onDuplicate={onDuplicate}
            onPin={onPin}
            onSchedule={onSchedule}
          />
        </div>
      </div>

      {/* Content Body */}
      <div className="space-y-4 p-5">
        {/* Category Tag */}
        {news.category && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Folder className="h-4 w-4" />
            {news.category}
          </div>
        )}

        {/* Title */}
        <h3
          className="
            line-clamp-2
            text-lg
            font-bold
            leading-7
            text-slate-900
          "
        >
          {news.title}
        </h3>

        {/* Description */}
        {news.description && (
          <p
            className="
              line-clamp-3
              text-sm
              leading-6
              text-slate-600
            "
          >
            {news.description}
          </p>
        )}

        {/* Slug Info */}
        {news.slug && (
          <div
            className="
              truncate
              rounded-lg
              bg-slate-50
              px-3
              py-2
              font-mono
              text-xs
              text-slate-500
            "
          >
            /{news.slug}
          </div>
        )}

        {/* Card Footer */}
        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-slate-100
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* লাইভ স্ট্যাটাস ইন্ডিকেটর */}
          <StatusBadge
            status={news.status}
            hidden={isHidden}
            size="sm"
          />

          {/* পাবলিশ টাইম */}
          {news.time && (
            <div
              className="
                flex
                items-center
                gap-1.5
                text-xs
                text-slate-500
              "
            >
              <Clock3 className="h-4 w-4" />
              {news.time}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(NewsCard);