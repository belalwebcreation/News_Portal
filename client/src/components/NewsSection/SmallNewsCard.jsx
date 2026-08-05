import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SmallNewsCard = ({ news }) => {
  if (!news) return null;

  const { id, title, image, category, time, publishedAt } = news;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group block"
    >
      <Link
        to={`/news/${id}`}
        aria-label={title}
        className="block focus:outline-none"
      >
        {/* Aspect Ratio Image Container */}
        <div className="relative overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100/80 aspect-[16/10] w-full">
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
        </div>

        {/* Content Area */}
        <div className="mt-3 flex flex-col">
          {/* Title */}
          <h3
            className="
              text-base 
              lg:text-lg 
              font-bold 
              tracking-tight 
              leading-snug 
              text-neutral-900 
              transition-colors 
              duration-300 
              group-hover:text-red-600 
              line-clamp-2
            "
          >
            {title}
          </h3>

          {/* Metadata Footer */}
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
            {category && (
              <>
                <span className="text-red-600 font-semibold">{category}</span>
                <span className="text-neutral-300">•</span>
              </>
            )}
            <span>{publishedAt || time || "সম্প্রতি"}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default SmallNewsCard;