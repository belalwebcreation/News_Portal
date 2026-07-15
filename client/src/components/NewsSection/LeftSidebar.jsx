import SmallNewsCard from "./SmallNewsCard";
import TextNews from "./TextNews";

const LeftSidebar = ({ news }) => {
  const featured = news[0];
  const imageNews = news.slice(1, 3);
  const textNews = news.slice(3);

  return (
    <aside className="space-y-6">
      {/* Featured News */}
      <div className="border-b pb-5">
        <h2 className="text-2xl font-bold leading-snug hover:text-red-700 transition-colors cursor-pointer">
          {featured.title}
        </h2>

        <p className="mt-3 text-gray-600 text-sm leading-6">
          {featured.description}
        </p>

        <p className="mt-3 text-xs text-gray-500">
          {featured.time}
        </p>
      </div>

      {/* Image News */}
      <div className="space-y-5">
        {imageNews.map((item) => (
          <SmallNewsCard key={item.id} news={item} />
        ))}
      </div>

      {/* Text News */}
      <div className="space-y-4">
        {textNews.map((item) => (
          <TextNews key={item.id} news={item} />
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;