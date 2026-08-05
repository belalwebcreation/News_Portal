import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ProfileAvatar from "../../profile/ProfileAvatar"; // adjust this path to match your actual folder structure

const ProfileMenu = () => {
  const { userInfo, logoutUser } = useAuth();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // ===============================
  // Role Based Dashboard Route
  // ===============================

  const dashboardRoute = (() => {
    switch (userInfo?.role) {
      case "admin":
        return "/dashboard/admin";

      case "writer":
        return "/dashboard/writer";

      default:
        return "/dashboard/reader";
    }
  })();

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center"
      >
        <ProfileAvatar
          src={userInfo?.avatar?.url}
          alt={userInfo?.name || "Profile"}
          size="sm"
          position={userInfo?.avatar?.position}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-60 rounded-xl bg-white shadow-2xl border overflow-hidden z-50">

          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <ProfileAvatar
              src={userInfo?.avatar?.url}
              alt={userInfo?.name || "Profile"}
              size="sm"
              position={userInfo?.avatar?.position}
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {userInfo?.name}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {userInfo?.email}
              </p>
            </div>
          </div>

          {/* Menu */}

          <Link
            to={dashboardRoute}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 transition"
          >
            My Profile
          </Link>

          <Link
            to="/saved-news"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 transition"
          >
            Saved News
          </Link>

          <Link
            to="/reading-history"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 transition"
          >
            Reading History
          </Link>

          <hr />

          <button
            onClick={() => {
              logoutUser();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;