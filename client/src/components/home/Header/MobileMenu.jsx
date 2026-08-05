import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHome,
  FiChevronRight,
  FiRefreshCw,
  FiInbox,
} from "react-icons/fi";

/* ==========================================
   Category accent (color dot) — purely visual,
   keeps the list scannable when there are
   many categories. Matches by keyword in slug.
   ========================================== */
const CATEGORY_ACCENTS = [
  { match: /tech/, dot: "bg-sky-500" },
  { match: /sport/, dot: "bg-emerald-500" },
  { match: /politic/, dot: "bg-rose-500" },
  { match: /business|finance|econom/, dot: "bg-amber-500" },
  { match: /entertain|lifestyle|cinema|music/, dot: "bg-purple-500" },
  { match: /world|international/, dot: "bg-indigo-500" },
];

const getCategoryDot = (slug = "") => {
  const s = slug.toLowerCase();
  const found = CATEGORY_ACCENTS.find((c) => c.match.test(s));
  return found ? found.dot : "bg-red-600";
};

// Navbar.jsx-এর মতো একই কন্ডিশনাল লজিক — item হয় "Home", নয়তো একটা category
const getItemLabel = (item) => (item.isHome ? item.title : item.category?.name);
const getItemPath = (item) => (item.isHome ? "/" : `/category/${item.category?.slug}`);

const SKELETON_ROWS = [92, 68, 80, 55, 74, 63];

/**
 * MobileMenu — এখন এটা প্রথম আলো-স্টাইলে একটা ফুলস্ক্রিন overflow মেনু:
 * top nav bar-এ যে item গুলো জায়গায় আঁটেনি (useNavOverflow থেকে
 * overflowItems), সেগুলোই এখানে দেখানো হয়।
 *
 * আগে এটা ডান পাশে ৮৫% width-এর একটা drawer হিসেবে খুলত, এবং
 * Header/Navbar-এর কোনো ancestor-এ transform / filter / backdrop-blur
 * থাকলে (যেগুলো fixed positioning-এর জন্য একটা নতুন containing block
 * তৈরি করে দেয়) সেটার ভেতরেই আটকে থাকত — ফলে পুরো viewport না ঢেকে
 * ছোট্ট একটা বক্সের মতো দেখাচ্ছিল। এখন পুরো প্যানেলটা createPortal দিয়ে
 * সরাসরি document.body-তে রেন্ডার হয় (ConfirmDialog / BubbleMenu-তে যেভাবে
 * করা হয়েছে ঠিক সেভাবে), তাই কোনো ancestor-এর CSS-এর প্রভাব আর পড়ে না।
 *
 * items -> [{ _id/id, isHome?, title?, category?: { name, slug } }]
 * loading/error/onRetry -> চাইলে ব্যবহার করো (optional), না দিলে ক্ষতি নেই
 */
const MobileMenu = ({ items = [], loading = false, error = "", onRetry }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // enter/exit animation drives off this
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  // যদি লিস্ট খালি হয়ে যায় (যেমন refetch fail), মেনু বন্ধ করে দাও
  useEffect(() => {
    if (!loading && items.length === 0) setOpen(false);
  }, [items.length, loading]);

  // মেনু খোলা থাকলে body scroll লক
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape চাপলে বন্ধ হবে (ফুলস্ক্রিন হওয়ায় আর "বাইরে ক্লিক" বলে কিছু নেই)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // খোলার এক frame পরে animation trigger (CSS transition ধরার জন্য) +
  // search বক্সে ফোকাস। বন্ধ হলে query রিসেট।
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setMounted(true));
      const t = setTimeout(() => searchRef.current?.focus(), 320);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
    setMounted(false);
    setQuery("");
  }, [open]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((item) => (getItemLabel(item) || "").toLowerCase().includes(q));
  }, [items, query]);

  const showSearch = items.length > 6;
  const badgeCount = !loading && !error ? items.length : 0;

  return (
    <>
      {/* Toggle button — always rendered, so the user never loses access
          to navigation while categories are loading or empty */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative w-11 h-11 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-red-700 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <span className="relative block w-6 h-6">
          <FiMenu
            size={24}
            className={`absolute inset-0 transition-all duration-300 ${
              open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <FiX
            size={24}
            className={`absolute inset-0 transition-all duration-300 ${
              open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
            }`}
          />
        </span>

        {badgeCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-700 text-white text-[10px] font-semibold flex items-center justify-center">
            {badgeCount}
          </span>
        )}
        {loading && !open && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
        )}
      </button>

      {/* Full-screen menu — portaled straight into <body>, so it always
          covers the real viewport no matter what CSS any ancestor uses. */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className={`fixed inset-0 z-[100] bg-white flex flex-col transition-all duration-300 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ height: "100dvh" }}
          >
            <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-gray-100">
              <span className="text-base font-extrabold text-red-700 tracking-tight">
                মেনু
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Search — শুধু লিস্ট বড় হলে দরকার */}
            {showSearch && (
              <div className="shrink-0 px-5 py-3 border-b border-gray-100">
                <div className="relative">
                  <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ক্যাটাগরি খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="px-5 pt-4 pb-1 shrink-0 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                আরও
              </span>
              {!loading && !error && items.length > 0 && (
                <span className="text-xs font-semibold text-gray-400">{filteredItems.length}</span>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto pb-6">
              {loading ? (
                <div className="pt-1">
                  {SKELETON_ROWS.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 animate-pulse"
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
                      <span className="h-3.5 rounded bg-gray-200" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="px-5 py-10 text-center space-y-3">
                  <p className="text-sm text-gray-500">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
                    >
                      <FiRefreshCw size={14} /> আবার চেষ্টা করুন
                    </button>
                  )}
                </div>
              ) : items.length === 0 ? (
                <div className="px-5 py-10 text-center space-y-2">
                  <FiInbox size={28} className="mx-auto text-gray-300" />
                  <p className="text-sm text-gray-500">এই মুহূর্তে এখানে দেখানোর কিছু নেই</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-gray-500">
                    "{query}" এর সাথে মিলে এমন কোনো ক্যাটাগরি পাওয়া যায়নি
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item._id || item.id}
                    className={`transition-all duration-300 ease-out ${
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ transitionDelay: mounted ? `${Math.min(index, 14) * 30}ms` : "0ms" }}
                  >
                    <NavLink
                      to={getItemPath(item)}
                      end={item.isHome}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 transition-colors duration-200 ${
                          isActive
                            ? "bg-red-50 text-red-700"
                            : "text-gray-800 hover:bg-gray-50 hover:text-red-700"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        {item.isHome ? (
                          <FiHome size={16} className="shrink-0 text-gray-400 group-hover:text-red-600" />
                        ) : (
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${getCategoryDot(item.category?.slug)}`}
                          />
                        )}
                        <span className="text-[15px] font-medium truncate">{getItemLabel(item)}</span>
                      </span>
                      <FiChevronRight
                        size={16}
                        className="shrink-0 text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-transform"
                      />
                    </NavLink>
                  </div>
                ))
              )}
            </nav>
          </div>,
          document.body
        )}
    </>
  );
};

export default MobileMenu;
