import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../../context/NotificationContext";

const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMin < 1) return "এইমাত্র";
  if (diffMin < 60) return `${diffMin} মিনিট আগে`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ঘণ্টা আগে`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} দিন আগে`;

  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleItemClick = (notification) => {
    setOpen(false);
    if (!notification.isRead) markAsRead(notification._id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Notifications"
        className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-900 hover:text-white transition-all duration-300 flex items-center justify-center"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 text-[10px] leading-4 text-white font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100">
              নোটিফিকেশন
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-500"
              >
                সব পড়া হয়েছে
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.length === 0 && !loading ? (
              <p className="px-5 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                কোনো নোটিফিকেশন নেই।
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left px-5 py-3.5 flex gap-3 items-start hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                    !n.isRead ? "bg-amber-50/60 dark:bg-amber-900/10" : ""
                  }`}
                >
                  {!n.isRead && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  )}
                  <div className={!n.isRead ? "" : "pl-5"}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}

            {hasMore && notifications.length > 0 && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 text-xs font-semibold text-amber-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "লোড হচ্ছে…" : "আরও দেখুন"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;