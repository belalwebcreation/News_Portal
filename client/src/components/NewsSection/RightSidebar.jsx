import { Link } from "react-router-dom";

const RightSidebar = ({ news }) => {
  return (
    <aside className="space-y-6">
      {news.map((item) => {
        // ⚠️ basename="/news" স্বয়ংক্রিয়ভাবে যোগ হয় — "/news" এখানে নিজে লেখা যাবে না।
        // App.jsx-এ শুধু "/:categorySlug/:slug" route আছে — categorySlug না থাকলে
        // ভ্যালিড লিংক বানানো সম্ভব না, তাই "#" ফলব্যাক।
        const articleUrl =
          item.categorySlug && item.slug
            ? `/${item.categorySlug}/${item.slug}`
            : "#";

        return (
          <article
            key={item.id}
            className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-b-0"
          >
            <Link to={articleUrl} className="group block">
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />

              {/* Title */}
              <h3 className="mt-4 text-xl font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-6">
                  {item.description}
                </p>
              )}

              {/* Time */}
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {item.time}
              </p>
            </Link>
          </article>
        );
      })}
    </aside>
  );
};

export default RightSidebar;