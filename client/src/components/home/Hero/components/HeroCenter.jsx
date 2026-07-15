import { Link } from "react-router-dom";
import { heroNews } from "../data";

const HeroCenter = () => {
  const news = heroNews.center;

  return (
    <article className="group">

      {/* News Image */}
      <Link to={`/news/${news.id}`} className="block overflow-hidden">

                <img
        src={news.image}
        alt={news.title}
        className="
          w-full
          h-75
          object-cover
          transition-transform
          duration-500
          group-hover:scale-105
        "
        />

      </Link>

      {/* News Content */}

      <div className="mt-5">

        <Link to={`/news/${news.id}`}>
          <h1
            className="
              text-4xl
              font-bold
              leading-tight
              text-gray-900
              transition-colors
              duration-300
              group-hover:text-red-700
            "
          >
            {news.title}
          </h1>
        </Link>

        <p
          className="
            mt-4
            text-lg
            leading-8
            text-gray-600
          "
        >
          {news.description}
        </p>

        <p className="mt-5 text-sm text-gray-500">
          {news.time}
        </p>

      </div>

    </article>
  );
};

export default HeroCenter;