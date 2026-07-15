import { Link } from "react-router-dom";

const HeroSmallCard = ({ news }) => {
  return (
    <article className="group">

      <Link
        to={`/news/${news.id}`}
        className="flex gap-4"
      >

        {/* Image */}

        <div className="overflow-hidden rounded-md">

          <img
            src={news.image}
            alt={news.title}
            className="
              w-28
              h-20
              object-cover
              duration-500
              group-hover:scale-105
            "
          />

        </div>

        {/* Content */}

        <div className="flex-1">

          <h3
            className="
              text-[17px]
              font-semibold
              leading-6
              text-gray-900
              duration-300
              group-hover:text-red-700
            "
          >
            {news.title}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {news.time}
          </p>

        </div>

      </Link>

    </article>
  );
};

export default HeroSmallCard;