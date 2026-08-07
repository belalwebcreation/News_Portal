import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Bookmark,
  Clock,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getRoleHomePath } from "../../../constants/roles";
import ProfileAvatar from "../../profile/ProfileAvatar";

const MENU_WIDTH = 288; // w-72
const VIEWPORT_MARGIN = 16;

const ProfileMenu = () => {
  const { userInfo, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // বাটনের সাপেক্ষে ড্রপডাউনের ঠিক পজিশন হিসেব করা — এটাই portal-এর জন্য জরুরি,
  // কারণ document.body-তে রেন্ডার হওয়ার পর আর CSS relative/absolute দিয়ে
  // বাটনের সাথে সংযুক্ত থাকে না, তাই ম্যানুয়ালি fixed coordinates বসাতে হয়।
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    let left = rect.right - MENU_WIDTH;
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN)
    );

    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 12,
      left,
      width: Math.min(MENU_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  // Mousedown & Touchstart listener for smooth outside-click behavior on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = buttonRef.current && buttonRef.current.contains(e.target);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // ===============================
  // Role Based Dashboard Route
  // ===============================
  const rawDashboardRoute = getRoleHomePath(userInfo?.role) || "";
  const dashboardRoute = rawDashboardRoute.startsWith("/")
    ? rawDashboardRoute
    : `/dashboard/${rawDashboardRoute.replace(/^dashboard\/?/, "")}`;

  const dropdownContent = (
    <div
      ref={menuRef}
      style={menuStyle || {}}
      className="max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-[999] transition-all duration-200"
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50/80 border-b border-gray-100">
        <ProfileAvatar
          src={userInfo?.avatar?.url}
          alt={userInfo?.name || "Profile"}
          size="md"
          position={userInfo?.avatar?.position}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {userInfo?.name || "User"}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {userInfo?.email}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-2 space-y-0.5">
        <Link
          to={dashboardRoute}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-gray-500" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/profile"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors"
        >
          <User className="w-4 h-4 text-gray-500" />
          <span>My Profile</span>
        </Link>

        <Link
          to="/saved-news"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors"
        >
          <Bookmark className="w-4 h-4 text-gray-500" />
          <span>Saved News</span>
        </Link>

        <Link
          to="/reading-history"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors"
        >
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Reading History</span>
        </Link>
      </div>

      {/* Logout Section */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/40">
        <button
          onClick={() => {
            logoutUser();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full transition"
        aria-label="User Menu"
      >
        <ProfileAvatar
          src={userInfo?.avatar?.url}
          alt={userInfo?.name || "Profile"}
          size="sm"
          position={userInfo?.avatar?.position}
        />
      </button>

      {/* Dropdown Menu — portal দিয়ে document.body-তে রেন্ডার হয়, তাই কোনো
          overflow-hidden ancestor (যেমন Header.jsx-এর collapse wrapper) একে
          আর ক্লিপ করতে পারে না */}
      {open && menuStyle && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default ProfileMenu;
