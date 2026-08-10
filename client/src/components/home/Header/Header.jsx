import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

// এতটুকু delta-কে "noise" ধরে ইগনোর করা হবে
const SCROLL_DELTA_THRESHOLD = 4;
// এই zone-এর মধ্যে থাকলে TopHeader সবসময় visible
const TOP_ZONE = 4;
// TopHeader মাউন্টের আগ পর্যন্ত fallback height (ResizeObserver রেজাল্ট না
// আসা পর্যন্ত ব্যবহার হবে, যাতে প্রথম রেন্ডারে transform ভুল না হয়)
const TOPHEADER_HEIGHT_FALLBACK = 88;

const Header = () => {
  const [hidden, setHidden] = useState(false);
  // Navbar-এর ব্যাকগ্রাউন্ড/শ্যাডো টগলের জন্য isScrolled এখন এখান
  // থেকেই কেন্দ্রীয়ভাবে নিয়ন্ত্রিত হচ্ছে — Navbar আর নিজে scroll শোনে না
  const [isScrolled, setIsScrolled] = useState(false);
  const [topHeaderHeightPx, setTopHeaderHeightPx] = useState(
    TOPHEADER_HEIGHT_FALLBACK
  );

  const lastActedY = useRef(0);
  const ticking = useRef(false);
  const topHeaderRef = useRef(null);

  // TopHeader-এর প্রকৃত রেন্ডারড height মাপা হচ্ছে। হাইড করার সময় এই
  // ঠিক এই পরিমাণ pixel-ই translate করা হবে (percentage না) — তাই
  // headline বেশি লাইনে wrap হয়ে height বদলে গেলেও hide/show সবসময়
  // নির্ভুলভাবে ঠিক Navbar-এর উপরে গিয়ে থামবে, নিচে gap বা overlap হবে না
  useEffect(() => {
    if (!topHeaderRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect?.height || entry.target.offsetHeight;
      if (h) setTopHeaderHeightPx(h);
    });
    ro.observe(topHeaderRef.current);
    return () => ro.disconnect();
  }, []);

  // একটামাত্র scroll listener — আগে Header আর Navbar আলাদা আলাদাভাবে
  // scroll শুনছিল (দুটো আলাদা rAF loop, দুটো আলাদা window.scrollY read
  // প্রতি ফ্রেমে)। কম-পাওয়ার মোবাইলে এটাই মূলত অতিরিক্ত lag ফিল করাচ্ছিল।
  // এখন Navbar isScrolled prop হিসেবে এখান থেকে পায়।
  useEffect(() => {
    const update = () => {
      const currentY = Math.max(window.scrollY, 0);

      setIsScrolled(currentY > 8);

      // একদম উপরে থাকলে সবসময় TopHeader visible
      if (currentY <= TOP_ZONE) {
        setHidden(false);
        lastActedY.current = currentY;
        ticking.current = false;
        return;
      }

      const delta = currentY - lastActedY.current;
      if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
        // নিচে scroll (delta > 0) → হাইড, উপরে scroll (delta < 0) → শো
        setHidden(delta > 0);
        lastActedY.current = currentY;
      }

      ticking.current = false;
    };

    update(); // ইনিশিয়াল state ঠিক রাখতে (রিলোডে মাঝপথে থাকলে)

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 [overflow-anchor:none] transition-transform duration-150 ease-out will-change-transform"
      style={{
        transform: hidden
          ? `translateY(-${topHeaderHeightPx}px)`
          : "translateY(0)",
      }}
    >
      {/* hidden অবস্থায় pointer-events বন্ধ রাখা হচ্ছে, যাতে viewport-এর
          বাইরে চলে যাওয়া TopHeader-এর ভেতরের SearchBox/LoginButton
          ইত্যাদি অদৃশ্য থেকেও keyboard-focus বা click ধরে না ফেলে */}
      <div ref={topHeaderRef} style={{ pointerEvents: hidden ? "none" : "auto" }}>
        <TopHeader />
      </div>
      <Navbar isScrolled={isScrolled} />
    </header>
  );
};

export default Header;