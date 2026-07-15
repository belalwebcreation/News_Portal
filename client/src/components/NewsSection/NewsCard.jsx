const NewsCard = ({ news }) => {
  return (
    <article className="border-b pb-5">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover rounded"
      />

      <h3 className="mt-4 text-lg font-semibold leading-7 hover:text-red-700 transition-colors cursor-pointer">
        {news.title}
      </h3>

      {news.description && (
        <p className="mt-2 text-sm text-gray-600">
          {news.description}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        {news.time}
      </p>
    </article>
  );
};

export default NewsCard;