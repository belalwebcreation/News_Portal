import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext"; // 🔗 Sidebar.jsx / Logo.jsx এর মতোই same context, mobile logo এর জন্য

import fallbackLogo from "../../assets/logo.png";
import ProfileAvatar from "../../components/profile/ProfileAvatar"; // adjust path if your folder depth differs
import NotificationDropdown from "../../components/notification/NotificationDropdown"; // ✅ path তোমার Header.jsx-এর অবস্থান অনুযায়ী adjust করো

import {
  FiSearch,
  FiMessageSquare,
  FiLogOut,
  FiUser,
  FiMenu,
} from "react-icons/fi";

import { IoChevronDown } from "react-icons/io5";

// role আসলে না থাকলেও যাতে "NaN" বা "undefinedundefined" না দেখায়
const formatRole = (role) => (role ? role.charAt(0).toUpperCase() + role.slice(1) : "");

const Header = ({ sidebarOpen = false, setSidebarOpen = () => {} }) => {
  const navigate = useNavigate();

  const { userInfo, logoutUser } = useAuth();
  const { settings, loading: settingsLoading } = useSiteSettings(); // 🔗 dynamic logo data (Sidebar-এর মতো)
  const user = userInfo;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // 🔗 Sidebar.jsx এর সাথে identical logic — mobile-এ drawer বন্ধ থাকলেও logo যেন হারিয়ে না যায়
  const logoSrc = settings?.logo?.trim() ? settings.logo : fallbackLogo;
  const logoVisible = settings?.logoVisible ?? true;

  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser(); // clears token + userInfo from context AND localStorage
    navigate("/login");
  };

  const goToProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Greeting
  const hour = currentTime.getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <header
      className="
      fixed
      top-0
      left-0
      lg:left-72
      right-0
      h-16
      bg-white/90
      dark:bg-slate-900/90
      backdrop-blur-md
      border-b
      border-gray-200
      dark:border-slate-800
      shadow-sm
      z-50
      px-3
      sm:px-4
      lg:px-8
      flex
      items-center
      justify-between
      gap-2
    "
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="lg:hidden shrink-0 w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center"
        >
          <FiMenu size={20} />
        </button>

        {/* Mobile Logo — sidebar drawer বন্ধ থাকলে (default state) এটাই একমাত্র branding, তাই lg breakpoint পর্যন্ত visible রাখা হলো */}
        {settingsLoading ? (
          <div className="lg:hidden shrink-0 w-24 h-7 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        ) : (
          logoVisible && (
            <Link to="/" className="lg:hidden shrink-0 flex items-center">
              <img
                src={logoSrc}
                alt="Portal Logo"
                className="h-8 w-auto max-w-[110px] sm:max-w-[130px] object-contain select-none"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackLogo;
                }}
              />
            </Link>
          )
        )}

        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />

          <input
            type="text"
            placeholder="Search news, writers, category..."
            className="
              w-60
              lg:w-96
              h-11
              pl-11
              pr-4
              rounded-xl
              border
              border-gray-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-gray-800
              dark:text-slate-100
              placeholder:text-gray-400
              dark:placeholder:text-slate-500
              outline-none
              transition
              focus:border-amber-900
              dark:focus:border-amber-600
              focus:ring-2
              focus:ring-amber-100
              dark:focus:ring-amber-900/30
            "
          />
        </div>

        {/* Mobile Search */}
        <button
          className="
          md:hidden
          shrink-0
          w-10
          h-10
          rounded-xl
          bg-gray-100
          dark:bg-slate-800
          hover:bg-amber-900
          hover:text-white
          transition
          flex
          items-center
          justify-center
        "
        >
          <FiSearch size={18} />
        </button>

        {/* Greeting */}
        <div className="hidden xl:block min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 truncate">
            {greeting}, {user?.name || "User"} 👋
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}

            {" • "}

            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
        {/* Message */}
        <button
          className="
            relative
            shrink-0
            w-10
            h-10
            lg:w-11
            lg:h-11
            rounded-xl
            bg-slate-100
            dark:bg-slate-800
            hover:bg-amber-900
            hover:text-white
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
        >
          <FiMessageSquare size={18} />
        </button>

        {/* Notification */}
        <div className="relative shrink-0">
          <NotificationDropdown />
        </div>

        {/* Profile */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="
              flex
              items-center
              gap-2
              sm:gap-3
              rounded-xl
              px-1.5
              sm:px-2
              lg:px-3
              py-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-all
            "
          >
            <div className="hidden md:block text-right">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                {user?.name || "User"}
              </h3>

              <p className="text-xs text-gray-500 dark:text-slate-400">{formatRole(user?.role)}</p>
            </div>

            <ProfileAvatar
              src={user?.avatar?.url}
              alt={user?.name || "Profile"}
              size="sm"
              position={user?.avatar?.position}
            />

            <IoChevronDown
              className={`hidden md:block text-gray-400 dark:text-slate-500 transition-transform duration-300 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-64
                max-w-[calc(100vw-1.5rem)]
                bg-white
                dark:bg-slate-900
                rounded-2xl
                border
                border-gray-200
                dark:border-slate-800
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800">
                <h3 className="font-semibold text-gray-800 dark:text-slate-100">{user?.name || "User"}</h3>

                <p className="text-sm text-gray-500 dark:text-slate-400">{formatRole(user?.role)}</p>
              </div>

              <button
                onClick={goToProfile}
                className="flex items-center gap-3 w-full px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <FiUser size={17} />
                My Profile
              </button>

              <div className="border-t border-gray-200 dark:border-slate-800" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <FiLogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;