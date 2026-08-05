import {
  User,
  Settings,
  Lock,
  Bookmark,
  History,
  Activity,
  Newspaper,
  Eye,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// Helper function to format large numbers (e.g. 10000 -> 10K)
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const menuItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "account", label: "Account Settings", icon: Settings },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "saved", label: "Saved News", icon: Bookmark, badgeKey: "savedNews" },
  { id: "history", label: "Reading History", icon: History, badgeKey: "readingHistory" },
  { id: "activity", label: "Activity", icon: Activity, badgeKey: "activityCount" },
];

/* ==========================================
   1. Sub-component: Navigation Links (Top Priority)
   ========================================== */
const SidebarNavigation = ({ activeTab, setActiveTab, stats = {} }) => {
  return (
    <div className="space-y-2">
      <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
        Navigation
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const count = item.badgeKey ? stats[item.badgeKey] : null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center justify-between py-2.5 px-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary pl-2.5 shadow-sm"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md shadow-primary/30"
                      : "bg-base-200/50 text-base-content/60 group-hover:bg-base-200 group-hover:text-base-content"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content/70"
                    }`}
                  >
                    {formatNumber(count)}
                  </span>
                )}
                <ChevronRight
                  size={14}
                  className={`transition-transform opacity-0 group-hover:opacity-100 ${
                    isActive ? "opacity-100 translate-x-0.5 text-primary" : "text-base-content/40"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

/* ==========================================
   2. Sub-component: Quick Stats Grid
   ========================================== */
const SidebarStats = ({ stats = {} }) => {
  const statList = [
    { label: "Published", value: stats.totalNews, icon: Newspaper },
    { label: "Views", value: stats.totalViews, icon: Eye },
    { label: "Saved", value: stats.savedNews, icon: Bookmark },
    { label: "Comments", value: stats.comments, icon: MessageCircle },
  ];

  return (
    <div className="space-y-2">
      <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
        Quick Stats
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {statList.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-3 rounded-2xl bg-base-200/40 hover:bg-base-200/70 border border-base-200/80 transition-all duration-200 flex flex-col justify-between h-full group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Icon size={15} />
                </div>
                <span className="text-base font-bold text-base-content tracking-tight">
                  {formatNumber(item.value)}
                </span>
              </div>
              <span className="text-[11px] font-medium text-base-content/60 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   3. Sub-component: Dynamic Security Score Widget
   ========================================== */
const SidebarSecurity = ({ security = {}, isVerified = false }) => {
  // Dynamic security checks based on user/backend profile flags
  const checks = [
    {
      id: "verified",
      label: isVerified ? "Account Verified" : "Unverified Profile",
      passed: Boolean(isVerified || security.isEmailVerified),
    },
    {
      id: "password",
      label: "Strong Password",
      passed: security.hasStrongPassword ?? true,
    },
    {
      id: "2fa",
      label: "2FA Enabled",
      passed: Boolean(security.is2FAEnabled),
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const scorePercentage = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Security Score
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              {scorePercentage}% Protection
            </p>
          </div>
        </div>
        <span
          className={`badge badge-sm font-semibold border-none ${
            scorePercentage === 100
              ? "bg-emerald-500 text-white"
              : scorePercentage >= 60
              ? "bg-amber-500 text-white"
              : "bg-error text-white"
          }`}
        >
          {scorePercentage === 100 ? "High" : scorePercentage >= 60 ? "Medium" : "Low"}
        </span>
      </div>

      {/* Dynamic status badges */}
      <div className="pt-2 border-t border-emerald-500/15 grid grid-cols-2 gap-1.5 text-[11px] font-medium">
        {checks.map((check) => (
          <span
            key={check.id}
            className={`flex items-center gap-1.5 ${
              check.passed
                ? "text-emerald-800 dark:text-emerald-300"
                : "text-base-content/40"
            }`}
          >
            <CheckCircle2
              size={13}
              className={
                check.passed
                  ? "text-emerald-600 dark:text-emerald-400 shrink-0"
                  : "text-base-content/30 shrink-0"
              }
            />
            <span className="truncate">{check.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   Main Component Wrapper
   ========================================== */
const ProfileSidebar = ({ profile, activeTab, setActiveTab }) => {
  const { isVerified, stats = {}, security = {} } = profile || {};

  return (
    <aside className="sticky top-24 w-full rounded-3xl bg-base-100/80 backdrop-blur-xl border border-base-200/80 shadow-2xl shadow-base-300/20 dark:shadow-none p-4 sm:p-5 space-y-5 transition-all">
      {/* 1. Navigation Section (Top Priority) */}
      <SidebarNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* 2. Quick Stats Grid */}
      <SidebarStats stats={stats} />

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* 3. Dynamic Security Widget */}
      <SidebarSecurity security={security} isVerified={isVerified} />
    </aside>
  );
};

export default ProfileSidebar;