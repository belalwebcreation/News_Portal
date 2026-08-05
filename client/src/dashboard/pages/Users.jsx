import { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import {
  Users as UsersIcon,
  UserCheck,
  Shield,
  PenTool,
  Search,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from "lucide-react";
import { userService } from "../../features/users/userService";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import UserHoverCard from "../../features/profile/UserHoverCard";
import { useClickOutside } from "../../hooks/useClickOutside";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

const ROLE_STYLES = {
  superadmin: {
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20 border-rose-200",
    icon: Shield,
    label: "Super Admin",
  },
  admin: {
    badge: "bg-purple-50 text-purple-700 ring-purple-600/20 border-purple-200",
    icon: Shield,
    label: "Admin",
  },
  writer: {
    badge: "bg-amber-50 text-amber-800 ring-amber-600/20 border-amber-200",
    icon: PenTool,
    label: "Writer",
  },
  reader: {
    badge: "bg-slate-50 text-slate-700 ring-slate-600/20 border-slate-200",
    icon: UsersIcon,
    label: "Reader",
  },
};

const NEXT_ROLE = {
  reader: "writer",
  writer: "admin",
};

const PREV_ROLE = {
  admin: "writer",
  writer: "reader",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ----------------------------------------------------------------------
// Sleek Portal Action Dropdown Menu
// ----------------------------------------------------------------------
const UserActionDropdown = ({
  user,
  isSuperAdmin,
  isBusy,
  onInitiateAction,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUpward: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setOpen(false), open);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 130;
    const menuWidth = 190;

    // Aggressive Flip logic: Open upward if in the bottom 40% of the screen
    const openUpward = rect.bottom > window.innerHeight * 0.6;

    setCoords({
      top: openUpward
        ? rect.top + window.scrollY - menuHeight - 4
        : rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - menuWidth,
      openUpward,
    });
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open) calculatePosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = () => calculatePosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, calculatePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={isBusy}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="z-[9999] w-48 rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
          >
            {NEXT_ROLE[user.role] && (
              <button
                onClick={() => {
                  setOpen(false);
                  onInitiateAction("promote", user);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <ArrowUpRight size={15} className="text-emerald-600 shrink-0" />
                <span>Promote to {NEXT_ROLE[user.role]}</span>
              </button>
            )}

            {isSuperAdmin && PREV_ROLE[user.role] && (
              <button
                onClick={() => {
                  setOpen(false);
                  onInitiateAction("demote", user);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <ArrowDownRight size={15} className="text-amber-600 shrink-0" />
                <span>Demote to {PREV_ROLE[user.role]}</span>
              </button>
            )}

            {user.role !== "superadmin" && (
              <>
                {(NEXT_ROLE[user.role] ||
                  (isSuperAdmin && PREV_ROLE[user.role])) && (
                  <div className="my-1 border-t border-slate-100" />
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    onInitiateAction("delete", user);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={15} className="text-rose-500 shrink-0" />
                  <span>Delete User</span>
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

// ----------------------------------------------------------------------
// Table Row
// ----------------------------------------------------------------------
const UserTableRow = ({
  user,
  isSuperAdmin,
  actionLoadingId,
  onInitiateAction,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const targetRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  const RoleIcon = ROLE_STYLES[user.role]?.icon || UsersIcon;
  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.reader;

  return (
    <tr className="group border-b border-slate-100/80 hover:bg-amber-50/40 hover:shadow-sm transition-all duration-150">
      {/* User Info */}
      <td className="px-5 py-3.5">
        <div
          ref={targetRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="inline-flex items-center"
        >
          <Link
            to={`/profile/${user.username}`}
            className="flex items-center gap-3.5"
          >
            <ProfileAvatar
              src={user.avatar?.url}
              alt={user.name}
              size="table"
              verified={user.isVerified}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 group-hover:text-amber-800 transition-colors text-sm">
                {user.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>@{user.username || "user"}</span>
                <span>•</span>
                <span>{user.email}</span>
              </div>
            </div>
          </Link>

          <UserHoverCard
            userId={user._id}
            username={user.username}
            targetRef={targetRef}
            isHovered={isHovered}
          />
        </div>
      </td>

      {/* Role */}
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleStyle.badge}`}
        >
          <RoleIcon size={12} />
          {roleStyle.label}
        </span>
      </td>

      {/* Activity */}
      <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">
        <span className="font-semibold text-slate-900">
          {user.stats?.postsCount ?? 0}
        </span>{" "}
        articles
      </td>

      {/* Joined Date */}
      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
        {formatDate(user.createdAt)}
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              user.isActive !== false
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-300"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              user.isActive !== false ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {user.isActive !== false ? "Active" : "Inactive"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5 text-right">
        <UserActionDropdown
          user={user}
          isSuperAdmin={isSuperAdmin}
          isBusy={actionLoadingId === user._id}
          onInitiateAction={onInitiateAction}
        />
      </td>
    </tr>
  );
};

// ----------------------------------------------------------------------
// Main Users Component
// ----------------------------------------------------------------------
const Users = () => {
  const { userInfo } = useAuth();
  const isSuperAdmin = userInfo?.role === "superadmin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal & Toast states
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    type: null, // "promote" | "demote" | "delete"
    user: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const fetchUsers = useCallback(
    async (searchTerm = search) => {
      try {
        setLoading(true);
        setError("");
        const res = await userService.getAllUsers({
          role: roleFilter !== "all" ? roleFilter : undefined,
          search: searchTerm.trim() || undefined,
        });
        const dataList = res.data || [];
        setUsers(dataList);
        setTotal(res.total ?? dataList.length);
      } catch (err) {
        setError(err.message || "ইউজার লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    },
    [roleFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const handleInitiateAction = (type, user) => {
    setActiveModal({ isOpen: true, type, user });
  };

  const handleConfirmAction = async () => {
    const { type, user } = activeModal;
    if (!user || !type) return;

    try {
      setActionLoading(true);

      if (type === "promote") {
        const nextRole = NEXT_ROLE[user.role];
        const updated = await userService.promoteUser(user._id);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: updated.role } : u))
        );
        setToast({
          message: `✓ User ${user.name} promoted to ${nextRole} successfully!`,
          type: "success",
        });
      } else if (type === "demote") {
        const prevRole = PREV_ROLE[user.role];
        const updated = await userService.demoteUser(user._id);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: updated.role } : u))
        );
        setToast({
          message: `User ${user.name} demoted to ${prevRole}.`,
          type: "success",
        });
      } else if (type === "delete") {
        await userService.deleteUser(user._id);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        setTotal((prev) => prev - 1);
        setToast({
          message: `User ${user.name} deleted successfully.`,
          type: "success",
        });
      }
    } catch (err) {
      setToast({
        message: err.message || "অপারেশনটি সফল হয়নি।",
        type: "error",
      });
    } finally {
      setActionLoading(false);
      setActiveModal({ isOpen: false, type: null, user: null });
    }
  };

  // Quick stats
  const stats = {
    total: total,
    writers: users.filter((u) => u.role === "writer").length,
    readers: users.filter((u) => u.role === "reader").length,
    admins: users.filter(
      (u) => u.role === "admin" || u.role === "superadmin"
    ).length,
  };

  return (
    <div className="space-y-6 pb-12">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <ConfirmModal
        isOpen={activeModal.isOpen}
        onClose={() =>
          setActiveModal({ isOpen: false, type: null, user: null })
        }
        onConfirm={handleConfirmAction}
        type={activeModal.type}
        isLoading={actionLoading}
        message={
          activeModal.type === "promote"
            ? `Are you sure you want to promote ${activeModal.user?.name} to ${
                NEXT_ROLE[activeModal.user?.role]
              }?`
            : activeModal.type === "demote"
            ? `Are you sure you want to demote ${activeModal.user?.name} to ${
                PREV_ROLE[activeModal.user?.role]
              }?`
            : `Are you sure you want to permanently delete account for ${activeModal.user?.name}? This action cannot be undone.`
        }
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Overview and controls for all members, content creators, and
          administrators.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
            <UsersIcon size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Users</p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {stats.total}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shrink-0">
            <PenTool size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Writers</p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {stats.writers}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Readers</p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {stats.readers}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700 shrink-0">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Admins</p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {stats.admins}
            </h3>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
        <div className="relative w-full flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, username..."
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="writer">Writer</option>
          <option value="reader">Reader</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-semibold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Activity</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-xs font-medium text-slate-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-xs font-medium text-rose-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-xs font-medium text-slate-400"
                  >
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UserTableRow
                    key={user._id}
                    user={user}
                    isSuperAdmin={isSuperAdmin}
                    actionLoadingId={
                      actionLoading && activeModal.user?._id === user._id
                        ? user._id
                        : null
                    }
                    onInitiateAction={handleInitiateAction}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;