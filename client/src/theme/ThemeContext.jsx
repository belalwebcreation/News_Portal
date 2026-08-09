import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export const DEFAULT_ACCENT = "#dc2626"; // তোমার navbar-এর বর্তমান red-700 এর কাছাকাছি ডিফল্ট

const MODE_KEY = "theme-mode";
const ACCENT_KEY = "theme-accent";

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState("light");
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  // প্রথমবার লোড হওয়ার সময় localStorage থেকে সেভ করা প্রেফারেন্স পড়া হচ্ছে
  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_KEY);
    const savedAccent = localStorage.getItem(ACCENT_KEY);
    if (savedMode === "light" || savedMode === "dark") setModeState(savedMode);
    if (savedAccent) setAccentColorState(savedAccent);
    setMounted(true);
  }, []);

  // mode বা accentColor বদলালে <html>-এ apply করা এবং localStorage-এ সেভ করা
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark"); // Tailwind darkMode: 'class' এর জন্য
    root.style.setProperty("--accent", accentColor);
    localStorage.setItem(MODE_KEY, mode);
    localStorage.setItem(ACCENT_KEY, accentColor);
  }, [mode, accentColor, mounted]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accentColor,
        setMode: setModeState,
        setAccentColor: setAccentColorState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme অবশ্যই ThemeProvider এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
};
