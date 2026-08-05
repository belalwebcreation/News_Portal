// Tracks whether the reader has scrolled past the hero (start) and is
// nearing the end of the article body (end). Two lightweight
// IntersectionObservers — no scroll listeners, no jank.
import { useEffect, useRef, useState } from "react";

export function useScrollRange() {
  const startRef = useRef(null); // hero-এর ঠিক নিচে বসবে
  const endRef = useRef(null);   // article body শেষ হওয়ার জায়গায় বসবে
  const [isPastStart, setIsPastStart] = useState(false);
  const [isPastEnd, setIsPastEnd] = useState(false);

  useEffect(() => {
    const startEl = startRef.current;
    const endEl = endRef.current;
    if (!startEl || !endEl) return undefined;

    const midpoint = () => window.innerHeight / 2;

    const startObserver = new IntersectionObserver(
      ([entry]) =>
        setIsPastStart(!entry.isIntersecting && entry.boundingClientRect.top < midpoint()),
      { threshold: 0 }
    );

    const endObserver = new IntersectionObserver(
      ([entry]) =>
        setIsPastEnd(!entry.isIntersecting && entry.boundingClientRect.top < midpoint()),
      { threshold: 0, rootMargin: "-20% 0px 0px 0px" } // একটু আগেভাগেই সরে যাক
    );

    startObserver.observe(startEl);
    endObserver.observe(endEl);

    return () => {
      startObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  return { startRef, endRef, isVisible: isPastStart && !isPastEnd };
}