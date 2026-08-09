import { useEffect, useRef, useState } from "react";

import { useTheme } from "./ThemeContext";

const PRESET_COLORS = [
  { name: "লাল", value: "#dc2626" },
  { name: "নীল", value: "#2563eb" },
  { name: "সবুজ", value: "#059669" },
  { name: "বেগুনি", value: "#7c3aed" },
  { name: "কমলা", value: "#ea580c" },
  { name: "সায়ান", value: "#0891b2" },
];

const HEX_RE = /^#([0-9A-Fa-f]{3}){1,2}$/;

const SunIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeSwitcher = () => {
  const { mode, setMode, accentColor, setAccentColor } = useTheme();
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(accentColor);
  const wrapperRef = useRef(null);

  // preset ক্লিক বা native picker থেকে color বদলালে টেক্সট ফিল্ড সিঙ্ক থাকবে
  useEffect(() => setHexDraft(accentColor), [accentColor]);

  // বাইরে ক্লিক করলে প্যানেল বন্ধ হয়ে যাবে
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleHexChange = (value) => {
    setHexDraft(value);
    if (HEX_RE.test(value)) setAccentColor(value);
  };

  return (
    <div className="relative flex items-center gap-2" ref={wrapperRef}>
      {/* White / Dark টগল */}
      <div
        className="flex items-center gap-0.5 rounded-full bg-gray-100 dark:bg-gray-800 p-0.5"
        role="group"
        aria-label="থিম মোড"
      >
        <button
          type="button"
          onClick={() => setMode("light")}
          aria-pressed={mode === "light"}
          title="হোয়াইট থিম"
          className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors ${
            mode === "light"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <SunIcon />
        </button>
        <button
          type="button"
          onClick={() => setMode("dark")}
          aria-pressed={mode === "dark"}
          title="ডার্ক থিম"
          className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors ${
            mode === "dark"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <MoonIcon />
        </button>
      </div>

      {/* Accent color trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="একসেন্ট কালার বাছাই করো"
        aria-expanded={open}
        className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-3 z-50">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            একসেন্ট কালার
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() => setAccentColor(c.value)}
                className={`w-6 h-6 rounded-full border-2 ${
                  accentColor.toLowerCase() === c.value ? "border-gray-900 dark:border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={HEX_RE.test(accentColor) ? accentColor : "#dc2626"}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer bg-transparent p-0"
              aria-label="কাস্টম কালার পিকার"
            />
            <input
              type="text"
              value={hexDraft}
              onChange={(e) => handleHexChange(e.target.value)}
              maxLength={7}
              spellCheck={false}
              aria-label="হেক্স কালার কোড"
              className="flex-1 min-w-0 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs px-2 py-1.5 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
