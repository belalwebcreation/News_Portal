import { useMemo, useState } from "react";
import {
  Bookmark,
  Search,
  CalendarDays,
  Clock3,
  User,
  Trash2,
  ExternalLink,
} from "lucide-react";

const SavedNews = ({ savedNews = [], loading = false, onRemove }) => {
  const [search, setSearch] = useState("");

  const filteredNews = useMemo(() => {
    if (!search.trim()) return savedNews;

    return savedNews.filter((news) =>
      news.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [savedNews, search]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="card bg-base-100 shadow-xl">

        <div className="card-body">

          <div className="flex flex-col lg:flex-row gap-4 justify-between">

            <div>

              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Bookmark size={24} />
                Saved News
              </h2>

              <p className="text-base-content/60 mt-1">
                Total Saved : {filteredNews.length}
              </p>

            </div>

            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-3 top-3 text-base-content/40"
              />

              <input
                type="text"
                placeholder="Search saved news..."
                className="input input-bordered w-full pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Empty State */}

      {filteredNews.length === 0 && (
        <div className="card bg-base-100 shadow-xl">

          <div className="card-body items-center text-center py-20">

            <Bookmark
              size={60}
              className="text-base-content/30"
            />

            <h3 className="text-xl font-semibold mt-4">
              No Saved News
            </h3>

            <p className="text-base-content/60">
              Your bookmarked articles will appear here.
            </p>

          </div>

        </div>
      )}

      {/* News List */}

      <div className="grid lg:grid-cols-2 gap-6">

        {filteredNews.map((news) => (
          <div
            key={news._id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <figure className="h-52">

              <img
                src={news.thumbnail}
                alt={news.title}
                className="w-full h-full object-cover"
              />

            </figure>

            <div className="card-body">

              <div className="badge badge-primary">
                {news.category}
              </div>

              <h3 className="card-title line-clamp-2">
                {news.title}
              </h3>

              <div className="space-y-2 text-sm text-base-content/70">

                <div className="flex items-center gap-2">

                  <User size={15} />

                  {news.author}

                </div>

                <div className="flex items-center gap-2">

                  <CalendarDays size={15} />

                  {news.savedAt}

                </div>

                <div className="flex items-center gap-2">

                  <Clock3 size={15} />

                  {news.readTime} min read

                </div>

              </div>

              <div className="card-actions justify-between mt-4">

                <button className="btn btn-primary btn-sm">

                  <ExternalLink size={16} />

                  Read News

                </button>

                <button
                  onClick={() => onRemove?.(news._id)}
                  className="btn btn-error btn-outline btn-sm"
                >

                  <Trash2 size={16} />

                  Remove

                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default SavedNews;