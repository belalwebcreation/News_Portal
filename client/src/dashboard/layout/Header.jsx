import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { roleRoutes } from "../../utils/roleRoutes";
import ProfileAvatar from "../../components/profile/ProfileAvatar"; // adjust path if your folder depth differs

import {
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiSettings,
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
  const user = userInfo;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser(); // clears token + userInfo from context AND localStorage
    navigate("/login");
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

  const goTo = (key) => {
    setProfileOpen(false);
    const routes = user?.role ? roleRoutes[user.role] : null;
    if (routes?.[key]) navigate(routes[key]);
  };

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
      backdrop-blur-md
      border-b
      border-gray-200
      shadow-sm
      z-50
      px-4
      lg:px-8
      flex
      items-center
      justify-between
    "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="lg:hidden w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center"
        >
          <FiMenu size={20} />
        </button>

        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
              outline-none
              transition
              focus:border-amber-900
              focus:ring-2
              focus:ring-amber-100
            "
          />
        </div>

        {/* Mobile Search */}
        <button
          className="
          md:hidden
          w-10
          h-10
          rounded-xl
          bg-gray-100
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
        <div className="hidden xl:block">
          <h2 className="text-lg font-semibold text-gray-800">
            {greeting}, {user?.name || "User"} 👋
          </h2>

          <p className="text-sm text-gray-500">
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
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Message */}
        <button
          className="
            relative
            w-10
            h-10
            lg:w-11
            lg:h-11
            rounded-xl
            bg-slate-100
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
        <button
          className="
            relative
            w-10
            h-10
            lg:w-11
            lg:h-11
            rounded-xl
            bg-slate-100
            hover:bg-amber-900
            hover:text-white
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
        >
          <FiBell size={18} />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
              ring-2
              ring-white
              animate-pulse
            "
          />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-2
              lg:px-3
              py-2
              hover:bg-slate-100
              transition-all
            "
          >
            <div className="hidden md:block text-right">
              <h3 className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </h3>

              <p className="text-xs text-gray-500">{formatRole(user?.role)}</p>
            </div>

            <ProfileAvatar
              src={user?.avatar?.url}
              alt={user?.name || "Profile"}
              size="sm"
              position={user?.avatar?.position}
            />

            <IoChevronDown
              className={`hidden md:block text-gray-400 transition-transform duration-300 ${
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
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-2xl
                overflow-hidden
              "
            >
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold text-gray-800">{user?.name || "User"}</h3>

                <p className="text-sm text-gray-500">{formatRole(user?.role)}</p>
              </div>

              <button
                onClick={() => goTo("profile")}
                className="flex items-center gap-3 w-full px-5 py-3 text-sm hover:bg-slate-50 transition"
              >
                <FiUser size={17} />
                My Profile
              </button>

              <button
                onClick={() => goTo("settings")}
                className="flex items-center gap-3 w-full px-5 py-3 text-sm hover:bg-slate-50 transition"
              >
                <FiSettings size={17} />
                Settings
              </button>

              <div className="border-t" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
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
