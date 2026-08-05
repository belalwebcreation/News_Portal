import HeroSmallCard from "./HeroSmallCard";

const HeroRight = ({ newsList = [] }) => {
  if (newsList.length === 0) return null;

  return (
    <aside className="space-y-5">

      {newsList.map((news, index) => (

        <div
          key={news.id}
          className={`
            ${
              index !== newsList.length - 1
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
