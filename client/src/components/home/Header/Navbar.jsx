import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import { useSiteSettings } from "../../../context/SiteSettingsContext";

import SearchBox from "./SearchBox";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginButton from "./LoginButton";
import MobileMenu from "./MobileMenu";
import useNavOverflow from "./useNavOverflow";
import ThemeSwitcher from "../../../theme/ThemeSwitcher";

// মেনু/হ্যামবার্গার বাটনের approx width (w-11 = 44px) + তার আগের gap
const MENU_BUTTON_RESERVED_WIDTH = 56;

const Navbar = () => {
  const { settings, loading } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔍 DEBUG 1: নেভবার কতবার Mount/Unmount হচ্ছে তা দেখা
  useEffect(() => {
    console.log("🔴 [Navbar Lifecycle] MOUNTED (নেভবার লোড হয়েছে)");
    return () => console.log("⚪ [Navbar Lifecycle] UNMOUNTED (নেভবার বন্ধ হয়েছে)");
  }, []);

  // ১) ব্যাকএন্ড থেকে আসা নেভবার আইটেম ফিল্টার ও সর্ট করা
  const categories = useMemo(
    () =>
      (settings?.navbar || [])
        .filter((item) => item.visible)
        .sort((a, b) => a.order - b.order),
    [settings]
  );

  const { containerRef, measureRef, visibleItems, overflowItems } = useNavOverflow(
    categories,
    { reserved: MENU_BUTTON_RESERVED_WIDTH }
  );

  // 🔍 DEBUG 2: প্রতিটি রেন্ডারে ডেটার অবস্থা দেখা
  console.log("📊 [Navbar Render Debug]:", {
    loading,
    hasSettings: !!settings,
    totalNavbarItems: settings?.navbar?.length || 0,
    categoriesCount: categories.length,
    visibleItemsCount: visibleItems.length,
    overflowItemsCount: overflowItems.length,
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    // 🔍 DEBUG 3: নেভবার লোডিং অবস্থায় ঢুকলে সতর্ক করবে
    console.warn("⚠️ [Navbar State] Loading is TRUE — Skeleton visible");
    return (
      <nav className="border-y border-gray-200 shadow-sm bg-white">
        <div className="max-w-7xl mx-auto h-16 animate-pulse" />
      </nav>
    );
  }

  return (
    <nav
      className={`border-b transition-[background-color,box-shadow] duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-md dark:bg-gray-900/90 dark:border-gray-800"
          : "bg-white border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: dynamic category list — যতটুকু আঁটে ততটুকুই দেখাবে */}
          <div
            ref={containerRef}
            className="relative flex-1 min-w-0 h-16 flex items-center overflow-hidden"
          >
            {/* ২) Invisible clone (Measure Section) */}
            <div
              ref={measureRef}
              className="absolute top-0 left-0 flex items-center invisible pointer-events-none whitespace-nowrap"
              aria-hidden="true"
            >
              {categories.map((item) => (
                <span
                  key={`measure-${item._id || item.id}`}
                  className="px-4 h-16 flex items-center text-[15px] font-medium"
                >
                  {item.isHome ? item.title : item.category?.name}
                </span>
              ))}
            </div>

            <div className="flex items-center">
              {visibleItems.map((item) => (
                <NavLink
                  key={item._id || item.id}
                  to={item.isHome ? "/" : `/category/${item.category?.slug}`}
                  className={({ isActive }) =>
                    `group relative px-4 h-16 flex items-center text-[15px] font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-inset ${
                      isActive ? "text-red-700" : "text-gray-800 hover:text-red-700 dark:text-gray-200 dark:hover:text-red-500"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-[1px]">
                        {item.isHome ? item.title : item.category?.name}
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 h-[3px] w-full bg-red-700 origin-left transition-transform duration-300 ease-out ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: utility icons + overflow/mobile menu
              Search ও Login এখন lg-এর নিচে হাইড — ওগুলো TopHeader-এর কম্প্যাক্ট রো-তে
              দেখানো হচ্ছে, তাই এখানে ডুপ্লিকেট করার দরকার নেই */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:block">
              <SearchBox />
            </div>

            <ThemeSwitcher />

            <LanguageSwitcher />
            <div className="hidden lg:block">
              <LoginButton />
            </div>
            <MobileMenu items={overflowItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
