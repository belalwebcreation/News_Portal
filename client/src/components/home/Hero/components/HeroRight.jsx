import { heroNews } from "../data";
import HeroSmallCard from "./HeroSmallCard";

const HeroRight = () => {
  return (
    <aside className="space-y-5">

      {heroNews.right.map((news, index) => (

        <div
          key={news.id}
          className={`
            ${
              index !== heroNews.right.length - 1
                ? "border-b border-gray-200 pb-5"
                : ""
            }
          `}
        >

          <HeroSmallCard news={news} />

        </div>

      ))}

    </aside>
  );
};

export default HeroRight;