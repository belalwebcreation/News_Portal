// src/features/pages/components/RelatedArticles.jsx

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
import { newsService } from "../../../news/services/newsService";

function SkeletonBar({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-ink/10 dark:bg-paper/10 ${className}`}
    />
  );
}

const RelatedArticles = ({ article }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!article?.category?.slug) return;

    let mounted = true;

    const loadRelatedArticles = async () => {
      try {
        setLoading(true);

        const response = await newsService.getAllNews({
          status: "published",
          categorySlug: article.category.slug,
          limit: 4,
        });

        if (!mounted) return;

        const related =
          response?.data?.filter((item) => item._id !== article._id) || [];

        setArticles(related.slice(0, 3));
      } catch (error) {
        console.error("Failed to load related articles:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRelatedArticles();

    return () => {
      mounted = false;
    };
  }, [article]);

  if (loading) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading related articles"
        className="mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-8 lg:max-w-none lg:px-0"
      >
        <SkeletonBar className="h-7 w-40 sm:h-8 sm:w-48 lg:h-6 lg:w-32" />

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-ink/10 dark:bg-paper/10" />
              <div className="mt-4 space-y-2.5">
                <SkeletonBar className="h-3 w-16" />
                <SkeletonBar className="h-5 w-full" />
                <SkeletonBar className="h-5 w-3/4" />
                <SkeletonBar className="mt-1 h-3 w-full" />
                <SkeletonBar className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!articles.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-8 lg:max-w-none lg:px-0">
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink transition-colors dark:text-paper sm:text-3xl lg:text-xl">
        Related Articles
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
        {articles.map((item) => {
          const image = item?.thumbnail?.media?.url || "";
          const category = item?.category?.name || "";

          const authorAvatar =
            item?.author?.avatar?.url || item?.author?.profileImage?.url || "";
          const authorInitial =
            item?.author?.name?.charAt(0)?.toUpperCase() || "";

          const publishedDate = item?.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          return (
            <article
              key={item._id}
              className="group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Link
                to={`/news/${item.slug}`}
                className="block overflow-hidden rounded-xl border border-ink/10 transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent group-hover:shadow-lg group-hover:shadow-ink/10 dark:border-paper/10 dark:group-hover:shadow-none dark:group-hover:ring-1 dark:group-hover:ring-paper/15"
              >
                {image ? (
                  <img
                    src={image}
                    alt={item?.thumbnail?.media?.alt || item.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-ink/5 dark:bg-paper/5">
                    <ImageOff
                      className="h-6 w-6 text-ink/20 dark:text-paper/20"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Link>

              <div className="mt-4 flex flex-1 flex-col">
                {category && (
                  <span className="font-meta text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {category}
                  </span>
                )}

                <Link
                  to={`/news/${item.slug}`}
                  className="mt-2 font-display text-lg font-medium leading-snug text-ink transition-colors hover:text-accent motion-reduce:transition-none dark:text-paper lg:text-base"
                >
                  <span className="line-clamp-2">{item.title}</span>
                </Link>

                {item.summary && (
                  <p className="mt-2 line-clamp-2 font-meta text-sm leading-relaxed text-graphite transition-colors dark:text-paper/70">
                    {item.summary}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-4 font-meta text-xs text-graphite transition-colors dark:text-paper/70">
                  {item?.author?.name && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full bg-accent/10 ring-1 ring-inset ring-ink/10 dark:ring-paper/10">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-display text-[9px] font-semibold text-accent">
                            {authorInitial}
                          </span>
                        )}
                      </span>
                      <span>{item.author.name}</span>
                    </span>
                  )}
                  {item?.author?.name && publishedDate && (
                    <span aria-hidden="true">·</span>
                  )}
                  {publishedDate && <span>{publishedDate}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

RelatedArticles.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
};

export default RelatedArticles;