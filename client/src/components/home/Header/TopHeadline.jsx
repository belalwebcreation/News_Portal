import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../../config/Config";

const TopHeadline = () => {
  const [headlineData, setHeadlineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /*
  ------------------------------------------
  Load Top Headline
  ------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopHeadline = async () => {
      try {
        setLoading(true);
        setHasError(false);

        const { data } = await axios.get(
          `${baseUrl}/api/top-headline`,
          { signal: controller.signal }
        );

        if (data.success) {
          setHeadlineData(data.headline);
        } else {
          setHasError(true);
        }
      } catch (err) {
        // Request was cancelled because the component unmounted — not a real error
        if (axios.isCancel(err) || err.name === "CanceledError") return;

        // This is a non-critical public widget, so we log for developers
        // but don't show a broken error banner to site visitors.
        console.error("Failed to load top headline:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTopHeadline();

    return () => controller.abort();
  }, []);

  /*
  ------------------------------------------
  Loading
  ------------------------------------------
  */

  if (loading) {
    return (
      <div className="h-12 flex items-center">
        <div className="h-6 w-full max-w-md rounded-md bg-slate-200 animate-pulse" />
      </div>
    );
  }

  const visibleItems =
    headlineData?.items?.filter((item) => item.visible) || [];

  /*
  ------------------------------------------
  Hide Whole Section
  (fetch failed, ticker turned off, or nothing to show)
  ------------------------------------------
  */

  if (
    hasError ||
    !headlineData ||
    headlineData.visible === false ||
    visibleItems.length === 0
  ) {
    return null;
  }
const speed = Number(headlineData.speed) || 40;
const duration = 400 / speed;

  return (
    <div className="flex items-center justify-between gap-6 h-12">
      {/* Left */}
      <div className="flex-1 flex items-center gap-4 overflow-hidden">
        {/* Dynamic Label */}
        <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shrink-0">
          {headlineData.label}
        </span>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden" aria-label="Latest headlines">
          <div
            className="marquee-track flex items-center w-max"
            style={{ "--marquee-duration": `${duration}s` }}
          >
            {/* Rendered twice back-to-back for a seamless infinite loop.
                The second copy is hidden from assistive tech and keyboard
                navigation so headlines aren't announced/focused twice. */}
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center shrink-0"
                aria-hidden={copy === 1}
              >
                {visibleItems.map((item, index) => (
                  <Link
                    key={`${copy}-${item._id}`}
                    to={item.slug}
                    tabIndex={copy === 1 ? -1 : 0}
                    className="mr-10 font-medium whitespace-nowrap hover:text-red-600 transition-colors duration-300"
                  >
                    {item.title}

                    {/* Separator */}
                    {index !== visibleItems.length - 1 && (
                      <span className="mx-6 text-red-600">●</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      {headlineData.showDate && (
        <div className="hidden lg:flex items-center gap-2 text-gray-500 shrink-0">
          <FaRegClock className="text-base" />
          <span className="text-sm font-medium">{headlineData.date}</span>
        </div>
      )}

      <style>{`
        .marquee-track {
          animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
        }

        .marquee-track:hover,
        .marquee-track:focus-within {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TopHeadline;
