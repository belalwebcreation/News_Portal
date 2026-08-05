import "../../pages/style.css";
// src/features/pages/components/ScrollTop.jsx
//
// "Back to top" floating button for the public article pages. Shows up
// once the reader has scrolled past `threshold`, and traces a thin ring
// around the icon showing how far down the page they are — same scroll
// math as ReadingProgress.jsx, just fed into a circle instead of a bar.
//
// Perf/a11y details that make this production-ready rather than a toy:
//  - scroll handler is rAF-throttled (max one state update per frame,
//    not one per scroll event) and the listener is passive
//  - visibility is driven by a CSS class, not conditional mount, so the
//    fade/slide transition actually has something to animate
//  - hidden state also gets aria-hidden + tabIndex={-1} so the button
//    can't be tabbed to (or announced) while it's invisible
//  - honors prefers-reduced-motion for the JS-driven smooth scroll,
//    since that's not something a CSS media query can reach

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ArrowUp } from "lucide-react";
import '../../../editor/styles.css';

const DEFAULT_THRESHOLD = 400; // px scrolled before the button appears
const RING_RADIUS = 19;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function readScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollable <= 0) {
    return { scrollTop, percent: 0 };
  }

  return {
    scrollTop,
    percent: Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)),
  };
}

export function ScrollTop({ threshold = DEFAULT_THRESHOLD, className = "" }) {
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const tickingRef = useRef(false);

  const syncWithScroll = useCallback(() => {
    const { scrollTop, percent: nextPercent } = readScrollProgress();
    setVisible(scrollTop > threshold);
    setPercent(nextPercent);
    tickingRef.current = false;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(syncWithScroll);
    };

    // পেজ যদি hash/anchor নিয়ে বা refresh-এর পর মাঝ-স্ক্রলে লোড হয়,
    // mount-এই একবার sync করে নিলে বাটন আর ring ঠিক অবস্থাতেই বসবে —
    // প্রথম scroll event-এর অপেক্ষা করতে হবে না।
    syncWithScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [syncWithScroll]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const dashOffset = RING_CIRCUMFERENCE * (1 - percent / 100);

  return (
    <button
      type="button"
      className={`scroll-top${visible ? " is-visible" : ""} ${className}`.trim()}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg className="scroll-top__ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="scroll-top__ring-track" cx="22" cy="22" r={RING_RADIUS} />
        <circle
          className="scroll-top__ring-progress"
          cx="22"
          cy="22"
          r={RING_RADIUS}
          style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: dashOffset }}
        />
      </svg>
      <ArrowUp size={17} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

ScrollTop.propTypes = {
  threshold: PropTypes.number,
  className: PropTypes.string,
};

export default ScrollTop;
