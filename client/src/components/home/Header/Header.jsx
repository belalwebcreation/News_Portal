import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

const SCROLL_DELTA_THRESHOLD = 5;
const TOP_ENTER_THRESHOLD = 2;
const TOP_EXIT_THRESHOLD = 48;

// TopHeader-এর grid-rows collapse/expand transition (duration-300) যতক্ষণ
// চলছে, ততক্ষণ "visible" টগল বন্ধ রাখা হবে।
//
// বাগ: TopHeader collapse হয় height animate করে (grid-rows), আর পুরো header
// হাইড হয় "-translate-y-full" দিয়ে — যেটা header-এর *তাৎক্ষণিক* height-এর
// ১০০%। স্বাভাবিক গতিতে scroll down করলে প্রায়ই একই frame-এ currentY একসাথে
// TOP_EXIT_THRESHOLD আর delta threshold দুটোই পার হয়ে যায়, ফলে atTop আর
// visible একই সাথে false হয়ে যায়। তখন TopHeader-এর height কমছে ঠিক সেই
// মুহূর্তেই header তার -100% (যেটা সেই কমতে-থাকা height-এরই ১০০%) হিসাব
// করে সরার চেষ্টা করে — দুই animation একে অপরের base বদলে দেয় বলে
// hide "আটকে যায়"।
//
// ফিক্স: TopHeader-এর animation শেষ না হওয়া পর্যন্ত visible টগল না করা —
// দুটো animation কখনো একসাথে না চালানো।
const TOP_TRANSITION_LOCK_MS = 320; // duration-300-এর চেয়ে সামান্য বেশি বাফার

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const atTopRef = useRef(true);
  const lastActedY = useRef(0);
  const ticking = useRef(false);
  const topTransitionLockUntil = useRef(0);

  useEffect(() => {
    const updateHeaderState = () => {
      const currentY = Math.max(window.scrollY, 0);
      const now = performance.now();

      let nextAtTop = atTopRef.current;
      if (!atTopRef.current && currentY <= TOP_ENTER_THRESHOLD) {
        nextAtTop = true;
      } else if (atTopRef.current && currentY > TOP_EXIT_THRESHOLD) {
        nextAtTop = false;
      }

      const atTopJustChanged = nextAtTop !== atTopRef.current;

      if (atTopJustChanged) {
        atTopRef.current = nextAtTop;
        setAtTop(nextAtTop);
        topTransitionLockUntil.current = now + TOP_TRANSITION_LOCK_MS;
      }

      if (nextAtTop) {
        // টপ জোনে থাকলে সবসময় ফুল header দেখাবে
        setVisible(true);
        lastActedY.current = currentY;
      } else if (now < topTransitionLockUntil.current) {
        // TopHeader তখনো animate হচ্ছে — visible টগল স্থগিত। lastActedY
        // আপডেট রাখা হচ্ছে যাতে lock খোলার পর পুরনো stale delta থেকে
        // হঠাৎ বড় jump ধরা না পড়ে
        lastActedY.current = currentY;
      } else {
        const delta = currentY - lastActedY.current;
        if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
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
      className={`sticky top-0 z-50 bg-white dark:bg-gray-900 [overflow-anchor:none] transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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