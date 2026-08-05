/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ===============================
      // Design tokens — "press dispatch" system
      // Shared across ArticleHero / ArticleContent, and (going forward)
      // the rest of the article-page components.
      // ===============================
      colors: {
        paper: "#F5F6F4",
        ink: "#14181C",
        accent: "#C4362C",
        graphite: "#5B6169",
      },

      fontFamily: {
        display: ['"Newsreader"', '"Noto Serif Bengali"', "serif"],
        meta: ['"Space Grotesk"', '"Noto Sans Bengali"', "sans-serif"],
      },

      // ===============================
      // Typography (prose) theme for rich-text article bodies —
      // used via `prose prose-dispatch` in ArticleContent.jsx.
      // Depends on the colors/fontFamily above (theme() reads the fully
      // merged theme regardless of key order, but keeping this below
      // them is easier to follow).
      // ===============================
      typography: ({ theme }) => ({
        dispatch: {
          css: {
            "--tw-prose-body": theme("colors.ink / 90%"),
            "--tw-prose-headings": theme("colors.ink"),
            "--tw-prose-links": theme("colors.accent"),
            "--tw-prose-bold": theme("colors.ink"),
            "--tw-prose-bullets": theme("colors.accent"),
            "--tw-prose-hr": theme("colors.ink / 10%"),
            "--tw-prose-quotes": theme("colors.ink / 80%"),
            "--tw-prose-quote-borders": theme("colors.accent"),
            "--tw-prose-captions": theme("colors.graphite"),
            "--tw-prose-code": theme("colors.accent"),
            "--tw-prose-th-borders": theme("colors.ink / 10%"),
            "--tw-prose-td-borders": theme("colors.ink / 10%"),
            fontFamily: theme("fontFamily.display").join(", "),
            p: { fontFamily: theme("fontFamily.display").join(", ") },
            "h1, h2, h3, h4": {
              fontFamily: theme("fontFamily.display").join(", "),
              fontWeight: "500",
              letterSpacing: "-0.01em",
              scrollMarginTop: "6rem",
            },
            a: {
              fontWeight: "500",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationColor: theme("colors.accent / 40%"),
            },
            "a:hover": { textDecorationColor: theme("colors.accent") },
            blockquote: { fontStyle: "italic", borderLeftWidth: "2px" },
            code: {
              fontFamily: theme("fontFamily.meta").join(", "),
              backgroundColor: theme("colors.ink / 5%"),
              borderRadius: "0.25rem",
              padding: "0.15rem 0.4rem",
              fontWeight: "400",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            pre: {
              backgroundColor: theme("colors.ink"),
              color: theme("colors.paper"),
              borderRadius: "0.75rem",
            },
            figcaption: {
              fontFamily: theme("fontFamily.meta").join(", "),
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.75rem",
            },
            img: { borderRadius: "1rem" },
            table: { display: "block", overflowX: "auto" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
