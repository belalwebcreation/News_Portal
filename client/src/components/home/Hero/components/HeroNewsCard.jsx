import { Link } from "react-router-dom";

const HeroNewsCard = ({ news }) => {
  return (
    <article className="group">

      {/* Image */}
      <Link
        to={`/news/${news.id}`}
        className="block overflow-hidden rounded-lg"
      >
        <img
          src={news.image}
          alt={news.title}
          className="
            w-full
            h-72
            object-cover
            duration-500
            group-hover:scale-105
          "
        />
      </Link>

      {/* Content */}
      <div className="mt-4">

        <Link to={`/news/${news.id}`}>
          <h2
            className="
              text-3xl
              font-bold
              leading-tight
              text-gray-900
              dark:text-gray-100
              duration-300
              group-hover:text-red-700
              dark:group-hover:text-red-500
            "
          >
            {news.title}
          </h2>
        </Link>

        <p
          className="
            mt-3
            text-gray-600
            dark:text-gray-400
            leading-7
          "
        >
          {news.description}
        </p>

        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          🕒 {news.time}
        </div>

      </div>

    </article>
  );
};

export default HeroNewsCard;