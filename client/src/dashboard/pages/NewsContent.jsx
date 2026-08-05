import { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import {
  Newspaper,
  ImageOff,
  Trash2,
  Search,
  MoreVertical,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { newsService } from "../../features/news/services/newsService";
import { categoryService } from "../../features/category/services/categoryService";
import { useClickOutside } from "../../hooks/useClickOutside";
import ConfirmModal from "../pages/ConfirmModal";
import Toast from "../pages/Toast";

// ----------------------------------------------------------------------
// Status Badges & Styling
// ----------------------------------------------------------------------
const STATUS_STYLES = {
  published: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-600/20",
    dot: "bg-emerald-500 animate-pulse",
    label: "Published",
  },
  draft: {
    badge: "bg-amber-50 text-amber-800 border-amber-200/80 ring-amber-600/20",
    dot: "bg-amber-500",
    label: "Draft",
  },
  scheduled: {
    badge: "bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-600/20",
    dot: "bg-blue-500",
    label: "Scheduled",
  },
};

const StatusBadge = ({ status }) => {
  const current = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${current.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

// Dynamic Category Soft Color Generator
const getCategoryStyle = (catName = "") => {
  const name = catName.toLowerCase();
  if (name.includes("sport")) return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  if (name.includes("politic")) return "bg-blue-50 text-blue-700 border-blue-200/80";
  if (name.includes("tech") || name.includes("gadget")) return "bg-purple-50 text-purple-700 border-purple-200/80";
  if (name.includes("entert") || name.includes("media")) return "bg-rose-50 text-rose-700 border-rose-200/80";
  if (name.includes("busin") || name.includes("econ")) return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
  return "bg-slate-50 text-slate-700 border-slate-200";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const LIMIT = 10;

// ----------------------------------------------------------------------
// Sleek Action Portal Dropdown Menu
// ----------------------------------------------------------------------
const NewsActionDropdown = ({ item, isSuperAdmin, isBusy, onInitiateDelete }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setOpen(false), open);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 130;
    const menuWidth = 160;

    // Open upward if in the bottom 40% of screen
    const openUpward = rect.bottom > window.innerHeight * 0.6;

    setCoords({
      top: openUpward
        ? rect.top + window.scrollY - menuHeight - 4
        : rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - menuWidth,
    });
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open) calculatePosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = () => calculatePosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, calculatePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={isBusy}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="z-[9999] w-40 rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
          >
            <a
              href={`/news/${item.slug || item._id}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eye size={14} className="text-slate-500 shrink-0" />
              <span>Preview</span>
            </a>

            <Link
              to={`/dashboard/news/edit/${item._id}`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              <Edit3 size={14} className="text-amber-600 shrink-0" />
              <span>Edit Article</span>
            </Link>

            {isSuperAdmin && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setOpen(false);
                    onInitiateDelete(item);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={14} className="text-rose-500 shrink-0" />
                  <span>Delete Article</span>
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

// ----------------------------------------------------------------------
// Main News Content Component
// ----------------------------------------------------------------------
const NewsContent = () => {
  const { userInfo } = useAuth();
  const isSuperAdmin = userInfo?.role === "superadmin";

  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal & Toast States
  const [activeModal, setActiveModal] = useState({ isOpen: false, item: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // 1. Debounce Search (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Fetch Categories Safely
  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        const catArray = Array.isArray(res) ? res : res?.data || res?.categories || [];
        if (!cancelled) setCategories(catArray);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // 3. Fetch News List
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await newsService.getAllNews({
        status: "published",
        page,
        limit: LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryId && { category: categoryId }),
      });
      setNewsList(res?.data || res?.news || []);
      setMeta(res?.meta || { total: res?.total || 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err.message || "নিউজ লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle Delete Confirmation
  const handleInitiateDelete = (item) => {
    setActiveModal({ isOpen: true, item });
  };

  const handleConfirmDelete = async () => {
    const { item } = activeModal;
    if (!item) return;

    try {
      setActionLoading(true);
      await newsService.deleteNews(item._id);
      setNewsList((prev) => prev.filter((news) => news._id !== item._id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setToast({
        message: `✓ Article "${item.title}" deleted successfully.`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete article.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
      setActiveModal({ isOpen: false, item: null });
    }
  };

  // Pagination Range Display Calculation
  const startRange = meta.total === 0 ? 0 : (meta.page - 1) * LIMIT + 1;
  const endRange = Math.min(meta.page * LIMIT, meta.total);

  return (
    <div className="space-y-6 pb-12">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <ConfirmModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ isOpen: false, item: null })}
        onConfirm={handleConfirmDelete}
        type="delete"
        title="Delete Article"
        isLoading={actionLoading}
        message={`Are you sure you want to delete "${activeModal.item?.title}"? This action cannot be undone.`}
      />

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper size={20} className="text-amber-700" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Published News Library
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage and oversee all published articles across authors and categories.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="px-6 py-3.5 flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by article title..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-52 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Thumbnail</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Published</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
                      <span>Loading news library...</span>
                    </div>
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 font-medium">
                    No matching articles found.
                  </td>
                </tr>
              ) : (
                newsList.map((item, index) => (
                  <tr
                    key={item._id}
                    className="group border-b border-slate-100/80 hover:bg-amber-50/40 hover:shadow-sm transition-all duration-150"
                  >
                    <td className="px-5 py-3.5 text-slate-400 font-medium">
                      {(meta.page - 1) * LIMIT + index + 1}
                    </td>

                    {/* Thumbnail with Hover Zoom */}
                    <td className="px-5 py-3.5">
                      {item.thumbnail?.media?.url || item.thumbnail?.url ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm w-11 h-11">
                          <img
                            src={item.thumbnail?.media?.url || item.thumbnail?.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </td>

                    {/* Author */}
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {item.author?.name || "—"}
                    </td>

                    {/* Category with Soft Color Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryStyle(
                          item.category?.name
                        )}`}
                      >
                        {item.category?.name || "—"}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Portal Dropdown Menu */}
                    <td className="px-5 py-3.5 text-right">
                      <NewsActionDropdown
                        item={item}
                        isSuperAdmin={isSuperAdmin}
                        isBusy={actionLoading && activeModal.item?._id === item._id}
                        onInitiateDelete={handleInitiateDelete}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Range Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{startRange}–{endRange}</span> of{" "}
            <span className="font-bold text-slate-800">{meta.total}</span> results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="px-3 py-1 text-xs font-bold rounded-xl bg-amber-600 text-white">
              {meta.page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              disabled={meta.page >= meta.pages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsContent;