const editorPicks = [
  {
    id: 1,
    image: "https://picsum.photos/400/250?random=1",
    category: "Technology",
    title: "Artificial Intelligence is changing the future of journalism.",
    date: "11 July 2026",
    views: "2.4K",
  },
  {
    id: 2,
    image: "https://picsum.photos/400/250?random=2",
    category: "Business",
    title: "Stock market continues to rise as investors remain optimistic.",
    date: "11 July 2026",
    views: "1.8K",
  },
  {
    id: 3,
    image: "https://picsum.photos/400/250?random=3",
    category: "Sports",
    title: "National team wins an exciting championship final.",
    date: "11 July 2026",
    views: "3.1K",
  },
  {
    id: 4,
    image: "https://picsum.photos/400/250?random=4",
    category: "Health",
    title: "Doctors reveal new healthy lifestyle recommendations.",
    date: "11 July 2026",
    views: "950",
  },
];

const EditorsPick = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Editor's Pick</h2>
          <div className="w-20 h-1 bg-red-600 mt-2 rounded"></div>
        </div>

        <button className="text-red-600 font-semibold hover:underline">
          View All →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {editorPicks.map((news) => (

          <div
            key={news.id}
            className="bg-white rounded-xl shadow hover:shadow-xl duration-300 overflow-hidden group cursor-pointer"
          >

            <div className="overflow-hidden">

              <img
                src={news.image}
                alt={news.title}
                className="w-full h-56 object-cover group-hover:scale-110 duration-500"
              />

            </div>

            <div className="p-5">

              <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                {news.category}
              </span>

              <h3 className="font-bold text-lg mt-4 line-clamp-2">
                {news.title}
              </h3>

              <div className="flex justify-between text-sm text-gray-500 mt-5">

                <span>{news.date}</span>

                <span>{news.views} Views</span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default EditorsPick;