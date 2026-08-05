// src/features/pages/components/ArticleMeta.jsx
import "../../pages/style.css";
import "../../../editor/styles.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileAvatar from "../../../../components/profile/ProfileAvatar";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  archived: "bg-graphite/10 text-graphite ring-graphite/20",
};

const ArticleMeta = ({ article, metrics }) => {
  const authorName = article?.author?.name || "BelalWebCreation";

  // ✅ CHANGED: দুটো সম্ভাব্য সোর্স থেকেই fallback — এক্সপ্লিসিট avatar (embedded,
  // position soho) না থাকলে profileImage (Media reference) ব্যবহার হবে।
  const authorAvatar =
    article?.author?.avatar?.url ||
    article?.author?.profileImage?.url ||
    "";

  const authorUsername = article?.author?.username || "";
  const publishedDate = article?.publishedAt || article?.createdAt;
  const updatedDate = article?.updatedAt;
  const status = article?.status || "";

  const statusClass =
    STATUS_STYLES[status.toLowerCase()] ||
    "bg-graphite/10 text-graphite ring-graphite/20";

  const stats = [
    { key: "minutes", label: "min read", value: metrics?.minutes || 1 },
    { key: "words", label: "words", value: metrics?.words || 0 },
    metrics?.views !== undefined && {
      key: "views",
      label: "views",
      value: metrics.views,
    },
  ].filter(Boolean);

  const authorContent = (
    <>
      <ProfileAvatar
        src={authorAvatar}
        alt={authorName}
        size="sm"
        position={article?.author?.avatar?.position} // ✅ NEW: reposition করা থাকলে respect করবে
      />
      <div className="min-w-0">
        <h4 className="truncate font-meta text-sm font-semibold text-ink">
          {authorName}
        </h4>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 font-meta text-xs text-graphite">
          <span>{formatDate(publishedDate)}</span>
          {updatedDate && updatedDate !== publishedDate && (
            <span className="before:mr-1.5 before:content-['·']">
              Updated {formatDate(updatedDate)}
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-6 sm:px-8">
      <div className="rounded-2xl border border-ink/10 bg-ink/[0.02] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          {authorUsername ? (
            <Link
              to={`/profile/${authorUsername}`}
              className="-m-1 flex min-w-0 items-center gap-3 rounded-lg p-1 transition-colors hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {authorContent}
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-3">{authorContent}</div>
          )}

          {status && (
            <span
              className={`shrink-0 inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 font-meta text-[10px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${statusClass}`}
            >
              {status}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-ink/10 pt-4 font-meta text-xs text-graphite">
          {stats.map((s, i) => (
            <span key={s.key} className="flex items-center gap-x-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-ink/20">
                  ·
                </span>
              )}
              <span className="whitespace-nowrap">
                <strong className="font-semibold text-ink">{s.value}</strong>{" "}
                <span className="uppercase tracking-[0.06em]">{s.label}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

ArticleMeta.propTypes = {
  article: PropTypes.shape({
    author: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      username: PropTypes.string,
      avatar: PropTypes.shape({
        url: PropTypes.string,
        position: PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      }),
      profileImage: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
    publishedAt: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,

  metrics: PropTypes.shape({
    words: PropTypes.number,
    minutes: PropTypes.number,
    views: PropTypes.number,
  }).isRequired,
};

export default ArticleMeta;