import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userService } from "../../features/users/userService";
import { newsService } from "../../features/news/services/newsService";
import axiosInstance from "../../utils/axiosInstance"; // ⚠️ ADJUST: WriterDashboard-e eivabei ache, path thik kore nin
import { useAuth } from "../../context/AuthContext"; // ⚠️ ADJUST: path onujayi thik kore nin
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import { ArrowRight, Loader2, Award, Users, Eye, ImageOff } from "lucide-react";

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

// Rank Badge Styles (shared: Top Writers + Top Views News)
const rankBadgeStyles = {
  1: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-100',
  2: 'bg-slate-300 text-slate-800 ring-2 ring-slate-100',
  3: 'bg-amber-700/80 text-white ring-2 ring-amber-50',
};

// ✅ NEW — "My Articles" section constants (WriterDashboard theke merge kora)
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

const AdminIndex = () => {
  const { userInfo } = useAuth();
  // ✅ NEW — admin/superadmin nijeder lekha article manage korar jonno (Writer Dashboard-er moto)
  const authorId = userInfo?.id || userInfo?._id;

  const [topWriters, setTopWriters] = useState([]);
  const [writersLoading, setWritersLoading] = useState(true);
  const [writersError, setWritersError] = useState(null);

  const [topNews, setTopNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // ✅ NEW — "My Articles" state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [myNewsList, setMyNewsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [activeTab, setActiveTab] = useState("published");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [deletingId, setDeletingId] = useState(null);

  const limit = 8;

  useEffect(() => {
    let isMounted = true;
    const fetchTopWriters = async () => {
      try {
        setWritersLoading(true);
        setWritersError(null);
        const data = await userService.getTopWriters(5);
        if (isMounted) {
          setTopWriters(Array.isArray(data) ? data : data?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setWritersError(error.message || "টপ রাইটারদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
        }
      } finally {
        if (isMounted) setWritersLoading(false);
      }
    };

    fetchTopWriters();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTopNews = async () => {
      try {
        setNewsLoading(true);
        setNewsError(null);
        const data = await newsService.getTopViewedNews(5);
        if (isMounted) {
          setTopNews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setNewsError(error.message || "টপ ভিউড নিউজ লোড করতে ব্যর্থ হয়েছে।");
        }
      } finally {
        if (isMounted) setNewsLoading(false);
      }
    };

    fetchTopNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ NEW — Debounce search input (My Articles table)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ✅ NEW — My Articles stats
  const fetchStats = useCallback(async () => {
    if (!authorId) return;
    setStatsLoading(true);
    try {
      const res = await axiosInstance.get("/api/news/writer-stats");
      setStats(res.data?.data || null);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [authorId]);

  // ✅ NEW — My Articles list
  const fetchMyNewsList = useCallback(async () => {
    if (!authorId) return;
    setListLoading(true);
    setListError(null);
    try {
      const params = { author: authorId, page, limit };
      if (activeTab !== "all") params.status = activeTab;
      if (search) params.search = search;

      const res = await axiosInstance.get("/api/news", { params });
      setMyNewsList(res.data?.data || []);
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
  }, [authorId, activeTab, search, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchMyNewsList();
  }, [fetchMyNewsList]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  // ⚠️ ADJUST করুন: actual editor route confirm kore nin
  const editPath = (id) => `/dashboard/writer/add-news/editor?id=${id}`;

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`"${title}" ডিলিট করতে চান? এটা পূর্বাবস্থায় ফেরানো যাবে না।`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/news/${id}`);
      await Promise.all([fetchMyNewsList(), fetchStats()]);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.message || "ডিলিট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setDeletingId(null);
    }
  };

  const maxViews = Math.max(...topWriters.map((w) => w.stats?.totalViews || 0), 1);
  const maxNewsViews = Math.max(...topNews.map((n) => n.views || 0), 1);

  return (
    <div className="mt-3 space-y-6">
      {/* Stat cards — (Unchanged placeholder/integration) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* ... Stat Cards Content ... */}
      </div>

      {/* Recent news — (Unchanged placeholder/integration) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* ... Recent News Table/List Content ... */}
      </div>

      {/* ✅ NEW — "My Articles" section: admin/superadmin nijerao article likhte pare,
          tai Writer Dashboard-er pura flow (create button + stat cards + tabbed
          list + search + pagination + edit/delete) ekhane hubohu merge kora holo. */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-900 text-white flex items-center justify-center">
              <LuLayoutDashboard size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">আপনার লেখা নিউজ</h2>
              <p className="text-sm text-slate-500">
                স্বাগতম, {userInfo?.name || userInfo?.username || "Admin"} 👋 — নিজের লেখা article এখান থেকে ম্যানেজ করুন
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/writer/add-news" // ⚠️ ADJUST: admin/superadmin er actual "create news" route
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

                {!listLoading && !listError && myNewsList.length === 0 && (
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
                  myNewsList.map((item) => (
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

      {/* Top Writers + Top Views News — side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Writers Section — Production Grade UI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 transition-all">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Top Writers
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Ranked dynamically by total published article views
              </p>
            </div>
            <Link
              to="/admin/writers"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {writersLoading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-8">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                <span>রাইটার লিস্ট লোড হচ্ছে...</span>
              </div>
            ) : writersError ? (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-center">
                <p className="text-xs sm:text-sm font-medium text-rose-600">{writersError}</p>
              </div>
            ) : topWriters.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">এখনো কোনো লেখক ডাটা পাওয়া যায়নি</p>
              </div>
            ) : (
              topWriters.map((writer, index) => {
                const rank = index + 1;
                const views = writer.stats?.totalViews || 0;
                const widthPct = Math.min(Math.max((views / maxViews) * 100, 4), 100);

                return (
                  <div
                    key={writer._id || index}
                    className="flex items-center gap-3 sm:gap-4 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
                  >
                    <span
                      className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                        rankBadgeStyles[rank] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rank}
                    </span>

                    <div className="shrink-0">
                      <ProfileAvatar
                        src={writer.avatar?.url || writer.avatar}
                        alt={writer.name}
                        size="sm"
                        className="border border-slate-200 shadow-sm"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                          {writer.name || "Unknown Author"}
                        </p>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {views.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        Views
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Views News Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 transition-all">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Top Views News
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Ranked by all-time total views (published only)
              </p>
            </div>
            <Link
              to="/admin/news" // ⚠️ ADJUST: admin news master list-er actual route
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {newsLoading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-8">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>নিউজ লিস্ট লোড হচ্ছে...</span>
              </div>
            ) : newsError ? (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-center">
                <p className="text-xs sm:text-sm font-medium text-rose-600">{newsError}</p>
              </div>
            ) : topNews.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">এখনো কোনো নিউজ ডাটা পাওয়া যায়নি</p>
              </div>
            ) : (
              topNews.map((item, index) => {
                const rank = index + 1;
                const views = item.views || 0;
                const widthPct = Math.min(Math.max((views / maxNewsViews) * 100, 4), 100);
                const thumbUrl = item.thumbnail?.media?.url;

                return (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-3 sm:gap-4 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
                  >
                    <span
                      className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                        rankBadgeStyles[rank] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rank}
                    </span>

                    <div className="shrink-0 h-9 w-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageOff className="h-4 w-4 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </p>
                        {item.category?.name && (
                          <span className="shrink-0 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.category.name}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {views.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        Views
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminIndex;