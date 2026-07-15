const SmallNewsCard = ({ news }) => {
  return (
    <div className="border-b pb-4">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-44 object-cover rounded"
      />

      <h3 className="mt-3 text-lg font-semibold leading-7 hover:text-red-700 transition-colors cursor-pointer">
        {news.title}
      </h3>

      <p className="mt-2 text-xs text-gray-500">
        {news.time}
      </p>
    </div>
  );
};

export default SmallNewsCard;