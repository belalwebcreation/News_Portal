import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

// এর চেয়ে কম স্ক্রল-শিফটকে "noise" ধরে ইগনোর করা হবে, যাতে সামান্য কাঁপাকাঁপিতে
// header বারবার flicker না করে
const SCROLL_DELTA_THRESHOLD = 5;
// এই পয়েন্টের নিচে থাকলে "পেজের টপে আছি" ধরা হবে
const TOP_THRESHOLD = 8;

const Header = () => {
  // পুরো header (TopHeader + Navbar) দেখাবে নাকি হাইড থাকবে
  const [visible, setVisible] = useState(true);
  // TopHeader অংশটা আলাদাভাবে দেখাবে কিনা (শুধু পেজের টপে থাকলে true)
  const [atTop, setAtTop] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateHeaderState = () => {
      const currentY = Math.max(window.scrollY, 0);
      const isAtTop = currentY < TOP_THRESHOLD;
      const delta = currentY - lastScrollY.current;

      setAtTop(isAtTop);

      if (isAtTop) {
        // টপে থাকলে সবসময় ফুল header দেখাবে
        setVisible(true);
      } else if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
        // নিচের দিকে স্ক্রল (delta > 0) → হাইড
        // উপরের দিকে স্ক্রল (delta < 0) → শো
        setVisible(delta < 0);
      }

      lastScrollY.current = currentY;
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
      className={`sticky top-0 z-50 bg-white transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TopHeader কে grid-rows দিয়ে collapse করা হচ্ছে — এতে ওর আসল height না জেনেও
          smooth animation পাওয়া যায়, hardcoded max-height লাগে না */}
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
