import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  Eye,
  BookOpen,
  ChevronRight,
  Home,
  Flame,
  Mail,
  ArrowUpRight,
  Sparkles,
  Newspaper,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { newsService } from "../features/news/services/newsService";

/* ==========================================
   1. Helper Utilities
   ========================================== */

const getCategoryBadgeStyle = (slug = "") => {
  const s = slug.toLowerCase();
  if (s.includes("tech"))
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (s.includes("sport"))
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (s.includes("politic"))
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  if (s.includes("business") || s.includes("finance"))
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  if (s.includes("entertain") || s.includes("lifestyle"))
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  return "bg-primary/10 text-primary border-primary/20";
};

const getCategoryDescription = (slug = "") => {
  const formatted = slug.toLowerCase();
  if (formatted.includes("tech"))
    return "Explore the latest breakthroughs in AI, gadgets, software engineering, and global tech innovation.";
  if (formatted.includes("sport"))
    return "Stay up to date with live scores, match reports, transfer rumors, and in-depth sports analysis.";
  if (formatted.includes("politic"))
    return "Unbiased coverage on governance, global diplomacy, legislative policy, and socio-economic affairs.";
  if (formatted.includes("business"))
    return "Key insights on global markets, startups, financial trends, inflation, and corporate strategy.";
  if (formatted.includes("entertain"))
    return "Your daily dive into cinema, music releases, pop culture, celebrity news, and streaming hits.";
  return `Comprehensive analysis, breaking headlines, and exclusive reports on ${slug.replace(/-/g, " ")}.`;
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* ==========================================
   2. Sub-Component: CategorySkeleton
   ========================================== */
const CategorySkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
    <div className="h-4 w-48 bg-base-300 rounded-lg" />
    <div className="p-8 rounded-3xl bg-base-200/60 border border-base-200/80 space-y-4">
      <div className="h-6 w-32 bg-base-300 rounded-full" />
      <div className="h-10 w-3/4 sm:w-1/2 bg-base-300 rounded-xl" />
      <div className="h-4 w-full sm:w-2/3 bg-base-300 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <div className="h-[440px] rounded-3xl bg-base-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-88 rounded-3xl bg-base-300" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="h-80 rounded-3xl bg-base-300" />
        <div className="h-64 rounded-3xl bg-base-300" />
      </div>
    </div>
  </div>
);

/* ==========================================
   3. Sub-Component: CategoryHero
   ========================================== */
