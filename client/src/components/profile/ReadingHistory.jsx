import { useMemo, useState } from "react";
import {
  History,
  Search,
  CalendarDays,
  Clock3,
  User,
  Trash2,
  BookOpen,
  Filter,
} from "lucide-react";

const ReadingHistory = ({
  history = [],
  loading = false,
  onRemove,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(history.map((item) => item.category)),
  ];

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [history, search, category]);

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
                <History size={24} />
                Reading History
              </h2>

              <p className="text-base-content/60 mt-1">
                Total Articles: {filteredHistory.length}
              </p>

            </div>

            <div className="flex flex-col md:flex-row gap-3">

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-3 text-base-content/40"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered pl-10"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="relative">

                <Filter
                  size={17}
                  className="absolute left-3 top-3 text-base-content/40"
                />

                <select
                  className="select select-bordered pl-10"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                    >
                      {cat}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Empty */}

      {filteredHistory.length === 0 && (
        <div className="card bg-base-100 shadow-xl">

          <div className="card-body py-20 items-center text-center">

            <History
              size={60}
              className="text-base-content/30"
            />

            <h3 className="text-xl font-semibold mt-4">
              No Reading History
            </h3>

            <p className="text-base-content/60">
              Articles you read will appear here.
            </p>

          </div>

        </div>
      )}

      {/* History List */}

      <div className="space-y-5">

        {filteredHistory.map((item) => (
          <div
            key={item._id}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
          >

            <div className="card-body">

              <div className="flex flex-col lg:flex-row gap-5">

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full lg:w-64 h-44 rounded-xl object-cover"
                />

                <div className="flex-1">

                  <div className="badge badge-primary mb-3">
                    {item.category}
                  </div>

                  <h3 className="text-xl font-bold line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-3 mt-4 text-sm text-base-content/70">

                    <div className="flex items-center gap-2">
                      <User size={15} />
                      {item.author}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      {item.readAt}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={15} />
                      {item.readTime} min
                    </div>

                  </div>

                  {/* Progress */}

                  <div className="mt-5">

                    <div className="flex justify-between mb-2 text-sm">

                      <span>Reading Progress</span>

                      <span>{item.progress}%</span>

                    </div>

                    <progress
                      className="progress progress-primary w-full"
                      value={item.progress}
                      max="100"
                    />

                  </div>

                  <div className="card-actions justify-between mt-6">

                    <button className="btn btn-primary btn-sm">

                      <BookOpen size={16} />

                      Continue Reading

                    </button>

                    <button
                      onClick={() =>
                        onRemove?.(item._id)
                      }
                      className="btn btn-error btn-outline btn-sm"
                    >

                      <Trash2 size={16} />

                      Remove

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ReadingHistory;