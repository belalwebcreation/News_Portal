// src/features/pages/components/RelatedArticles.jsx

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { newsService } from "../../../news/services/newsService";

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
    return null;
  }

  if (!articles.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-8 lg:max-w-none lg:px-0">
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl lg:text-xl">
        Related Articles
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
        {articles.map((item) => {
          const image = item?.thumbnail?.media?.url || "";
          const category = item?.category?.name || "";

          const publishedDate = item?.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          return (
            <article key={item._id} className="group flex flex-col">
              <Link
                to={`/news/${item.slug}`}
                className="block overflow-hidden rounded-xl border border-ink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {image ? (
                  <img
                    src={image}
                    alt={item?.thumbnail?.media?.alt || item.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="aspect-[16/10] w-full bg-ink/5" />
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
                  className="mt-2 font-display text-lg font-medium leading-snug text-ink transition-colors hover:text-accent motion-reduce:transition-none lg:text-base"
                >
                  <span className="line-clamp-2">{item.title}</span>
                </Link>

                {item.summary && (
                  <p className="mt-2 line-clamp-2 font-meta text-sm leading-relaxed text-graphite">
                    {item.summary}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-4 font-meta text-xs text-graphite">
                  {item?.author?.name && <span>{item.author.name}</span>}
                  {item?.author?.name && publishedDate && <span>·</span>}
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