import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineArticle, MdOutlinePostAdd } from "react-icons/md";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import {
  FiLogOut,
  FiX,
  FiBookmark,
  FiMessageSquare,
  FiClock,
  FiSettings,
} from "react-icons/fi";
import { FiGrid } from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const { userInfo } = useAuth();
  const role = userInfo?.role;

  const menuClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-[15px] font-medium ${
      pathname === path
        ? "bg-amber-900 text-white shadow-md"
        : "text-slate-700 hover:bg-amber-900 hover:text-white"
    }`;

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between border-b px-5">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="Logo" className="w-44 object-contain" />
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-gray-600 hover:text-red-600"
          >
            <FiX />
          </button>
        </div>

        {/* Menu */}
        <div className="px-4 py-6">
          <ul className="space-y-2">
            {/* ================= ADMIN ================= */}
            {role === "admin" && (
              <>
                <li>
                  <Link
                    to="/dashboard/admin"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin")}
                  >
                    <LuLayoutDashboard size={20} />
                    Dashboard
                  </Link>
                </li>

              <li>
                <Link
                  to="/dashboard/admin/content-management"
                  onClick={() => setSidebarOpen(false)}
                  className={menuClass("/dashboard/admin/content-management")}
                >
                  <FiGrid size={20} />
                  Content Management
                </Link>
              </li>

                {/* <li>
                  <Link
                    to="/dashboard/admin/news"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin/news")}
                  >
                    <MdOutlineArticle size={20} />
                    News
                  </Link>
                </li> */}

                <li>
                  <Link
                    to="/dashboard/admin/add-writer"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin/add-writer")}
                  >
                    <HiOutlineUserPlus size={20} />
                    Add Writer
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/admin/writers"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin/writers")}
                  >
                    <FaRegUser size={18} />
                    Writers
                  </Link>
                </li>

                  <li>
                  <Link
                    to="/dashboard/admin/site-settings"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin/site-settings")}
                  >
                    <FiSettings size={20} />
                    Site Settings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/admin/profile"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/admin/profile")}
                  >
                    <CgProfile size={20} />
                    Profile
                  </Link>
                </li>
              </>
            )}

            {/* ================= WRITER ================= */}
            {role === "writer" && (
              <>
                <li>
                  <Link
                    to="/dashboard/writer"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/writer")}
                  >
                    <LuLayoutDashboard size={20} />
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/writer/add-news"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/writer/add-news")}
                  >
                    <MdOutlinePostAdd size={20} />
                    Create News
                  </Link>
                </li>
              </>
            )}

            {/* ================= READER ================= */}
            {role === "reader" && (
              <>
                <li>
                  <Link
                    to="/dashboard/reader"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader")}
                  >
                    <LuLayoutDashboard size={20} />
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/reader/bookmarks"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader/bookmarks")}
                  >
                    <FiBookmark size={20} />
                    Bookmarks
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/reader/comments"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader/comments")}
                  >
                    <FiMessageSquare size={20} />
                    Comments
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/reader/history"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader/history")}
                  >
                    <FiClock size={20} />
                    History
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/reader/settings"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader/settings")}
                  >
                    <FiSettings size={20} />
                    Settings
                  </Link>
                </li>

              

                <li>
                  <Link
                    to="/dashboard/reader/profile"
                    onClick={() => setSidebarOpen(false)}
                    className={menuClass("/dashboard/reader/profile")}
                  >
                    <CgProfile size={20} />
                    Profile
                  </Link>
                </li>
              </>
            )}

            {/* Logout */}
            <li className="pt-6 mt-6 border-t">
              <Link
                to="/logout"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <FiLogOut size={20} />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;