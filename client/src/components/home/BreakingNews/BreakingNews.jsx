import { Link } from "react-router-dom";
import { breakingNews } from "./data";
import "./BreakingNews.css";

const BreakingNews = () => {
  return (
    <section className="bg-white border-y border-gray-300">
      <div className="max-w-7xl mx-auto flex items-center">

        {/* Left Label */}
        <div className="bg-red-700 text-white px-6 py-3 font-semibold text-sm shrink-0">
          সর্বশেষ
        </div>

        {/* Ticker */}
        <div className="ticker-container">
          <div className="ticker-content">

            {[...breakingNews, ...breakingNews].map((news, index) => (
              <Link
                key={`${news.id}-${index}`}
                to={news.slug}
                className="ticker-item"
              >
                ● {news.title}
              </Link>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default BreakingNews;