import { Link, useLocation } from "react-router-dom";
import fallbackLogo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext"; // 🔗 Logo.jsx এর মতোই same context

// Icons grouped cleanly by packages
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { 
  MdOutlineArticle, 
  MdOutlinePostAdd, 
  MdOutlineCategory,
  MdOutlinePendingActions, // ✅ NEW — Pending Review menu icon
} from "react-icons/md";
import {
  FiX,
  FiBookmark,
  FiGrid,
  FiLayout,
} from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const { userInfo } = useAuth();
  const { settings, loading: settingsLoading } = useSiteSettings(); // 🔗 dynamic logo data
  const role = userInfo?.role;

  // 👑 Admin ও Superadmin — দুজনেরই একই মেনু (superadmin এর extra ক্ষমতা page এর ভেতরেই handle হয়, যেমন Users.jsx এ demote বাটন)
  // "Create News" এখন Dashboard এর ঠিক নিচেই রাখা হলো, যাতে admin/superadmin সবার আগে সেটা দেখতে পায়
  const adminMenuItems = [
    { title: "Dashboard", path: "/dashboard/admin", icon: <LuLayoutDashboard size={20} /> },
    { title: "Create News", path: "/dashboard/writer/add-news", icon: <MdOutlinePostAdd size={20} /> },
    { title: "Content Management", path: "/dashboard/admin/content-management", icon: <FiGrid size={20} /> },
    { title: "Category Management", path: "/dashboard/admin/categories", icon: <MdOutlineCategory size={20} /> },
    { title: "News Master List", path: "/dashboard/admin/news", icon: <MdOutlineArticle size={20} /> },
    { title: "Pending Review", path: "/dashboard/admin/pending-review", icon: <MdOutlinePendingActions size={20} /> }, // ✅ NEW — writer-দের submit করা article approve/reject করার page
    { title: "User List", path: "/dashboard/admin/users", icon: <FaRegUser size={18} /> },
  ];

  // 📝 Industry-Level Data Structure: সহজে নতুন মেনু যোগ বা পরিবর্তন করার জন্য
  const menuConfig = {
    admin: adminMenuItems,
    superadmin: adminMenuItems,
    writer: [
      {
        title: "Dashboard",
        path: "/dashboard/writer",
        icon: <LuLayoutDashboard size={20} />,
      },
      {
        title: "Create News",
        path: "/dashboard/writer/add-news",
        icon: <MdOutlinePostAdd size={20} />,
      },
      {
        title: "Section Management",
        path: "/dashboard/writer/section-management",
        icon: <FiLayout size={20} />,
      },
    ],
    reader: [
      {
        title: "Dashboard",
        path: "/dashboard/reader",
        icon: <LuLayoutDashboard size={20} />,
      },
      {
        title: "Bookmarks",
        path: "/dashboard/reader/bookmarks",
        icon: <FiBookmark size={20} />,
      },
    ],
  };

  // বর্তমান ইউজারের রোল অনুযায়ী নির্দিষ্ট মেনু ফিল্টার
  const activeMenus = menuConfig[role] || [];

  const menuClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-[15px] font-medium ${
      pathname === path
        ? "bg-amber-900 text-white shadow-md"
        : "text-slate-700 dark:text-slate-300 hover:bg-amber-900 hover:text-white"
    }`;

  // 🔗 Home page er logo er ekই logic — settings theke src o visibility
  const logoSrc = settings?.logo?.trim() ? settings.logo : fallbackLogo;
  const logoVisible = settings?.logoVisible ?? true;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Block: Logo & Close Button */}
        <div className="h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            {settingsLoading ? (
              <div className="w-44 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : (
              logoVisible && (
                <img
                  src={logoSrc}
                  alt="Portal Logo"
                  className="w-44 object-contain select-none"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackLogo;
                  }}
                />
              )
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <FiX />
          </button>
        </div>

        {/* Navigation Link List */}
        <div className="px-4 py-6 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {activeMenus.map((menu, index) => (
              <li key={index}>
                <Link
                  to={menu.path}
                  onClick={() => setSidebarOpen(false)}
                  className={menuClass(menu.path)}
                >
                  {menu.icon}
                  <span>{menu.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;