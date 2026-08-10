import { useEffect, useRef, useState } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

// এতটুকু delta-কে "noise" ধরে ইগনোর করা হবে
const SCROLL_DELTA_THRESHOLD = 4;
// এই zone-এর মধ্যে থাকলে header সবসময় visible থাকবে
const TOP_ZONE = 4;

const Header = () => {
  const [hidden, setHidden] = useState(false);

  const lastActedY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const currentY = Math.max(window.scrollY, 0);

      // একদম উপরে থাকলে সবসময় visible
      if (currentY <= TOP_ZONE) {
        setHidden(false);
        lastActedY.current = currentY;
        ticking.current = false;
        return;
      }

      const delta = currentY - lastActedY.current;
      if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
        setHidden(delta > 0); // নিচে scroll = hide, উপরে scroll = show
        lastActedY.current = currentY;
      }

      ticking.current = false;
    };

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
      className={`sticky top-0 z-50 bg-white dark:bg-gray-900 [overflow-anchor:none] transition-transform duration-200 ease-out will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* TopHeader আর আলাদাভাবে collapse হচ্ছে না — পুরো header একটামাত্র
          transform দিয়ে এক ইউনিট হিসেবে নড়ছে, তাই দুটো transition আর
          একে অপরের সাথে fight করবে না */}
      <TopHeader />
      <Navbar />
    </header>
  );
};

export default Header;