import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Category Styles Mapping
const CATEGORY_STYLES = {
  রাজনীতি: "bg-red-600 text-white",
  খেলা: "bg-emerald-600 text-white",
  প্রযুক্তি: "bg-blue-600 text-white",
  অর্থনীতি: "bg-amber-600 text-white",
  বিনোদন: "bg-purple-600 text-white",
  আন্তর্জাতিক: "bg-indigo-600 text-white",
  বাংলাদেশ: "bg-red-700 text-white",
  default: "bg-neutral-800 text-white",
};

const NewsCard = ({ news }) => {
  if (!news) return null;

  const {
    id,
    title,
    description,
    image,
    category,
    time,
    publishedAt,
    readTime,
  } = news;

  const categoryBadgeStyle = category
    ? CATEGORY_STYLES[category] || CATEGORY_STYLES.default
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group h-full flex flex-col justify-between"
    >
      <Link
        to={`/news/${id}`}
        aria-label={title}
        className="block flex-1 focus:outline-none"
      >
        {/* Aspect Ratio Image Container */}
        <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-gray-800 border border-neutral-100/80 dark:border-gray-800/80 aspect-[16/10] w-full">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="
              w-full 
              h-full 
              object-cover 
              transition-all 
              duration-500 
              ease-out 
              group-hover:scale-105 
              group-hover:brightness-95
            "
          />

          {/* Optional Category Badge */}
          {category && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span
                className={`inline-block text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-md shadow-sm ${categoryBadgeStyle}`}
              >
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="mt-3.5 flex flex-col">
          {/* Title */}
          <h3
            className="
              text-base 
              sm:text-lg 
              lg:text-xl 
              font-bold 
              tracking-tight 
              leading-snug 
              text-neutral-900 
              dark:text-gray-100
              transition-colors 
              duration-300 
              group-hover:text-red-600 
              dark:group-hover:text-red-500
              line-clamp-2
            "
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-400 line-clamp-2 font-normal">
              {description}
            </p>
          )}
        </div>
      </Link>

      {/* Editorial Metadata Footer */}
      <div className="mt-3.5 pt-2 flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-gray-400">
        <div className="flex items-center space-x-1.5">
          <span>{publishedAt || time || "সম্প্রতি"}</span>

          {readTime && (
            <>
              <span className="text-neutral-300 dark:text-gray-600">•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;