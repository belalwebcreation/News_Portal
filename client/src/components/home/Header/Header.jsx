import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

// থ্রেশহোল্ডগুলো এখন ছোট — হালকা স্ক্রলেও দ্রুত হাইড/শো হবে
const SCROLL_DELTA_THRESHOLD = 3; // এর কম হলে noise ধরে ইগনোর হবে
const TOP_ENTER_THRESHOLD = 2;    // এর নিচে গেলে TopHeader আবার দেখাবে
const TOP_EXIT_THRESHOLD = 16;    // আগে ৪৮ ছিল — কমিয়ে আনা হলো, দ্রুত রেসপন্সের জন্য

// Navbar-এর প্রকৃত height মাউন্টের আগ পর্যন্ত fallback (h-16 = 64px + 1px border)
const NAVBAR_HEIGHT_FALLBACK = 65;

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const atTopRef = useRef(true);
  const lastActedY = useRef(0);
  const ticking = useRef(false);

  const navbarWrapRef = useRef(null);
  const navbarHeight = useRef(NAVBAR_HEIGHT_FALLBACK);

  // Navbar-এর আসল রেন্ডারড height ResizeObserver দিয়ে dynamically মাপা হচ্ছে।
  // এটাই মূল ফিক্স: header hide করার সময় translateY এখন এই FIXED pixel
  // value ব্যবহার করবে, TopHeader-এর animate হতে থাকা height-এর উপর
  // percentage হিসেবে নির্ভর করবে না — ফলে দুটো animation (TopHeader
  // collapse আর header hide) একে অপরের target আর বদলাতে পারবে না, এবং
  // কোনো artificial delay/lock ছাড়াই সাথে সাথে রেসপন্ড করবে।
  useEffect(() => {
    if (!navbarWrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect?.height || entry.target.offsetHeight;
      if (h) navbarHeight.current = h;
    });
    ro.observe(navbarWrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const updateHeaderState = () => {
      const currentY = Math.max(window.scrollY, 0);

      let nextAtTop = atTopRef.current;
      if (!atTopRef.current && currentY <= TOP_ENTER_THRESHOLD) {
        nextAtTop = true;
      } else if (atTopRef.current && currentY > TOP_EXIT_THRESHOLD) {
        nextAtTop = false;
      }

      if (nextAtTop !== atTopRef.current) {
        atTopRef.current = nextAtTop;
        setAtTop(nextAtTop);
      }

      if (nextAtTop) {
        // টপ জোনে থাকলে সবসময় ফুল header দেখাবে
        setVisible(true);
        lastActedY.current = currentY;
      } else {
        const delta = currentY - lastActedY.current;
        if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
          // নিচের দিকে (delta > 0) → হাইড, উপরের দিকে (delta < 0) → শো
          setVisible(delta < 0);
          lastActedY.current = currentY;
        }
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeaderState);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 [overflow-anchor:none] transition-transform duration-300 ease-out"
      style={{
        transform: visible
          ? "translateY(0)"
          : `translateY(-${navbarHeight.current}px)`,
      }}
    >
      {/* TopHeader কে grid-rows দিয়ে collapse করা হচ্ছে — এটা নিজের মতো
          স্বাধীনভাবে animate হয়, উপরের translateY আর এর মধ্যে এখন কোনো
          নির্ভরতা নেই */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          atTop ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <TopHeader />
        </div>
      </div>

      <div ref={navbarWrapRef}>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;