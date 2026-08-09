import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX, FiTrendingUp, FiClock } from "react-icons/fi";

const recentSearches = [
  "রাজশাহী কলেজ",
  "ভর্তি বিজ্ঞপ্তি",
  "পরীক্ষার রুটিন",
];

const trendingSearches = [
  "নোটিশ",
  "একাডেমিক",
  "খেলাধুলা",
  "বৃত্তি",
  "ফলাফল",
];

const SearchBox = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();

    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div ref={searchRef} className="relative">

      {/* Search Icon */}

      <button
        onClick={() => setOpen(true)}
        className="text-gray-800 hover:text-red-700 dark:text-gray-200 dark:hover:text-red-500 duration-300"
      >
        <FiSearch size={22} />
      </button>

      {/* Popup */}

      {open && (
        <div className="absolute right-0 mt-4 w-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50">

          {/* Header */}

          <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3">

            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খবর খুঁজুন..."
              className="flex-1 outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />

            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-red-700 dark:text-gray-300 dark:hover:text-red-500 duration-300"
            >
              <FiX size={22} />
            </button>

          </div>

          {/* Recent */}

          <div className="p-4">

            <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">

              <FiClock />

              <h3 className="font-semibold">
                সাম্প্রতিক অনুসন্ধান
              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {recentSearches.map((item, i) => (

                <button
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-red-700 hover:text-white duration-300 text-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-red-700 dark:hover:text-white"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          {/* Trending */}

          <div className="border-t border-gray-200 dark:border-gray-800 p-4">

            <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">

              <FiTrendingUp />

              <h3 className="font-semibold">
                জনপ্রিয় অনুসন্ধান
              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {trendingSearches.map((item, i) => (

                <button
                  key={i}
                  className="px-3 py-1 rounded-full bg-red-50 text-red-700 hover:bg-red-700 hover:text-white duration-300 text-sm dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default SearchBox;
