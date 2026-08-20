import { Link } from "react-router-dom";

const HeroSmallCard = ({ news }) => {
  if (!news) return null;

  const {
    id,
    title,
    image,
    category,
    categorySlug,
    publishedAt,
  } = news;

  return (
    <article className="group">
      <Link
        to={`/${categorySlug}/${id}`}
        aria-label={title}
        className="flex items-start gap-4 lg:gap-5 py-1"
      >
        {/* Fixed Aspect Image Wrapper */}
        <div className="relative w-28 sm:w-32 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-gray-800 border border-neutral-100/80 dark:border-gray-800/80">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
          {/* Subtle image overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Article Body Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <h3
            className="
              text-sm
              sm:text-base
              lg:text-[17px]
              font-semibold
              leading-snug
              sm:leading-6
              text-neutral-900
              dark:text-gray-100
              line-clamp-2
              transition-colors
              duration-300
              group-hover:text-red-600
              dark:group-hover:text-red-500
            "
          >
            {title}
          </h3>

          {/* Clean Editorial Metadata */}
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-gray-400">
            {category && (
              <>
                <span className="text-red-600 dark:text-red-500 font-semibold">{category}</span>
                <span className="text-neutral-300 dark:text-gray-600">•</span>
              </>
            )}
            <span className="truncate">{publishedAt || news.time || "সম্প্রতি"}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default HeroSmallCard;