// src/features/pages/components/Toc.jsx
import "../style.css";

//
// Auto-generated, collapsible table of contents for the article body,
// with a scroll-spy "sliding indicator" that tracks the active section.
//
// Why this reads the DOM instead of just rendering links straight off
// a parsed `html` string: sanitizeHtml.js's ALLOWED_ATTRIBUTES list
// does not include `id` (by design — otherwise authored content could
// inject arbitrary anchor ids), so headings in the rendered body never
// carry an id to link to. This component parses the outline from the
// same `html` string ArticleContent renders, then — once that HTML has
// actually painted — writes those same slugs onto the live heading
// elements as real DOM ids. sanitizeHtml's allowlist stays untouched;
// every heading still ends up with a stable, linkable id.
//
// Must be rendered as a sibling of whatever `containerSelector` points
// to, within the same render pass as the body content (e.g. both
// direct children of ArticleDetails.jsx's return) — within one React
// commit, all DOM mutations land before any component's useEffect
// runs, so by the time this component's effect fires the body's
// innerHTML is already in the document regardless of render order.

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import "../../pages/style.css";

const HEADING_SELECTOR = "h1, h2, h3";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

// html string থেকে heading গুলো বার করে { id, text, level } আউটলাইন বানায়।
// খালি heading-এর জায়গায় null রাখা হয় (টেক্সট নেই বলে বাদ, কিন্তু array-এর
// index তাও DOM-এর heading node index-এর সাথে মিলে থাকে — নিচের effect-এ
// id বসানোর সময় এই index-alignment-টাই দরকার)। duplicate টেক্সট হলে
// -2, -3... suffix জুড়ে id unique রাখা হয়।
function extractOutline(html) {
  if (!html || typeof window === "undefined") return [];

  const doc = new window.DOMParser().parseFromString(html, "text/html");
  const headings = [...doc.querySelectorAll(HEADING_SELECTOR)];
  const seen = new Map();

  return headings.map((node) => {
    const text = node.textContent.trim();
    if (!text) return null;

    const base = slugify(text) || "section";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    return { id, text, level: Number(node.tagName.slice(1)) };
  });
}

export function Toc({
  html,
  containerSelector = ".article-preview__body",
  scrollOffset = 96,
  minHeadings = 2,
  heading = "Contents",
  className = "",
  collapsible = true,
  defaultOpen = true,
  maxListHeight = 360,
}) {
  const outline = useMemo(() => extractOutline(html), [html]);
  const items = useMemo(() => outline.filter(Boolean), [outline]);

  const [activeId, setActiveId] = useState(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  const intersectingRef = useRef(new Map());
  const scrollRef = useRef(null);
  const itemRefs = useRef(new Map());
  const panelId = useRef(
    `toc-panel-${Math.random().toString(36).slice(2, 8)}`
  ).current;

  // আসল DOM-এর heading গুলোতে id বসানো + scroll-spy observer সেট করা।
  // outline বদলালে (নতুন article লোড হলে) আগের observer disconnect করে
  // নতুন করে সেট করে।
  useEffect(() => {
    if (!items.length) return undefined;

    const container = document.querySelector(containerSelector);
    if (!container) return undefined;

    const headingNodes = [...container.querySelectorAll(HEADING_SELECTOR)];
    headingNodes.forEach((node, index) => {
      const item = outline[index];
      if (item) node.id = item.id;
    });

    if (typeof IntersectionObserver === "undefined") return undefined;

    intersectingRef.current = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectingRef.current.set(entry.target.id, entry.isIntersecting);
        });

        const currentlyVisible = items
          .map((item) => item.id)
          .filter((id) => intersectingRef.current.get(id));

        if (currentlyVisible.length > 0) {
          setActiveId(currentlyVisible[0]);
        }
      },
      { rootMargin: `-${scrollOffset}px 0px -70% 0px`, threshold: 0 }
    );

    headingNodes.forEach((node) => {
      if (node.id) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [outline, items, containerSelector, scrollOffset]);

  // active item বদলালে (বা accordion open/resize হলে) sliding indicator-কে
  // সঠিক জায়গায় নিয়ে যাওয়া। ResizeObserver ব্যবহার করা হচ্ছে যাতে
  // accordion open/close বা font-load-এ height বদলালেও ঠিক থাকে।
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return undefined;

    const measure = () => {
      if (!activeId) return;
      const el = itemRefs.current.get(activeId);
      if (!el) return;
      setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(scrollEl);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId, items, isOpen]);

  const handleClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - scrollOffset;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
  };

  if (items.length < minHeadings) return null;

  return (
    <nav
      className={`toc${isOpen ? "" : " is-collapsed"} ${className}`.trim()}
      aria-label={heading}
    >
      <button
        type="button"
        className="toc__toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => collapsible && setIsOpen((open) => !open)}
      >
        <svg
          className="toc__icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>

        <span className="toc__title">{heading}</span>

        {collapsible && (
          <svg
            className="toc__chevron"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      <div className="toc__panel" id={panelId}>
        <div className="toc__panel-inner">
          <div
            className="toc__scroll"
            ref={scrollRef}
            style={{ maxHeight: maxListHeight }}
          >
            <span
              className="toc__indicator"
              style={{
                transform: `translateY(${indicator.top}px)`,
                height: indicator.height,
              }}
              aria-hidden="true"
            />

            <ol className="toc__list">
              {items.map((item) => (
                <li
                  key={item.id}
                  ref={(node) => {
                    if (node) itemRefs.current.set(item.id, node);
                    else itemRefs.current.delete(item.id);
                  }}
                  className={`toc__item toc__item--level-${item.level}${
                    activeId === item.id ? " is-active" : ""
                  }`}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleClick(event, item.id)}
                    aria-current={activeId === item.id ? "location" : undefined}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </nav>
  );
}

Toc.propTypes = {
  html: PropTypes.string,
  containerSelector: PropTypes.string,
  scrollOffset: PropTypes.number,
  minHeadings: PropTypes.number,
  heading: PropTypes.string,
  className: PropTypes.string,
  collapsible: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  maxListHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Toc;