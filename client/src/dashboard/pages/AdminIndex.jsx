import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from "../../features/users/userService";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import { ArrowRight, Loader2, Award, Users } from "lucide-react";

// Rank Badge Styles
const rankBadgeStyles = {
  1: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-100',
  2: 'bg-slate-300 text-slate-800 ring-2 ring-slate-100',
  3: 'bg-amber-700/80 text-white ring-2 ring-amber-50',
};

const AdminIndex = () => {
  const [topWriters, setTopWriters] = useState([]);
  const [writersLoading, setWritersLoading] = useState(true);
  const [writersError, setWritersError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTopWriters = async () => {
      try {
        setWritersLoading(true);
        setWritersError(null);
        const data = await userService.getTopWriters(5);
        if (isMounted) {
          setTopWriters(Array.isArray(data) ? data : data?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setWritersError(error.message || "টপ রাইটারদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
        }
      } finally {
        if (isMounted) setWritersLoading(false);
      }
    };

    fetchTopWriters();
    return () => {
      isMounted = false;
    };
  }, []);

  const maxViews = Math.max(...topWriters.map((w) => w.stats?.totalViews || 0), 1);

  return (
    <div className="mt-3 space-y-6">
      {/* Stat cards — (Unchanged placeholder/integration) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* ... Stat Cards Content ... */}
      </div>

      {/* Recent news — (Unchanged placeholder/integration) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* ... Recent News Table/List Content ... */}
      </div>

      {/* Top Writers Section — Production Grade UI */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 transition-all">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Top Writers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ranked dynamically by total published article views
            </p>
          </div>
          <Link
            to="/admin/writers"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <span>View all</span>
            {/* ✅ Fixed: Correct Icon Component Usage */}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Writers List Body */}
        <div className="space-y-4">
          {writersLoading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-8">
              <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              <span>রাইটার লিস্ট লোড হচ্ছে...</span>
            </div>
          ) : writersError ? (
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-center">
              <p className="text-xs sm:text-sm font-medium text-rose-600">{writersError}</p>
            </div>
          ) : topWriters.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">এখনো কোনো লেখক ডাটা পাওয়া যায়নি</p>
            </div>
          ) : (
            topWriters.map((writer, index) => {
              const rank = index + 1;
              const views = writer.stats?.totalViews || 0;
              const widthPct = Math.min(Math.max((views / maxViews) * 100, 4), 100);

              return (
                <div
                  key={writer._id || index}
                  className="flex items-center gap-3 sm:gap-4 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Rank Badge */}
                  <span
                    className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                      rankBadgeStyles[rank] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rank}
                  </span>

                  {/* Profile Avatar */}
                  <div className="shrink-0">
                    <ProfileAvatar
                      src={writer.avatar?.url || writer.avatar}
                      alt={writer.name}
                      size="sm"
                      className="border border-slate-200 shadow-sm"
                    />
                  </div>

                  {/* Name and Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                        {writer.name || "Unknown Author"}
                      </p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Views Count */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {views.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Views
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;