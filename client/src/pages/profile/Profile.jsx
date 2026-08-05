import { useState } from "react";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileTabs from "../../components/profile/ProfileTabs";

import AccountSettings from "../../components/profile/AccountSettings";
import ChangePassword from "../../components/profile/ChangePassword";
import SavedNews from "../../components/profile/SavedNews";
import ReadingHistory from "../../components/profile/ReadingHistory";

import useProfile from "../../hooks/useProfile";

const Profile = () => {
  const {
    profile,
    loading,
    error,
    refreshProfile,
  } = useProfile();

  const [activeTab, setActiveTab] = useState("overview");

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-lg">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-warning max-w-lg">
          <span>Profile information not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">

      {/* =========================
          PROFILE HEADER
      ========================== */}

      <ProfileHeader
        profile={profile}
        onRefresh={refreshProfile}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* =========================
              DESKTOP SIDEBAR
          ========================== */}

          <div className="hidden lg:block lg:col-span-3">

            <ProfileSidebar
              profile={profile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

          </div>

          {/* =========================
              MAIN CONTENT
          ========================== */}

          <div className="lg:col-span-9 space-y-6">

            {/* Mobile Tabs */}

            <div className="lg:hidden">

              <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

            </div>

            {/* =========================
                OVERVIEW
            ========================== */}

            {activeTab === "overview" && (
              <>

                <ProfileInfo
                  profile={profile}
                />

                <ProfileStats
                  profile={profile}
                />

              </>
            )}

            {/* =========================
                ACCOUNT SETTINGS
            ========================== */}

            {activeTab === "account" && (

              <AccountSettings
                profile={profile}
                onRefresh={refreshProfile}
              />

            )}

            {/* =========================
                CHANGE PASSWORD
            ========================== */}

            {activeTab === "password" && (

              <ChangePassword />

            )}

            {/* =========================
                SAVED NEWS
            ========================== */}

            {activeTab === "saved" && (

              <SavedNews />

            )}

            {/* =========================
                READING HISTORY
            ========================== */}

            {activeTab === "history" && (

              <ReadingHistory />

            )}

            {/* =========================
                ACTIVITY
            ========================== */}

            {activeTab === "activity" && (

              <div className="card bg-base-100 shadow-xl">

                <div className="card-body">

                  <h2 className="text-2xl font-bold">
                    Activity Timeline
                  </h2>

                  <p className="text-base-content/70 mt-2">
                    Activity timeline will be available in a future update.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;