const CategoryHero = ({ categoryTitle, totalArticles, slug, sortBy, setSortBy }) => {
  const categoryBadgeClass = getCategoryBadgeStyle(slug);

  const sortOptions = [
    { key: "newest", label: "Latest" },
    { key: "popular", label: "Popular" },
    { key: "trending", label: "Trending" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-base-100 border border-base-200/80 shadow-xl shadow-base-300/10 dark:shadow-none p-6 sm:p-10">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-base-200 bg-base-200/40 text-xs font-bold tracking-wide uppercase shadow-sm">
            <span className={`px-2.5 py-0.5 rounded-full border ${categoryBadgeClass}`}>
              {categoryTitle}
            </span>
            <span className="text-base-content/60 font-semibold">
              • {totalArticles} {totalArticles === 1 ? "Article" : "Articles"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black capitalize tracking-tight text-base-content">
            {categoryTitle}
          </h1>

          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            {getCategoryDescription(slug)}
          </p>
        </div>

        <div className="inline-flex items-center p-1.5 bg-base-200/60 rounded-2xl border border-base-200/80 self-start md:self-end">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                sortBy === opt.key
                  ? "bg-base-100 text-primary shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   4. Sub-Component: FeaturedArticle
   ========================================== */
const FeaturedArticle = ({ article, categoryTitle, slug }) => {
  if (!article) return null;

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-base-100 border border-base-200/80 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
      {/*
        ✅ FIX: আগে হার্ডকোডেড ছিল /news/${article.slug} — যেটা
        basename="/news"-এর সাথে মিলে ডাবল "news" তৈরি করছিল, এবং
        category slug কখনোই URL-এ যেত না।

        এখন App.jsx-এর নতুন route "/:categorySlug/:slug" অনুযায়ী
        category slug + article slug দুটোই পাঠানো হচ্ছে।
        article.category populate করা থাকলে সেখান থেকে slug নেওয়া হবে,
        নাহলে বর্তমান পেজের category slug fallback হিসেবে ব্যবহার হবে।
      */}
      <Link to={`/${article.category?.slug || slug}/${article.slug}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 relative overflow-hidden aspect-[16/9] lg:aspect-auto">
            <img
              src={article.thumbnail?.media?.url || "/images/news-placeholder.jpg"}
              alt={article.title}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="badge badge-primary font-bold text-[10px] tracking-wider uppercase px-3 py-2 shadow-md">
                Featured Story
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between space-y-4 bg-base-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-base-content/60 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {formatTimeAgo(article.publishedAt || article.createdAt)}
                </span>
                {article.readingTime && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} />
                      {article.readingTime} min read
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-base-content line-clamp-3 group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-base-content/70 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-base-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {article.author?.avatar ? (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    loading="lazy"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                    {article.author?.name?.[0] || "A"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-base-content/90 line-clamp-1">
                    {article.author?.name || "Editorial Staff"}
                  </p>
                  <p className="text-[10px] text-base-content/50">Verified Author</p>
                </div>
              </div>

              <span className="p-2.5 rounded-2xl bg-base-200/60 text-base-content/60 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

/* ==========================================
   5. Sub-Component: ArticleCard
   ========================================== */
const ArticleCard = ({ item, categoryTitle, slug }) => {
  return (
    <Link
      // ✅ FIX: একই কারণে /news/${item.slug} থেকে category-aware path-এ পরিবর্তন
      to={`/${item.category?.slug || slug}/${item.slug}`}
      className="group flex flex-col justify-between rounded-3xl bg-base-100 border border-base-200/80 p-4 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
          <img
            src={item.thumbnail?.media?.url || "/images/news-placeholder.jpg"}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${getCategoryBadgeStyle(
                item.category?.slug || slug
              )}`}
            >
              {item.category?.name || categoryTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-base-content/50 font-medium px-1">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatTimeAgo(item.publishedAt || item.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {item.readingTime || 3} min read
          </span>
        </div>

        <div className="px-1 space-y-1.5">
          <h3 className="text-base font-bold text-base-content line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-base-content/60 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-base-200/60 px-1 flex items-center justify-between text-xs text-base-content/70">
        <div className="flex items-center gap-2">
          {item.author?.avatar ? (
            <img
              src={item.author.avatar}
              alt={item.author.name}
              loading="lazy"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-base-200 text-base-content/70 flex items-center justify-center font-bold text-[10px]">
              {item.author?.name?.[0] || "A"}
            </div>
          )}
          <span className="font-semibold text-base-content/80 truncate max-w-[110px]">
            {item.author?.name || "Editorial"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-base-content/50">
          {item.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {item.views}
            </span>
          )}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform text-primary"
          />
        </div>
      </div>
    </Link>
  );
};

/* ==========================================
   6. Sub-Component: TrendingWidget
   ========================================== */
// ✅ FIX: আগে এই কম্পোনেন্ট `slug` prop-ই নিতো না, তাই hardcode করা
// /news/${topItem.slug} ছাড়া কোনো উপায় ছিল না। এখন slug prop যোগ
// করে fallback হিসেবে ব্যবহার করা হচ্ছে (item.category?.slug না থাকলে)।
const TrendingWidget = ({ articles, categoryTitle, slug }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="rounded-3xl bg-base-100 border border-base-200/80 p-5 shadow-xl shadow-base-300/10 dark:shadow-none space-y-4">
      <div className="flex items-center justify-between border-b border-base-200 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-base-content flex items-center gap-2">
          <Flame size={18} className="text-amber-500" />
          Trending in {categoryTitle}
        </h3>
      </div>

      <div className="space-y-3">
        {articles.slice(0, 4).map((topItem, index) => (
          <Link
            key={topItem._id || topItem.slug}
            to={`/${topItem.category?.slug || slug}/${topItem.slug}`}
            className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200/50 transition-colors"
          >
            <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-base-200">
              <img
                src={topItem.thumbnail?.media?.url || "/images/news-placeholder.jpg"}
                alt={topItem.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 left-0 bg-base-900/80 text-white font-black text-[10px] px-1.5 py-0.5 rounded-tr-lg">
                0{index + 1}
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-xs font-bold text-base-content line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {topItem.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-base-content/50">
                <span>{formatTimeAgo(topItem.publishedAt || topItem.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Eye size={10} />
                  {topItem.views || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   7. Sub-Component: NewsletterWidget
   ========================================== */
const NewsletterWidget = ({ categoryTitle }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 border border-primary/20 space-y-4 relative overflow-hidden">
      <div className="p-2.5 rounded-2xl bg-primary text-primary-content w-fit shadow-md shadow-primary/30">
        <Mail size={20} />
      </div>

      <div>
        <h3 className="text-base font-bold text-base-content">
          Stay Informed
        </h3>
        <p className="text-xs text-base-content/70 mt-1">
          Get top {categoryTitle} headlines delivered straight to your inbox.
        </p>
      </div>

      {subscribed ? (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>Subscribed successfully! Check your inbox.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email Address for Newsletter
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="input input-sm w-full bg-base-100 border border-base-300 focus:border-primary rounded-xl text-xs"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm w-full rounded-xl text-xs font-bold shadow-md shadow-primary/20"
          >
            Subscribe Now
          </button>
        </form>
      )}
    </div>
  );
};

/* ==========================================
   8. Main Component: CategoryNews
   ========================================== */
const CategoryNews = () => {
  const { slug } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await newsService.getAllNews({
          status: "published",
          categorySlug: slug,
          limit: 30,
        });

        setNews(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to load category news.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNews();
    }
  }, [slug]);

  // Client Sorting
  const sortedNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    const list = [...news];
    if (sortBy === "popular") {
      return list.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    if (sortBy === "trending") {
      return list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    }
    return list.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt) -
        new Date(a.publishedAt || a.createdAt)
    );
  }, [news, sortBy]);

  const featuredArticle = sortedNews[0];
  const gridArticles = sortedNews.slice(1);
  const categoryTitle = slug ? slug.replace(/-/g, " ") : "Category";

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200/30">
        <CategorySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200/30">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="p-8 rounded-3xl bg-base-100 border border-error/20 shadow-xl max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-base-content">Unable to Load News</h3>
            <p className="text-xs text-base-content/60">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm rounded-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30 text-base-content">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-base-content/60">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} className="text-base-content/30" />
          <span className="text-base-content/40">Categories</span>
          <ChevronRight size={13} className="text-base-content/30" />
          <span className="text-primary capitalize font-semibold">
            {categoryTitle}
          </span>
        </nav>

        {/* Category Hero Banner */}
        <CategoryHero
          categoryTitle={categoryTitle}
          totalArticles={news.length}
          slug={slug}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Empty State */}
        {sortedNews.length === 0 ? (
          <div className="rounded-3xl border border-base-200 bg-base-100 p-12 sm:p-16 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-base-200 text-base-content/40 flex items-center justify-center mx-auto">
              <Newspaper size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              No News Found
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60 max-w-md mx-auto">
              There are currently no published articles in the{" "}
              <span className="font-semibold text-primary">{categoryTitle}</span> category.
            </p>
            <Link to="/" className="btn btn-primary btn-sm rounded-2xl px-6">
              Back to Home
            </Link>
          </div>
        ) : (
          /* Main Layout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Articles (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Story */}
              <FeaturedArticle
                article={featuredArticle}
                categoryTitle={categoryTitle}
                slug={slug}
              />

              {/* Grid Stories */}
              {gridArticles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-base-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      More Stories in {categoryTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {gridArticles.map((item) => (
                      <ArticleCard
                        key={item._id || item.slug}
                        item={item}
                        categoryTitle={categoryTitle}
                        slug={slug}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar (4 Cols) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* ✅ FIX: slug prop এখন পাস করা হচ্ছে যাতে TrendingWidget
                    এর ভেতরে category slug fallback হিসেবে ব্যবহার করতে পারে */}
                <TrendingWidget
                  articles={sortedNews}
                  categoryTitle={categoryTitle}
                  slug={slug}
                />
                <NewsletterWidget categoryTitle={categoryTitle} />
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryNews;