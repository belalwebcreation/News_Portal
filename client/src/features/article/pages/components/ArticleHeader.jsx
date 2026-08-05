// src/features/pages/components/ArticleHeader.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ArticleHeader = ({ article }) => {
  const categoryName = article?.category?.name || "";
  const categorySlug = article?.category?.slug || "";

  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-10 sm:px-8 sm:pt-20">
      {categoryName && (
        <Link
          to={`/category/${categorySlug}`}
          className="group inline-flex items-center gap-2 font-meta text-[13px] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <span className="h-px w-6 bg-accent transition-all group-hover:w-9 motion-reduce:transition-none" />
          {categoryName}
        </Link>
      )}

      <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
        {article.title}
      </h1>

      {article.summary && (
        <p className="mt-5 max-w-xl font-meta text-lg leading-relaxed text-graphite">
          {article.summary}
        </p>
      )}
    </div>
  );
};

ArticleHeader.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    }),
  }).isRequired,
};

export default ArticleHeader;