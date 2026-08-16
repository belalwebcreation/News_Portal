import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from "../../services/profileService";

/**
 * ============================================================================
 * NEWS PORTAL — READER DASHBOARD — wired to real backend endpoints.
 *
 * Confirmed against server.js:
 *   - profileRoutes is mounted at "/news/api/profile"
 *     (app.use("/news/api/profile", profileRoutes)), so every call below
 *     MUST include that "/news" prefix or it will 404.
 *   - CORS has credentials: true and the app uses cookie-parser for HttpOnly
 *     auth cookies, so fetch calls use credentials: "include".
 *
 * Endpoints actually used (from profile.routes.js):
 *   GET /news/api/profile/saved-news    -> Bookmarks panel + "Bookmarked" stat count
 *   GET /news/api/profile/reading-history -> Continue Reading panel + "Articles Read" stat
 *
 * NOTE: the Profile / Settings account cards (and the GET /news/api/profile
 * call that fed the Profile card) have been removed from this page — that
 * data is no longer needed here.
 *
 * NOT wired up because there's no backend support for them:
 *   - Recent Comments (no Comment model/controller/route exists)
 *   - "Comments" / "Following" / "Day Streak" stats (nothing tracks these)
 *   - Thumbnail images for reading-history/bookmark items (profile.repository.js
 *     populates "news.author" and "news.category" but not "news.thumbnail.media",
 *     so there's no image URL available — a placeholder icon is used instead)
 * ============================================================================
 */

const IconBookmark = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 4h12v16l-6-4-6 4V4z" />
  </svg>
);

const IconBookOpen = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 5.5c2-1 5-1 8 .5 3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5v-13z" />
    <path d="M12 6v13" />
  </svg>
);

const IconArrowRight = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

