import { memo } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

import PlayButton from "./PlayButton";

const VideoCard = memo(({ video, setPaused }) => {
  if (!video) return null;

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 24,
      }}
      onMouseEnter={() => setPaused?.(true)}
      onMouseLeave={() => setPaused?.(false)}
      className="h-full"
    >
      <Link
        to={`/news/${video.slug}`}
        aria-label={video.title}
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-neutral-100
          dark:border-gray-800
          bg-white
          dark:bg-gray-900
          shadow-sm
          transition-shadow
          duration-300
          hover:shadow-lg
        "
      >
        <div className="relative aspect-video overflow-hidden bg-neutral-900">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            decoding="async"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          <PlayButton size="md" />

          {video.duration && (
            <span className="absolute bottom-3 right-3 z-20 rounded bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white">
              {video.duration}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-neutral-900 dark:text-gray-100 transition-colors duration-200 group-hover:text-red-600 dark:group-hover:text-red-500">
              {video.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-neutral-500 dark:text-gray-400">
              {video.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 dark:border-gray-800 pt-3 text-[11px] text-neutral-400 dark:text-gray-500">
            {video.views != null && (
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {video.views}
              </span>
            )}

            <span>{video.time}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

VideoCard.displayName = "VideoCard";

export default VideoCard;