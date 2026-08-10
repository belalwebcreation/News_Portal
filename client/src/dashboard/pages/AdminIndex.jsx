import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userService } from "../../features/users/userService";
import { newsService } from "../../features/news/services/newsService";
import axiosInstance from "../../utils/axiosInstance"; // ⚠️ ADJUST: WriterDashboard-e eivabei ache, path thik kore nin
import { useAuth } from "../../context/AuthContext"; // ⚠️ ADJUST: path onujayi thik kore nin
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import { ArrowRight, Award, Users, Eye, ImageOff, Calendar } from "lucide-react";

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
  1: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-100 dark:ring-amber-900/40',
  2: 'bg-slate-300 text-slate-800 ring-2 ring-slate-100 dark:bg-slate-600 dark:text-slate-100 dark:ring-slate-800',
  3: 'bg-amber-700/80 text-white ring-2 ring-amber-50 dark:ring-amber-950/40',
};

// ✅ NEW — "My Articles" section constants (WriterDashboard theke merge kora)
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
];

// Softer, unified tint tokens — reads as one coherent scoreboard instead of
// eight mismatched card colors.
const STAT_CARDS = [
  { key: "totalPosts", label: "Total Posts", icon: MdOutlineArticle, color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  { key: "publishedCount", label: "Published", icon: FiFileText, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { key: "draftCount", label: "Drafts", icon: FiEdit2, color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  { key: "featuredCount", label: "Featured", icon: FiStar, color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
  { key: "totalViews", label: "Total Views", icon: FiEye, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  { key: "totalComments", label: "Comments", icon: FiMessageSquare, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" },
  { key: "totalShares", label: "Shares", icon: FiShare2, color: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400" },
  { key: "totalBookmarks", label: "Bookmarks", icon: FiBookmark, color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
];

// Small shared primitives -----------------------------------------------

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-slate-100 dark:bg-slate-700 ${className}`} />
);

const StatusBadge = ({ status }) => {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-400/20"
          : "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-400/20"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
      {status}
    </span>
  );
};

const LeaderboardSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2 sm:gap-4">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
        </div>
        <div className="h-3 w-8 shrink-0 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
      </div>
    ))}
  </div>
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
      {/* ───────────────── Masthead — the one bold moment on the page ───────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 px-6 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              নিউজরুম ড্যাশবোর্ড
            </p>
            <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              স্বাগতম, {userInfo?.name || userInfo?.username || "Admin"}
            </h1>
            <p className="mt-1.5 text-sm text-amber-100/70">
              আজকের কনটেন্ট পারফরম্যান্স ও আপনার লেখা এক নজরে দেখুন
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-amber-50 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-medium tabular-nums">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards — (Unchanged placeholder/integration) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* ... Stat Cards Content ... */}
      </div>

      {/* Recent news — (Unchanged placeholder/integration) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        {/* ... Recent News Table/List Content ... */}
      </div>

      {/* ✅ NEW — "My Articles" panel */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-900 text-white shadow-sm shadow-amber-900/20">
              <LuLayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">আপনার লেখা নিউজ</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                স্বাগতম, {userInfo?.name || userInfo?.username || "Admin"} 👋 — নিজের লেখা article এখান থেকে ম্যানেজ করুন
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/writer/add-news" // ⚠️ ADJUST: admin/superadmin er actual "create news" route
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-900/20 transition-all duration-200 hover:bg-amber-800 hover:shadow-md hover:shadow-amber-900/25 active:scale-[0.98]"
          >
            <MdOutlinePostAdd size={18} />
            Create News
          </Link>
        </div>

        {/* Scoreboard strip */}
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800 sm:grid-cols-4 sm:divide-y-0 lg:grid-cols-8">
          {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="group flex flex-col gap-2 p-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/60 sm:p-5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                <Icon size={15} />
              </div>
              {statsLoading ? (
                <Skeleton className="h-6 w-14" />
              ) : (
                <p className="font-serif text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-2xl">
                  {(stats?.[key] ?? 0).toLocaleString()}
                </p>
              )}
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white text-amber-900 shadow-sm dark:bg-slate-700 dark:text-amber-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title দিয়ে খুঁজুন..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:border-amber-900/30 dark:focus:border-amber-500/40 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-900/10 dark:focus:ring-amber-500/10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Views</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {listLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-10" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-5 py-4"><Skeleton className="ml-auto h-4 w-16" /></td>
                  </tr>
                ))}

              {!listLoading && listError && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <p className="text-sm font-medium text-rose-500 dark:text-rose-400">{listError}</p>
                  </td>
                </tr>
              )}

              {!listLoading && !listError && myNewsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                      {search || activeTab !== "all"
                        ? "এই ফিল্টারে কোনো news পাওয়া যায়নি।"
                        : "এখনো কোনো news লেখা হয়নি।"}
                    </p>
                    <Link
                      to="/dashboard/writer/add-news"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
                    >
                      <MdOutlinePostAdd size={16} /> প্রথম News লিখুন
                    </Link>
                  </td>
                </tr>
              )}

              {!listLoading &&
                !listError &&
                myNewsList.map((item) => (
                  <tr key={item._id} className="group transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-950/10">
                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate font-serif text-[15px] font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-400">
                        {item.title}
                      </p>
                      {item.category?.name && (
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{item.category.name}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 tabular-nums text-slate-600 dark:text-slate-400">{(item.views ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-4 tabular-nums text-slate-500 dark:text-slate-400">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                        <Link
                          to={editPath(item._id)}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-amber-900 hover:text-white"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={deletingId === item._id}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
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
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              মোট <span className="font-semibold text-slate-700 dark:text-slate-300">{meta.total}</span> টি — পাতা{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{page}</span> / {meta.pages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition-colors hover:border-amber-900/30 hover:bg-amber-50 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/20 disabled:pointer-events-none disabled:opacity-40"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page >= meta.pages}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition-colors hover:border-amber-900/30 hover:bg-amber-50 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/20 disabled:pointer-events-none disabled:opacity-40"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Writers + Top Views News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Writers Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200" />

          <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                <h2 className="font-serif text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
                  Top Writers
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Ranked dynamically by total published article views
              </p>
            </div>
            <Link
              to="/admin/writers"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300 sm:text-sm"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {writersLoading ? (
              <LeaderboardSkeleton />
            ) : writersError ? (
              <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-4 text-center">
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 sm:text-sm">{writersError}</p>
              </div>
            ) : topWriters.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
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
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60 sm:gap-4"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform group-hover:scale-105 ${
                        rankBadgeStyles[rank] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {rank}
                    </span>

                    <div className="shrink-0">
                      <ProfileAvatar
                        src={writer.avatar?.url || writer.avatar}
                        alt={writer.name}
                        size="sm"
                        className="border border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400 sm:text-sm">
                          {writer.name || "Unknown Author"}
                        </p>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-200 sm:text-sm">
                        {views.toLocaleString()}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200" />

          <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                <h2 className="font-serif text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
                  Top Views News
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Ranked by all-time total views (published only)
              </p>
            </div>
            <Link
              to="/admin/news" // ⚠️ ADJUST: admin news master list-er actual route
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300 sm:text-sm"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {newsLoading ? (
              <LeaderboardSkeleton />
            ) : newsError ? (
              <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-4 text-center">
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 sm:text-sm">{newsError}</p>
              </div>
            ) : topNews.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                <Eye className="mx-auto mb-2 h-8 w-8 opacity-40" />
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
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60 sm:gap-4"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform group-hover:scale-105 ${
                        rankBadgeStyles[rank] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {rank}
                    </span>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400 sm:text-sm">
                          {item.title}
                        </p>
                        {item.category?.name && (
                          <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {item.category.name}
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-200 sm:text-sm">
                        {views.toLocaleString()}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
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