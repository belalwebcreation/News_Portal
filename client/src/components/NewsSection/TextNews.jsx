const TextNews = ({ news }) => {
  return (
    <div className="border-b pb-3">
      <h4 className="font-semibold leading-7 hover:text-red-700 transition-colors cursor-pointer">
        {news.title}
      </h4>

      <p className="mt-2 text-xs text-gray-500">
        {news.time}
      </p>
    </div>
  );
};

export default TextNews;