// src/features/pages/components/ArticleContent.jsx
import "../../pages/style.css";
import "../../../editor/styles.css";
import PropTypes from "prop-types";

const ArticleContent = ({ article, html }) => {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 sm:px-8">
      {article?.summary && (
        <p className="mb-8 font-display text-xl italic leading-relaxed text-ink/80 dark:text-paper/80 sm:text-2xl">
          {article.summary}
        </p>
      )}

      <div
        className="article-preview__body prose prose-dispatch dark:prose-invert max-w-none break-words sm:prose-lg
          prose-img:my-0 prose-img:w-auto prose-img:h-auto prose-img:max-w-none
          [&_ul>li::marker]:text-accent [&_ol>li::marker]:text-accent"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </article>
  );
};

ArticleContent.propTypes = {
  article: PropTypes.object.isRequired,
  html: PropTypes.string.isRequired,
};

export default ArticleContent;