const IconTrash = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ReaderIndex = () => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [readingHistoryTotal, setReadingHistoryTotal] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksTotal, setBookmarksTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const handleRemoveBookmark = async (newsId) => {
    if (!newsId) return;

    try {
      await profileService.toggleBookmark(newsId);

      setBookmarks((prev) =>
        prev.filter(
          (item) => item?.news?._id !== newsId
        )
      );

      setBookmarksTotal((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to remove bookmark:",
        error
      );
    }
  };

useEffect(() => {
  const fetchDashboard = async () => {
    setLoading(true);
    setErrors({});

    const [historyRes, bookmarksRes, bookmarksCountRes] =
  await Promise.allSettled([
    profileService.getReadingHistory(1, 5),
    profileService.getSavedNews(1, 3),
    profileService.getSavedNewsCount(), // NEW
  ]);

    const nextErrors = {};

    /* ===============================
       Reading History
    =============================== */

    if (historyRes.status === "fulfilled") {
      const historyData = historyRes.value;

      if (Array.isArray(historyData)) {
        const validHistory = historyData.filter(
          (item) => item?.news
        );

        setReadingHistory(validHistory);

        // profileService currently returns data.data,
        // so pagination.total is not available here.
        setReadingHistoryTotal(validHistory.length);
      } else {
        setReadingHistory([]);
        setReadingHistoryTotal(0);
        nextErrors.history =
          "Could not load reading history.";
      }
    } else {
      console.error(
        "Reading history error:",
        historyRes.reason
      );

      setReadingHistory([]);
      setReadingHistoryTotal(0);

      nextErrors.history =
        "Could not load reading history.";
    }

    /* ===============================
       Bookmarks
    =============================== */

    if (bookmarksRes.status === "fulfilled") {
      const bookmarksData = bookmarksRes.value;

      if (Array.isArray(bookmarksData)) {
        const validBookmarks = bookmarksData.filter((item) => item?.news);

        setBookmarks(validBookmarks);

        if (
          bookmarksCountRes.status === "fulfilled" &&
          bookmarksCountRes.value?.total !== undefined
        ) {
          setBookmarksTotal(bookmarksCountRes.value.total);
        } else {
          setBookmarksTotal(validBookmarks.length);
        }
      } else {
        setBookmarks([]);
        setBookmarksTotal(0);
        nextErrors.bookmarks = "Could not load bookmarks.";
      }
    } else {
      console.error("Bookmarks error:", bookmarksRes.reason);
      setBookmarks([]);
      setBookmarksTotal(0);
      nextErrors.bookmarks = "Could not load bookmarks.";
    }

    setErrors(nextErrors);
    setLoading(false);
  };

  fetchDashboard();
}, []);

  const stats = [
    { label: 'Bookmarked', value: bookmarksTotal, icon: IconBookmark, color: 'amber' },
    { label: 'Articles Read', value: readingHistoryTotal, icon: IconBookOpen, color: 'emerald' },
  ];

  const colorStyles = {
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  };

  if (loading) {
    return (
      <div className="mt-3 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse dark:bg-gray-900 dark:border-gray-800 dark:shadow-none" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse dark:bg-gray-900 dark:border-gray-800 dark:shadow-none" />
        <div className="h-48 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse dark:bg-gray-900 dark:border-gray-800 dark:shadow-none" />
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="w-full p-6 flex flex-col items-start gap-y-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:shadow-none dark:hover:ring-white/10"
            >
              <span className={`inline-flex items-center justify-center h-11 w-11 rounded-lg ${colorStyles[stat.color]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Reading */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Continue Reading</h2>
            <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">Pick up where you left off</p>
          </div>
          <Link
            to="/reader/history"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {errors.history ? (
          <p className="px-5 py-6 text-sm text-red-500 dark:text-red-400">{errors.history}</p>
        ) : readingHistory.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">No reading history yet. Articles you open will show up here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 dark:bg-gray-800/50 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400">Article</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400">Category</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400">Last Read</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400">Progress</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-right dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {readingHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/70 transition-colors dark:hover:bg-gray-800/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400 flex-shrink-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                          <IconBookOpen className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate max-w-[280px] dark:text-white">{item.news.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium dark:bg-gray-800 dark:text-gray-300">
                        {item.news.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap dark:text-gray-400">{formatDate(item.lastReadAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 dark:bg-gray-800">
                          <div
                            className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {item.progress === 100 ? 'Completed' : `${item.progress}%`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/news/${item.news.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        {item.progress === 100 ? 'Read again' : 'Continue'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Your Bookmarks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 p-5 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Bookmarks</h2>
            <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">Articles you've saved to read later</p>
          </div>
          <Link
            to="/reader/bookmarks"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {errors.bookmarks ? (
          <p className="text-sm text-red-500 dark:text-red-400">{errors.bookmarks}</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No bookmarks yet. Save articles to find them here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {bookmarks.map((item) => {
    const news = item?.news;

    if (!news) return null;

    const thumbnailUrl =
      news.thumbnail?.media?.url ||
      "/images/news-placeholder.jpg";

    return (
      <div
        key={item._id}
        className="group rounded-xl border border-gray-100 overflow-hidden bg-white transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10"
      >
        {/* ==========================================
            ARTICLE IMAGE
        ========================================== */}
        <Link
          to={`/news/${news.slug}`}
          className="block"
        >
          <div className="relative h-40 bg-gray-100 overflow-hidden dark:bg-gray-800">
            <img
              src={thumbnailUrl}
              alt={news.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(event) => {
                event.currentTarget.src =
                  "/images/news-placeholder.jpg";
              }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

            {/* Category */}
            <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-white/90 text-gray-800 text-xs font-semibold backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
              {news.category?.name || "Uncategorized"}
            </span>

            {/* Bookmark icon */}
            <span className="absolute top-2 right-2 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-amber-500 backdrop-blur-sm shadow-sm dark:bg-gray-900/90 dark:text-amber-400">
              <IconBookmark className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* ==========================================
            CONTENT
        ========================================== */}
        <div className="p-4">
          <Link
            to={`/news/${news.slug}`}
            className="block"
          >
            <p className="text-sm font-semibold leading-6 text-gray-900 line-clamp-2 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
              {news.title}
            </p>
          </Link>

          <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
            Saved on {formatDate(item.createdAt)}
          </p>

          {/* ==========================================
              BOTTOM ACTION
          ========================================== */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end dark:border-gray-800">
            <button
              type="button"
              onClick={() =>
                handleRemoveBookmark(news._id)
              }
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              title="Remove bookmark"
            >
              <IconTrash className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
        )}
      </div>
    </div>
  );
};

export default ReaderIndex;