import FeaturedNews from "./FeaturedNews";
import NewsCard from "./NewsCard";
import TextNews from "./TextNews";

const MainGrid = ({ featured, news }) => {
  const cardNews = news.slice(0, 4);
  const textNews = news.slice(4);

  return (
    <section className="space-y-8">
      {/* Featured */}
      <FeaturedNews news={featured} />

      {/* News Grid */}
      <div className="grid grid-cols-2 gap-6">
        {cardNews.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {/* Text News */}
      <div className="grid grid-cols-2 gap-6">
        {textNews.map((item) => (
          <TextNews key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
};

export default MainGrid;