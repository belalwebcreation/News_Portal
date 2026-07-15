const latestNews = [
  {
    id: 1,
    title: "Government announces new economic policy.",
    time: "10 min ago",
  },
  {
    id: 2,
    title: "Technology sector reaches new milestone.",
    time: "25 min ago",
  },
  {
    id: 3,
    title: "National football team wins championship.",
    time: "45 min ago",
  },
  {
    id: 4,
    title: "Health ministry launches awareness campaign.",
    time: "1 hour ago",
  },
  {
    id: 5,
    title: "Education board publishes new curriculum.",
    time: "2 hours ago",
  },
];

const featuredNews = {
  image: "https://picsum.photos/700/450",
  category: "World",
  title: "World leaders gather to discuss climate change and global cooperation.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, doloremque. This section will later come dynamically from your backend.",
  date: "11 July 2026",
};

const popularNews = [
  "AI continues transforming journalism.",
  "Bangladesh launches new satellite project.",
  "Stock market closes at record high.",
  "Sports league announces new season.",
  "Scientists discover promising medical breakthrough.",
];

const LatestNews = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Latest News
        </h2>
        <div className="w-20 h-1 bg-red-600 mt-2 rounded"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left */}
        <div className="lg:col-span-3">

          <h3 className="font-bold text-xl mb-5">
            Latest
          </h3>

          <div className="space-y-4">

            {latestNews.map((news) => (

              <div
                key={news.id}
                className="border-b pb-4 cursor-pointer hover:text-red-600 duration-300"
              >
                <h4 className="font-semibold">
                  {news.title}
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  {news.time}
                </p>
              </div>

            ))}

          </div>

        </div>

        {/* Center */}

        <div className="lg:col-span-6">

          <img
            src={featuredNews.image}
            alt=""
            className="rounded-xl w-full h-[380px] object-cover"
          />

          <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full mt-5">
            {featuredNews.category}
          </span>

          <h2 className="text-3xl font-bold mt-4">
            {featuredNews.title}
          </h2>

          <p className="text-gray-600 mt-4 leading-8">
            {featuredNews.description}
          </p>

          <p className="text-gray-500 mt-5">
            {featuredNews.date}
          </p>

        </div>

        {/* Right */}

        <div className="lg:col-span-3">

          <h3 className="font-bold text-xl mb-5">
            Popular News
          </h3>

          <div className="space-y-5">

            {popularNews.map((item, index) => (

              <div
                key={index}
                className="flex gap-4 border-b pb-4 cursor-pointer group"
              >

                <div className="text-2xl font-bold text-red-600">
                  0{index + 1}
                </div>

                <h4 className="font-medium group-hover:text-red-600 duration-300">
                  {item}
                </h4>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default LatestNews;