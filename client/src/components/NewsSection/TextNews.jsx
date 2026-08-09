import { Link } from "react-router-dom";

const TextNews = ({ news }) => {
  return (
    <Link
      to={`/news/${news.id}`}
      className="group block rounded-lg px-2 py-4 transition-colors duration-300 hover:bg-neutral-50 dark:hover:bg-gray-800/60"
    >
      <div className="flex items-start gap-3">
        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-600" />

        <div className="min-w-0 flex-1">
          <h4
            className="
              text-[15px]
              lg:text-base
              font-semibold
              leading-6
              tracking-tight
              text-neutral-900
              dark:text-gray-100
              line-clamp-2
              transition-colors
              duration-300
              group-hover:text-red-600
              dark:group-hover:text-red-500
            "
          >
            {news.title}
          </h4>

          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-gray-400">
            <span>{news.time}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TextNews;