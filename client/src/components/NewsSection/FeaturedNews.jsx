import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Dynamic Category Colors Mapping
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

const FeaturedNews = ({ news }) => {
  if (!news) return null;

  const {
    id,
    title,
    description,
    image,
    category = "বাংলাদেশ",
    publishedAt,
    isBreaking = false,
  } = news;

  const categoryBadgeStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES.default;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group flex flex-col justify-between pb-8 border-b border-neutral-200/60 dark:border-gray-800/60"
    >
      <div>
        {/* Aspect Ratio Image Container with Overlay and Hover Zoom */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-gray-800 border border-neutral-100 dark:border-gray-800">
          <Link
            to={`/news/${id}`}
            aria-label={title}
            className="block relative aspect-[16/9] w-full overflow-hidden"
          >
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
                duration-700 
                ease-out 
                group-hover:scale-105 
                group-hover:brightness-95
              "
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </Link>

          {/* Category or Breaking News Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
            {isBreaking ? (
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold tracking-wide px-3 py-1 rounded-lg shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                জরুরি
              </span>
            ) : (
              category && (
                <span
                  className={`inline-block text-xs font-bold tracking-wide px-3 py-1 rounded-lg shadow-sm ${categoryBadgeStyle}`}
                >
                  {category}
                </span>
              )
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-5 flex flex-col">
          {/* Main Title with Responsive Hierarchy & Line Clamp */}
          <Link to={`/news/${id}`} aria-label={title}>
            <h3
              className="
                text-xl 
                sm:text-2xl 
                lg:text-3xl 
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
          </Link>

          {/* Description */}
          {description && (
            <p
              className="
                mt-3 
                text-sm 
                sm:text-base 
                leading-relaxed 
                text-neutral-600 
                dark:text-gray-400
                line-clamp-3 
                font-normal
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Clean Editorial Metadata */}
      <div className="mt-5 flex items-center justify-between text-xs sm:text-sm text-neutral-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2">
          <span>{publishedAt || news.time || "সম্প্রতি"}</span>

          {news.readTime && (
            <>
              <span className="text-neutral-300 dark:text-gray-600">•</span>
              <span>{news.readTime}</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedNews;