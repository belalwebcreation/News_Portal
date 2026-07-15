const FeaturedNews = ({ news }) => {
  return (
    <article className="border-b pb-6">
      <img
            src={news.image}
            alt={news.title}
            className="w-full h-95 object-cover"
            />

      <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 hover:text-red-700 transition-colors">
        {news.title}
      </h2>

      <p className="mt-3 text-[16px] leading-7 text-gray-600">
        {news.description}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        {news.time}
      </p>
    </article>
  );
};

export default FeaturedNews;