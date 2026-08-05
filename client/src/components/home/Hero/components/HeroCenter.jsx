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
  default: "bg-neutral-800 text-white",
};

const HeroCenter = ({ news }) => {
  if (!news) return null;

  const {
    id,
    title,
    description,
    image,
    category = "আন্তর্জাতিক",
    publishedAt,
    isBreaking = false,
  } = news;

  // Determine Badge Color based on Category
  const categoryBadgeStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES.default;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group flex flex-col h-full justify-between"
    >
      <div>
        {/* Image Container with Aspect Ratio, Subtle Overlay & Performance Attributes */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-100">
          <Link
            to={`/news/${id}`}
            aria-label={title}
            className="block relative aspect-[16/9] w-full overflow-hidden"
          >
            <img
              src={image}
              alt={title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
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
            {/* Always-on Subtle Gradient Overlay for visual refinement */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </Link>

          {/* Dynamic Category or Breaking News Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            {isBreaking ? (
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-lg shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                জরুরি সংবাদ
              </span>
            ) : (
              category && (
                <span
                  className={`inline-block text-xs font-bold tracking-wide px-3 py-1.5 rounded-lg shadow-sm ${categoryBadgeStyle}`}
                >
                  {category}
                </span>
              )
            )}
          </div>
        </div>

        {/* Article Body Content */}
        <div className="mt-6 flex flex-col">
          {/* Main Title with Clean Typography & Strict Line Clamping */}
          <Link to={`/news/${id}`} aria-label={title}>
            <h1
              className="
                text-2xl 
                sm:text-3xl 
                lg:text-4xl 
                xl:text-[2.5rem] 
                font-bold 
                tracking-tight 
                leading-[1.22] 
                text-neutral-900 
                transition-colors 
                duration-300 
                group-hover:text-red-600
                line-clamp-2
              "
            >
              {title}
            </h1>
          </Link>

          {/* Editorial Description */}
          {description && (
            <p
              className="
                mt-3.5 
                text-base 
                lg:text-lg 
                leading-relaxed 
                text-neutral-600 
                line-clamp-3 
                font-normal
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Clean & Minimal Editorial Metadata */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm text-neutral-500 font-medium">
        <div className="flex items-center space-x-2">
          {/* Publication Time */}
          <span>{publishedAt || news.time || "সম্প্রতি"}</span>

          {news.readTime && (
            <>
              <span className="text-neutral-300">•</span>
              <span>{news.readTime}</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default HeroCenter;