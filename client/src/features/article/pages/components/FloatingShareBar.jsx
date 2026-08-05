// src/features/pages/components/FloatingShareBar.jsx

import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import ShareButtons from "./ShareButtons";
import "../../pages/style.css";

const AUTO_HIDE_DELAY = 3000; // ms — open howar eto khon por abar nijei hide hobe

export function FloatingShareBar(props) {
  const [open, setOpen] = useState(false); // 👈 default: bondho/hidden
  const hideTimerRef = useRef(null);

  const clearHideTimer = () => {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  };

  const scheduleAutoHide = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setOpen(false), AUTO_HIDE_DELAY);
  };

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        scheduleAutoHide(); // open korlei countdown suru
      } else {
        clearHideTimer(); // nijei bondho korle timer ar lagbe na
      }
      return next;
    });
  };

  // panel er upor mouse thakle auto-hide pause, mouse chole gele abar suru (desktop UX)
  const handleMouseEnter = () => open && clearHideTimer();
  const handleMouseLeave = () => open && scheduleAutoHide();

  useEffect(() => () => clearHideTimer(), []);

  return (
    <div
      className="fixed left-1 top-1/2 z-40 flex -translate-y-1/2 items-center gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Handle — sob shomoy visible, click korle open/close hobe */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={open ? "শেয়ার বার বন্ধ করুন" : "শেয়ার বার খুলুন"}
        aria-expanded={open}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition-colors hover:bg-slate-700"
      >
        {open ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
      </button>

      {/* Share Panel — click e open hoy, kichu shecond pore nijei hide hoye jay */}
      <div
        className={`origin-left transition-all duration-300 ease-out ${
          open
            ? "translate-x-0 scale-100 opacity-100 pointer-events-auto"
            : "-translate-x-4 scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <ShareButtons layout="vertical" variant="compact" {...props} />
      </div>
    </div>
  );
}

FloatingShareBar.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  summary: PropTypes.string,
};

export default FloatingShareBar;