import {
  User,
  Settings,
  Lock,
  Bookmark,
  History,
  Activity,
} from "lucide-react";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: User,
  },
  {
    id: "account",
    label: "Account Settings",
    icon: Settings,
  },
  {
    id: "password",
    label: "Change Password",
    icon: Lock,
  },
  {
    id: "saved",
    label: "Saved News",
    icon: Bookmark,
  },
  {
    id: "history",
    label: "Reading History",
    icon: History,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
  },
];

const ProfileTabs = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg">

      <div className="card-body p-3">

        <div
          role="tablist"
          className="tabs tabs-boxed flex flex-wrap gap-2 bg-transparent"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                onClick={() => setActiveTab(tab.id)}
                className={`tab gap-2 px-5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "tab-active bg-primary text-primary-content"
                    : ""
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default ProfileTabs;