import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // ✅ প্রজেক্টের shared axios instance (Bearer token attach + error normalize করে)
import { useAuth } from "../../context/AuthContext";

import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePostAdd, MdOutlineArticle } from "react-icons/md";
import {
  FiEye,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
} from "react-icons/fi";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
];

const STAT_CARDS = [
  { key: "totalPosts", label: "Total Posts", icon: MdOutlineArticle, color: "bg-slate-100 text-slate-700" },
  { key: "publishedCount", label: "Published", icon: FiFileText, color: "bg-emerald-100 text-emerald-700" },
  { key: "draftCount", label: "Drafts", icon: FiEdit2, color: "bg-amber-100 text-amber-800" },
  { key: "featuredCount", label: "Featured", icon: FiStar, color: "bg-purple-100 text-purple-700" },
  { key: "totalViews", label: "Total Views", icon: FiEye, color: "bg-blue-100 text-blue-700" },
  { key: "totalComments", label: "Comments", icon: FiMessageSquare, color: "bg-indigo-100 text-indigo-700" },
  { key: "totalShares", label: "Shares", icon: FiShare2, color: "bg-teal-100 text-teal-700" },
  { key: "totalBookmarks", label: "Bookmarks", icon: FiBookmark, color: "bg-rose-100 text-rose-700" },
];

const StatusBadge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
      status === "published"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-800"
    }`}
  >
    {status}
  </span>
);

const WriterDashboard = () => {
  const { userInfo } = useAuth();
  // ✅ ArticleEditorRoute / ManageNews এ userInfo?.id ব্যবহার হচ্ছে (App.jsx দেখে),
  // তাই .id আগে চেক করে, না পেলে ._id fallback রাখা হলো
  const writerId = userInfo?.id || userInfo?._id;

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [newsList, setNewsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [deletingId, setDeletingId] = useState(null);

  const limit = 8;

  // --- Debounce search input so we don't fire a request every keystroke ---
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // --- Stats ---
  const fetchStats = useCallback(async () => {
    if (!writerId) return;
    setStatsLoading(true);
    try {
      const res = await axiosInstance.get("/api/news/writer-stats");
      setStats(res.data?.data || null);
    } catch (err) {
      console.error("Failed to load writer stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [writerId]);

  // --- News list ---
  const fetchNewsList = useCallback(async () => {
    if (!writerId) return;
    setListLoading(true);
    setListError(null);
    try {
      const params = { author: writerId, page, limit };
      if (activeTab !== "all") params.status = activeTab;
      if (search) params.search = search;

      const res = await axiosInstance.get("/api/news", { params });
      setNewsList(res.data?.data || []);
      setMeta({
        total: res.data?.meta?.total || 0,
        pages: res.data?.meta?.pages || 1,
      });
    } catch (err) {
      console.error("Failed to load news list:", err);
      setListError(err?.message || "News list লোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setListLoading(false);
    }
  }, [writerId, activeTab, search, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchNewsList();
  }, [fetchNewsList]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  // ⚠️ ADJUST করুন: App.jsx তে "writer/add-news/editor" route এ কোনো :id param নেই,
  // আর ManageNews.jsx/CreateNewsHub.jsx না দেখে edit ঠিক কীভাবে trigger হয় (query param?
  // router state?) নিশ্চিত হওয়া যায়নি। আপাতত query param ধরে রাখা হলো — আপনার
  // actual editor flow অনুযায়ী এই লাইনটা বদলে দিন।
  const editPath = (id) => `/dashboard/writer/add-news/editor?id=${id}`;

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`"${title}" ডিলিট করতে চান? এটা পূর্বাবস্থায় ফেরানো যাবে না।`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/news/${id}`);
      await Promise.all([fetchNewsList(), fetchStats()]);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.message || "ডিলিট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-900 text-white flex items-center justify-center">
            <LuLayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Writer Dashboard</h1>
            <p className="text-sm text-slate-500">
              স্বাগতম, {userInfo?.name || userInfo?.username || "Writer"} 👋
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/writer/add-news"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 text-white font-medium shadow-md hover:bg-amber-800 transition-all duration-300"
        >
          <MdOutlinePostAdd size={20} />
          Create News
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 leading-none">
                {statsLoading ? "…" : (stats?.[key] ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* News List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-amber-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-amber-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-10" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))}

              {!listLoading && listError && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-red-500">
                    {listError}
                  </td>
                </tr>
              )}

              {!listLoading && !listError && newsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-slate-500 mb-3">
                      {search || activeTab !== "all"
                        ? "এই ফিল্টারে কোনো news পাওয়া যায়নি।"
                        : "এখনো কোনো news লেখা হয়নি।"}
                    </p>
                    <Link
                      to="/dashboard/writer/add-news"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900 text-white text-sm font-medium hover:bg-amber-800 transition-colors"
                    >
                      <MdOutlinePostAdd size={16} /> প্রথম News লিখুন
                    </Link>
                  </td>
                </tr>
              )}

              {!listLoading &&
                !listError &&
                newsList.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-amber-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.category?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{(item.views ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={editPath(item._id)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-amber-900 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={deletingId === item._id}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!listLoading && meta.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-slate-500">
              মোট {meta.total} টি — পাতা {page} / {meta.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-slate-600 disabled:opacity-40 hover:bg-amber-50"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page >= meta.pages}
                className="p-2 rounded-lg border border-gray-200 text-slate-600 disabled:opacity-40 hover:bg-amber-50"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterDashboard;
