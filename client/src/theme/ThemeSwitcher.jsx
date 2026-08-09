import { useTheme } from "./ThemeContext";

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
  const { mode, setMode } = useTheme();

  return (
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
  );
};

export default ThemeSwitcher;