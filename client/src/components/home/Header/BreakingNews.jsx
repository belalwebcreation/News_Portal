import { useEffect, useMemo, useState } from "react";
import { FaBolt, FaPause, FaPlay, FaRegClock, FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../../config/Config";

const DEFAULT_REFRESH_INTERVAL = 60_000;
const MIN_DURATION = 14;
const MAX_DURATION = 90;

const getVisibleItems = (breakingNews) => (
  Array.isArray(breakingNews?.items)
    ? breakingNews.items.filter((item) => item?.visible !== false && item?.title?.trim() && item?.slug)
    : []
);

const getTickerDuration = (speed) => {
  const normalizedSpeed = Number(speed) || 40;
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, 400 / normalizedSpeed));
};

const BreakingNewsSkeleton = () => (
  <div className="h-12 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" aria-label="ব্রেকিং নিউজ লোড হচ্ছে">
    <div className="flex h-full animate-pulse items-center gap-3 px-3 sm:px-4">
      <div className="h-6 w-28 shrink-0 rounded-md bg-red-100" />
      <div className="h-3 w-full max-w-2xl rounded-full bg-slate-100" />
      <div className="hidden h-3 w-24 rounded-full bg-slate-100 lg:block" />
    </div>
  </div>
);

/**
 * Public breaking-news ticker. It keeps the existing API response contract:
 * { success, breakingNews: { label, visible, items, speed, showDate, date } }.
 */
const BreakingNews = ({
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  className = "",
}) => {
  const [breakingNews, setBreakingNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchBreakingNews = async ({ background = false } = {}) => {
      if (!background) setLoading(true);

      try {
        const { data } = await axios.get(`${baseUrl}/api/breaking-news`, {
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (data?.success && data?.breakingNews) {
          setBreakingNews(data.breakingNews);
          setHasError(false);
        } else {
          setHasError(true);
        }
      } catch (error) {
        const requestWasCancelled = axios.isCancel(error) || error?.name === "CanceledError" || error?.code === "ERR_CANCELED";
        if (!requestWasCancelled && isMounted) setHasError(true);
      } finally {
        if (isMounted && !background) setLoading(false);
      }
    };

    fetchBreakingNews();

    const safeRefreshInterval = Math.max(0, Number(refreshInterval) || 0);
    const intervalId = safeRefreshInterval
      ? window.setInterval(() => fetchBreakingNews({ background: true }), safeRefreshInterval)
      : undefined;

    return () => {
      isMounted = false;
      controller.abort();
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [refreshInterval, retryCount]);

  const visibleItems = useMemo(() => getVisibleItems(breakingNews), [breakingNews]);
  const duration = useMemo(() => getTickerDuration(breakingNews?.speed), [breakingNews?.speed]);
  const isVisible = breakingNews?.visible !== false && visibleItems.length > 0;

  if (loading && !breakingNews) return <BreakingNewsSkeleton />;

  // Keep the last successful ticker on screen when a silent background refresh fails.
  if (!isVisible) {
    if (!hasError) return null;

    return (
      <div className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs text-amber-800 sm:px-4" role="status">
        <span>ব্রেকিং নিউজ এই মুহূর্তে পাওয়া যাচ্ছে না।</span>
        <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1.5 font-bold transition hover:bg-amber-200">
          <FaSyncAlt aria-hidden="true" /> আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const label = breakingNews.label?.trim() || "ব্রেকিং নিউজ";
  const showDate = Boolean(breakingNews.showDate && breakingNews.date);

  return (
    <section className={`relative isolate overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm ring-1 ring-black/[0.02] ${className}`} aria-label={label}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(254,226,226,0.85),_transparent_44%)]" />

      <div className="flex min-h-12 flex-col sm:flex-row sm:items-stretch">
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 px-3 py-2 text-white sm:px-4">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/90 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <FaBolt className="text-xs" aria-hidden="true" />
          <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.13em] sm:text-xs">{label}</span>
        </div>

        <div className="flex min-w-0 flex-1 items-center bg-white">
          <div className="relative min-w-0 flex-1 overflow-hidden py-2" aria-live="polite" aria-atomic="true">
            <p className="sr-only">{label}: {visibleItems.map((item) => item.title).join("। ")}</p>
            <div
              className={`breaking-news-ticker__track ${isPaused ? "breaking-news-ticker__track--paused" : ""}`}
              style={{ "--ticker-duration": `${duration}s` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className={`breaking-news-ticker__copy ${copy === 1 ? "breaking-news-ticker__copy--clone" : ""}`} aria-hidden={copy === 1}>
                  {visibleItems.map((item, index) => (
                    <Link
                      key={`${copy}-${item._id ?? item.slug}`}
                      to={item.slug}
                      tabIndex={copy === 1 ? -1 : 0}
                      className="group inline-flex shrink-0 items-center whitespace-nowrap text-sm font-semibold text-slate-700 outline-none transition-colors hover:text-red-600 focus-visible:text-red-600 focus-visible:underline"
                    >
                      <span>{item.title}</span>
                      {index < visibleItems.length - 1 && <span className="mx-6 text-xs text-red-500/80" aria-hidden="true">●</span>}
                    </Link>
                  ))}
                  <span className="mx-6 text-xs text-red-500/80" aria-hidden="true">●</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            className="mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            aria-label={isPaused ? "নিউজ টিকার চালু করুন" : "নিউজ টিকার থামান"}
            aria-pressed={isPaused}
          >
            {isPaused ? <FaPlay size={10} aria-hidden="true" /> : <FaPause size={10} aria-hidden="true" />}
          </button>
        </div>

        {showDate && (
          <div className="hidden shrink-0 items-center gap-2 border-l border-slate-100 px-4 text-xs font-medium text-slate-500 xl:flex">
            <FaRegClock className="text-red-500" aria-hidden="true" />
            <time>{breakingNews.date}</time>
          </div>
        )}
      </div>

      <style>{`
        .breaking-news-ticker__track {
          display: flex;
          width: max-content;
          animation: breaking-news-ticker-scroll var(--ticker-duration, 40s) linear infinite;
          will-change: transform;
        }

        .breaking-news-ticker__track:hover,
        .breaking-news-ticker__track:focus-within,
        .breaking-news-ticker__track--paused {
          animation-play-state: paused;
        }

        .breaking-news-ticker__copy {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        @keyframes breaking-news-ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .breaking-news-ticker__track { animation: none; }
          .breaking-news-ticker__copy--clone { display: none; }
        }
      `}</style>
    </section>
  );
};

export default BreakingNews;
