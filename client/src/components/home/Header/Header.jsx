import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

// স্ক্রলের এই পরিমাণ শিফটকে "noise" ধরে ইগনোর করা হবে, যাতে সামান্য কাঁপাকাঁপিতে
// header বারবার flicker না করে
const SCROLL_DELTA_THRESHOLD = 5;

// "atTop" state-এ ঢোকা আর বের হওয়ার জন্য আলাদা আলাদা threshold (hysteresis)।
// একটা মাত্র threshold ব্যবহার করলে (আগে ৮px) scrollY ওই মানের আশেপাশে সামান্য
// ওঠানামা করলেই (trackpad/inertial scroll deceleration-এ এটা খুবই স্বাভাবিক)
// atTop বারবার true/false flip করে, আর প্রতিবার flip-এ TopHeader-এর grid-rows
// transition আবার নতুন করে রিস্টার্ট হয়ে যায় — এটাই মূলত "কাঁপা/লাফালাফি"-র কারণ।
const TOP_ENTER_THRESHOLD = 2; // এই বা এর নিচে গেলে TopHeader আবার দেখানো হবে
const TOP_EXIT_THRESHOLD = 48; // এটা পার হলে তবেই TopHeader আবার collapse হবে

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const atTopRef = useRef(true);
  // "lastActedY" হলো শেষ যেই scrollY-তে আমরা আসলেই state change করেছিলাম।
  // প্রতি frame-এর raw scrollY-এর সাথে delta compare করলে trackpad-এর অনেক ছোট
  // (threshold-এর নিচের) delta প্রতিবারই lastScrollY রিসেট করে দিতো, ফলে দিক
  // পরিবর্তনের হিসাবটা অস্থির হয়ে যেতো — এখন শেষ "committed" position-এর সাথে
  // compare করা হচ্ছে।
  const lastActedY = useRef(0);
  const ticking = useRef(false);

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
          // নিচের দিকে স্ক্রল (delta > 0) → হাইড, উপরের দিকে (delta < 0) → শো
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
      className={`sticky top-0 z-50 bg-white [overflow-anchor:none] transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TopHeader কে grid-rows দিয়ে collapse করা হচ্ছে — এতে ওর আসল height না জেনেও
          smooth animation পাওয়া যায়, hardcoded max-height লাগে না।
          [overflow-anchor:none] header-এ বসানো হয়েছে যাতে এই height change-এর
          কারণে ব্রাউজার নিজে থেকে scrollY অ্যাডজাস্ট (scroll anchoring) করে আরেকটা
          synthetic scroll event তৈরি না করে — যেটা feedback loop-টার একটা অংশ ছিল। */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          atTop ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <TopHeader />
        </div>
      </div>

      <Navbar />
    </header>
  );
};

export default Header;