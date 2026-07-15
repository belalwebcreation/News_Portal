// src/pages/CategoryNews.jsx

import { useParams } from "react-router-dom";

const CategoryNews = () => {
  const { slug } = useParams();

  // Later you will fetch news by category slug
  // Example:
  // GET /api/news/category/:slug

  const loading = false;
  const error = false;

  const news = [];

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center text-red-500">
        Something went wrong.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Category Title */}
      <div className="mb-8 border-b pb-3">
        <h1 className="text-3xl font-bold capitalize">
          {slug?.replace(/-/g, " ")}
        </h1>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <p className="mb-2 text-sm text-red-600">
                  {item.category?.name}
                </p>

                <h2 className="mb-2 text-xl font-semibold">
                  {item.title}
                </h2>

                <p className="line-clamp-3 text-gray-600">
                  {item.shortDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-100 p-10 text-center">
          <h2 className="text-xl font-semibold">
            No news found in this category.
          </h2>
        </div>
      )}

    </div>
  );
};

export default CategoryNews;