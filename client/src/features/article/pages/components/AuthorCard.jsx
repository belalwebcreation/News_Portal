// src/features/pages/components/AuthorCard.jsx
//
// "About the author" card for ArticleDetails.jsx. Expects article.author
// shaped as: { name, email, role, bio, profileImage: { url, alt, width, height } }.
//
// The avatar circle is built directly with Tailwind utilities, so this
// component no longer depends on the .avatar/.avatar--large classes from
// editor/styles.css or the author-card* classes from pages/style.css.
// It never renders TipTap output (no dangerouslySetInnerHTML), so this
// change doesn't touch the editor's image-resize/alignment logic — that
// still lives in ArticleContent.jsx, where the real article body renders.
import PropTypes from "prop-types";

const ROLE_LABELS = {
  admin: "Admin",
  writer: "Writer",
  reader: "Member",
};

const AuthorCard = ({ author }) => {
  if (!author) return null;

  const name = author.name || "Unknown author";
  const initial = name.charAt(0).toUpperCase();
  const avatarUrl = author.profileImage?.url || "";
  const avatarAlt = author.profileImage?.alt || name;
  const roleLabel = ROLE_LABELS[author.role] || null;

  return (
    <aside
      aria-label="About the author"
      className="mx-auto mb-16 max-w-3xl px-6 sm:px-8"
    >
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-ink/10 bg-paper p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-accent/10 ring-1 ring-inset ring-ink/10 sm:h-20 sm:w-20">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={avatarAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-accent">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-meta text-base font-semibold text-ink sm:text-lg">
              {name}
            </h3>

            {roleLabel && (
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 font-meta text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                {roleLabel}
              </span>
            )}
          </div>

          {author.bio && (
            <p className="mt-2 font-meta text-sm leading-relaxed text-graphite">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

AuthorCard.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    bio: PropTypes.string,
    profileImage: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
    }),
  }),
};

export default AuthorCard;