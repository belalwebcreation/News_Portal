import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SmallNewsCard from "./SmallNewsCard";
import TextNews from "./TextNews";

// 1. Sub-component: Featured Story Block
const SidebarFeatured = ({ featured }) => {
  if (!featured) return null;

  const { slug, title, description, time, publishedAt, categorySlug } = featured;

  // ⚠️ basename="/news" স্বয়ংক্রিয়ভাবে যোগ হয় — এখানে "/news" নিজে লেখা যাবে না।
  // App.jsx-এ শুধু "/:categorySlug/:slug" route আছে, standalone "/:slug" নেই —
  // categorySlug না থাকলে ভ্যালিড লিংক বানানো সম্ভব না, তাই "#" ফলব্যাক।
  const articleUrl = categorySlug && slug ? `/${categorySlug}/${slug}` : "#";

  return (
    <div className="border-b border-neutral-200/60 dark:border-gray-800/60 pb-6">
      <Link to={articleUrl} className="group block">
        <h3
          className="
            text-xl 
            lg:text-2xl 
            font-bold 
            leading-snug 
            tracking-tight 
            text-neutral-900 
            dark:text-gray-100
            transition-colors 
            duration-300 
            group-hover:text-red-600 
            dark:group-hover:text-red-500
            line-clamp-3
          "
        >
          {title}
        </h3>

        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-gray-400 line-clamp-3 font-normal">
            {description}
          </p>
        )}

        <p className="mt-3 text-xs sm:text-sm font-medium text-neutral-500 dark:text-gray-400">
          {publishedAt || time || "সম্প্রতি"}
        </p>
      </Link>
    </div>
  );
};

// 2. Sub-component: Image News List Block
const SidebarImageList = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded-full" />
        <h4 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-gray-100 uppercase">
          বিশেষ খবর
        </h4>
      </div>

      <div className="divide-y divide-neutral-200/60 dark:divide-gray-800/60">
        {items.map((item) => (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0">
            <SmallNewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Sub-component: Text News List Block
const SidebarTextList = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded-full" />
        <h4 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-gray-100 uppercase">
          আরও শিরোনাম
        </h4>
      </div>

      <div className="divide-y divide-neutral-200/60 dark:divide-gray-800/60">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
            <TextNews news={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Composition Component
const LeftSidebar = ({ featured, imageNews = [], textNews = [] }) => {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* 1. Featured Top Story */}
      <SidebarFeatured featured={featured} />

      {/* 2. Image-based News List with Dividers */}
      <SidebarImageList items={imageNews} />

      {/* 3. Text-only News List with Dividers */}
      <SidebarTextList items={textNews} />
    </motion.aside>
  );
};

export default LeftSidebar;