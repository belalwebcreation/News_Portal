import FeaturedNews from "./FeaturedNews";
import NewsCard from "./NewsCard";
import TextNews from "./TextNews";

// featured-এর জন্য null এবং অ্যারেগুলোর জন্য empty array ডিফল্ট করা হলো
const MainGrid = ({ featured = null, cardNews = [], textNews = [] }) => {
  return (
    <section className="space-y-8">
      {/* Center Featured */}
      {featured && <FeaturedNews news={featured} />}

      {/* Card News Grid */}
      {cardNews.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {cardNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}

      {/* Text News Grid */}
      {textNews.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {textNews.map((item) => (
            <TextNews key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MainGrid;