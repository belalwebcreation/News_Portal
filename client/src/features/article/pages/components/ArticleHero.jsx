// src/features/pages/components/ArticleHero.jsx
import PropTypes from "prop-types";

const ArticleHero = ({ article }) => {
  const thumbnail = article?.thumbnail?.media?.url || "";
  const thumbWidth = article?.thumbnail?.media?.width || 1600;
  const thumbHeight = article?.thumbnail?.media?.height || 900;

  const imageAlt =
    article?.thumbnail?.media?.alt || article?.title || "Article image";

  const imageCaption = article?.thumbnail?.media?.caption || "";

  if (!thumbnail) return null;

  return (
    <figure className="mx-auto max-w-3xl px-6 pb-16 sm:px-8">
      <img
        src={thumbnail}
        alt={imageAlt}
        width={thumbWidth}
        height={thumbHeight}
        loading="eager"
        decoding="async"
        className="aspect-[16/9] w-full rounded-2xl border border-ink/10 object-cover"
      />

      {imageCaption && (
        <figcaption className="mt-3 font-meta text-xs uppercase tracking-[0.1em] text-graphite">
          {imageCaption}
        </figcaption>
      )}
    </figure>
  );
};

ArticleHero.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string,
    thumbnail: PropTypes.shape({
      media: PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
        caption: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    }),
  }).isRequired,
};

export default ArticleHero;