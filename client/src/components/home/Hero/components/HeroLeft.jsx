import { Link } from "react-router-dom";
import { heroNews } from "../data";

const HeroLeft = () => {
  const news = heroNews.left;

  return (
    <aside className="h-full">

      <article className="border-b border-gray-200 pb-6">

        <Link to={`/news/${news.id}`}>

          <h2
            className="
              text-3xl
              font-bold
              leading-tight
              text-gray-900
              hover:text-red-700
              duration-300
            "
          >
            {news.title}
          </h2>

        </Link>

        <p
          className="
            mt-4
            text-gray-600
            leading-8
            text-lg
          "
        >
          {news.description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

          <span>🕒</span>

          <span>{news.time}</span>

        </div>

      </article>

    </aside>
  );
};

export default HeroLeft;