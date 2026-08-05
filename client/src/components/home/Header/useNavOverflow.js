import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Container-এর ভেতরে natural width অনুযায়ী কয়টা item এক লাইনে আঁটে সেটা বের করে।
 * যা আঁটে না, সেগুলো overflowItems হিসেবে ফেরত দেয় — mobile/more menu-তে দেখানোর জন্য।
 */
export default function useNavOverflow(items, { reserved = 0 } = {}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null); // invisible clone, শুধু width মাপার জন্য
  const [visibleCount, setVisibleCount] = useState(items.length);
  const rafRef = useRef(null);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const availableWidth = container.getBoundingClientRect().width - reserved;

    // container-এর width এখনো ঠিকভাবে বসেনি (0 বা negative) —
    // এই মুহূর্তে ভুল মান commit না করে পরের real measurement-এর
    // জন্য অপেক্ষা করাই ভালো, নাহলে ভুল state আটকে থেকে যেতে পারে
    if (availableWidth <= 0) return;

    const children = Array.from(measure.children);
    let usedWidth = 0;
    let count = 0;

    for (const child of children) {
      usedWidth += child.getBoundingClientRect().width;
      if (usedWidth > availableWidth) break;
      count += 1;
    }

    setVisibleCount((prev) => (prev === count ? prev : count));
  }, [reserved]);

  // ResizeObserver callback সরাসরি sync-এ না চালিয়ে rAF দিয়ে batch করা —
  // একই frame-এ বারবার recalculate ট্রিগার হওয়া / loop warning এড়াতে
  const scheduleRecalculate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(recalculate);
  }, [recalculate]);

  useLayoutEffect(() => {
    recalculate();
  }, [items, recalculate]);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container) return;

    // container আর measure — দুটোই observe করা হচ্ছে, যাতে শুধু
    // bar-এর width না, ভেতরের text-width পাল্টালেও (font লোড হওয়ার
    // পর) recalculate ট্রিগার হয়
    const observer = new ResizeObserver(scheduleRecalculate);
    observer.observe(container);
    if (measure) observer.observe(measure);

    window.addEventListener("resize", scheduleRecalculate);

    // Web font async লোড হয়ে text metrics পাল্টে দিতে পারে —
    // সেই মুহূর্তে একবার re-check
    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleRecalculate).catch(() => {});
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleRecalculate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleRecalculate]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const overflowItems = useMemo(() => items.slice(visibleCount), [items, visibleCount]);

  return { containerRef, measureRef, visibleItems, overflowItems };
}