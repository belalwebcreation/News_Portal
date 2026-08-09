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
  Sparkles,
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
   1. Navigation Links Sub-component
   ========================================== */
const SidebarNavigation = ({ activeTab, setActiveTab, stats = {} }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
        <span>Navigation</span>
        <span className="h-1 w-1 rounded-full bg-primary" />
      </div>
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const count = item.badgeKey ? stats[item.badgeKey] : null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary dark:text-primary-content shadow-sm border-l-4 border-primary pl-3.5"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/60 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md shadow-primary/30 scale-105"
                      : "bg-base-200/70 text-base-content/60 group-hover:bg-base-200 group-hover:text-primary"
                  }`}
                >
                  <Icon size={17} />
                </div>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {count > 0 && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "bg-base-200/80 text-base-content/70 group-hover:bg-base-300"
                    }`}
                  >
                    {formatNumber(count)}
                  </span>
                )}
                <ChevronRight
                  size={15}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "opacity-100 translate-x-0.5 text-primary"
                      : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-base-content/40"
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
   2. Quick Stats Grid Sub-component
   ========================================== */
const SidebarStats = ({ stats = {} }) => {
  const statList = [
    { label: "Published", value: stats.totalNews, icon: Newspaper },
    { label: "Views", value: stats.totalViews, icon: Eye },
    { label: "Saved", value: stats.savedNews, icon: Bookmark },
    { label: "Comments", value: stats.comments, icon: MessageCircle },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
        <span>Quick Stats</span>
        <Sparkles size={12} className="text-primary/60" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {statList.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-base-200/40 dark:bg-base-800/30 hover:bg-base-200/80 dark:hover:bg-base-800/60 border border-base-200/80 dark:border-base-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between h-full group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300 shadow-sm">
                  <Icon size={15} />
                </div>
                <span className="text-base sm:text-lg font-bold text-base-content tracking-tight">
                  {formatNumber(item.value)}
                </span>
              </div>
              <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">
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
   3. Dynamic Security Score Sub-component
   ========================================== */
const SidebarSecurity = ({ security = {}, isVerified = false }) => {
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
      label: "2FA Protection",
      passed: Boolean(security.is2FAEnabled),
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const scorePercentage = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Security Score
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              {scorePercentage}% Protection
            </p>
          </div>
        </div>
        <span
          className={`badge badge-sm font-bold border-none px-2.5 py-2 shadow-sm ${
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

      {/* Progress Bar */}
      <div className="w-full bg-emerald-500/20 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${scorePercentage}%` }}
        />
      </div>

      {/* Dynamic status badges */}
      <div className="pt-1 grid grid-cols-1 gap-1.5 text-[11px] font-semibold">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`flex items-center justify-between p-1.5 rounded-lg ${
              check.passed
                ? "text-emerald-900 dark:text-emerald-300 bg-emerald-500/10"
                : "text-base-content/40 bg-base-200/40"
            }`}
          >
            <span className="truncate">{check.label}</span>
            <CheckCircle2
              size={14}
              className={
                check.passed
                  ? "text-emerald-600 dark:text-emerald-400 shrink-0"
                  : "text-base-content/30 shrink-0"
              }
            />
          </div>
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
    <aside className="sticky top-24 w-full rounded-3xl bg-base-100/90 dark:bg-base-900/80 backdrop-blur-2xl border border-base-200/80 dark:border-base-700/60 shadow-xl shadow-base-300/10 dark:shadow-none p-4 sm:p-5 space-y-6 transition-all duration-300">
      {/* 1. Navigation Section */}
      <SidebarNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 dark:via-base-700 to-transparent" />

      {/* 2. Quick Stats Grid */}
      <SidebarStats stats={stats} />

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 dark:via-base-700 to-transparent" />

      {/* 3. Dynamic Security Widget */}
      <SidebarSecurity security={security} isVerified={isVerified} />
    </aside>
  );
};

export default ProfileSidebar;