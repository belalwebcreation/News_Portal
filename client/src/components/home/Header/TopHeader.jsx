import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

import Logo from "./Logo";
import SearchBox from "./SearchBox";
import LoginButton from "./LoginButton";
import { getTopHeadline } from "../../../services/topHeadlineService";

const TopHeader = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getTopHeadline();

      const items =
        res?.headline?.items
          ?.filter((item) => item.visible)
          ?.slice(0, 3) || [];

      setHeadlines(items);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load headlines."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines();
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-3 lg:py-5">
        {/* মোবাইল/ট্যাবলেট কম্প্যাক্ট রো — শুধু Logo (বামে) + Search + Login (ডানে)
            headline grid এখানে দেখাবে না, lg থেকে এই রো হাইড হয়ে যাবে */}
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <SearchBox />
            <LoginButton />
          </div>
        </div>

        {/* ডেস্কটপ লেআউট — Logo + headline grid, অপরিবর্তিত, lg থেকে দেখাবে */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Logo */}
          <div className="col-span-12 lg:col-span-4">
            <Logo />
          </div>

          {/* Headlines */}
          <div className="col-span-12 lg:col-span-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2
                  size={32}
                  className="animate-spin text-red-600 dark:text-red-500"
                />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-6 text-red-600 dark:text-red-400">
                <AlertCircle size={30} />
                <p className="mt-2 text-sm">{error}</p>

                <button
                  onClick={fetchHeadlines}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : headlines.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No headlines available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {headlines.map((news) => (
                  <Link
                    key={news._id}
                    to={news.slug}
                    className="group flex gap-3"
                  >
                    <img
                      src={news.image || "/images/no-image.webp"}
                      alt={news.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/images/no-image.webp";
                      }}
                      className="w-28 h-20 rounded-md object-cover shrink-0"
                    />

                    <div>
                      <h3 className="text-[15px] font-medium leading-6 text-gray-800 group-hover:text-red-700 dark:text-gray-200 dark:group-hover:text-red-500 transition-colors duration-300 line-clamp-3">
                        {news.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;