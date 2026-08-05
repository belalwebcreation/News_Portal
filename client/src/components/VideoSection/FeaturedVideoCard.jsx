import { memo } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import PlayButton from "./PlayButton";

const FeaturedVideoCard = memo(({ video }) => {
  if (!video) return null;

  return (
    <Link
      to={`/news/${video.slug}`}
      aria-label={video.title}
      className="
        group flex flex-col h-full overflow-hidden 
        rounded-2xl border border-neutral-100 bg-white shadow-sm 
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Subtle Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        <PlayButton size="lg" />

        {video.duration && (
          <span className="absolute bottom-3 right-3 z-20 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded font-medium">
            {video.duration}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full inline-block mb-2">
            প্রধান ভিডিও
          </span>

          <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
            {video.title}
          </h3>

          <p className="mt-2.5 text-[13px] leading-6 text-slate-500 line-clamp-3">
            {video.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-slate-400">
          {video.views != null && (
            <span className="flex items-center gap-1">
              <Eye size={13} /> {video.views} ভিউ
            </span>
          )}
          <span>{video.time}</span>
        </div>
      </div>
    </Link>
  );
});

FeaturedVideoCard.displayName = "FeaturedVideoCard";
export default FeaturedVideoCard;