// src/features/pages/components/ArticleSkeleton.jsx
//
// Loading placeholder for ArticleDetails.jsx. Mirrors the layout/spacing
// of ArticleHero + ArticleMeta + ArticleContent so it lines up
// pixel-for-pixel with the real content it stands in for.
//
// No TipTap output is rendered here (no dangerouslySetInnerHTML), so this
// file doesn't need editor/styles.css — that stylesheet is still loaded
// wherever ArticleContent renders the real article body.

function Bar({ width, height = "14px", radius = "6px", className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-ink/10 dark:bg-paper/10 ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function ArticleSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading article" className="bg-paper dark:bg-ink transition-colors">
      {/* Hero */}
      <div className="mx-auto max-w-3xl px-6 pt-14 pb-10 sm:px-8 sm:pt-20">
        <Bar width="110px" height="20px" radius="9999px" />
        <Bar width="88%" height="44px" className="mt-5" />
        <Bar width="55%" height="44px" className="mt-3" />
        <Bar width="70%" height="18px" className="mt-5 max-w-xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16 sm:px-8">
        <div className="aspect-[16/9] w-full animate-pulse rounded-2xl border border-ink/10 bg-ink/10 dark:border-paper/10 dark:bg-paper/10" />
      </div>

      {/* Meta */}
      <section className="mx-auto flex max-w-3xl flex-col gap-6 border-y border-ink/10 px-6 py-6 dark:border-paper/10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <Bar width="44px" height="44px" radius="9999px" className="shrink-0" />
          <div className="space-y-2">
            <Bar width="140px" height="13px" />
            <Bar width="100px" height="11px" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/10 pt-5 dark:border-paper/10 sm:flex sm:items-center sm:gap-6 sm:border-t-0 sm:pt-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-1.5 sm:items-center sm:border-l sm:border-ink/10 sm:pl-6 sm:first:border-l-0 sm:first:pl-0 dark:sm:border-paper/10"
            >
              <Bar width="28px" height="18px" />
              <Bar width="48px" height="9px" />
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-3xl space-y-3.5 px-6 pb-16 pt-10 sm:px-8">
        {Array.from({ length: 7 }).map((_, index) => (
          <Bar key={index} width={index % 3 === 2 ? "72%" : "100%"} height="14px" />
        ))}
      </div>
    </main>
  );
}

export default ArticleSkeleton;