import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ============================================================================
 * NEWS PORTAL — READER DASHBOARD — fully responsive, UI-complete.
 * Mirrors AdminIndex.jsx's design system (same cards, tables, tokens) but
 * scoped to a logged-in reader's own activity instead of site-wide content.
 * Backend is NOT wired up yet — every array below is mock data.
 * ============================================================================
 * This page is the hub for the reader account area. It previews each of the
 * five reader sections and deep-links out to their dedicated pages:
 *
 *   - "Continue Reading" panel  -> /reader/history    (ReaderHistory.jsx)
 *   - "Your Bookmarks" panel    -> /reader/bookmarks  (ReaderBookmarks.jsx)
 *   - "Recent Comments" panel   -> /reader/comments   (ReaderComments.jsx)
 *   - Profile card              -> /reader/profile    (ReaderProfile.jsx)
 *   - Settings card             -> /reader/settings   (ReaderSettings.jsx)
 *
 * Register those five routes in your router alongside this one. Replace the
 * mock arrays with real data once these endpoints exist:
 *   GET /api/reader/stats, /api/reader/history, /api/reader/bookmarks,
 *   GET /api/reader/comments, GET /api/reader/profile
 * ============================================================================
 */

const IconBookmark = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 4h12v16l-6-4-6 4V4z" />
  </svg>
);

const IconMessageCircle = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 5h16v11H9l-4 4V5z" />
    <line x1="7.5" y1="9" x2="16.5" y2="9" />
    <line x1="7.5" y1="12.5" x2="13.5" y2="12.5" />
  </svg>
);

const IconBookOpen = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 5.5c2-1 5-1 8 .5 3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5v-13z" />
    <path d="M12 6v13" />
  </svg>
);

const IconTag = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11.5 3H5.5a1.5 1.5 0 00-1.5 1.5v6l10 10 8-8-10-10z" />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const IconFlame = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21.5c4 0 6.5-2.5 6.5-6 0-2.8-1.6-4.5-2.8-6.3.1 1.7-.8 2.6-1.7 2.6.4-3-.9-5.3-3.3-6.8.6 2.7-.7 4.2-2.4 6.2C6.9 12.7 5.5 14.1 5.5 16c0 3.3 2.5 5.5 6.5 5.5z" />
  </svg>
);

const IconSettings = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v3M12 18v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M3 12h3M18 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
  </svg>
);

const IconArrowRight = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

const stats = [
  { label: 'Bookmarked', value: 34, icon: IconBookmark, color: 'amber' },
  { label: 'Comments', value: 21, icon: IconMessageCircle, color: 'blue' },
  { label: 'Articles Read', value: 156, icon: IconBookOpen, color: 'emerald' },
  { label: 'Following', value: 12, icon: IconTag, color: 'violet' },
  { label: 'Day Streak', value: 18, icon: IconFlame, color: 'orange' },
];

const colorStyles = {
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
};

const continueReading = [
  { id: 1, title: 'Global Markets Rally Amid Rate Cut Hopes', category: 'Business', image: 'https://via.placeholder.com/150', lastRead: '2026-07-08', progress: 82 },
  { id: 2, title: 'Tech Giant Unveils New AI Model', category: 'Technology', image: 'https://via.placeholder.com/150', lastRead: '2026-07-07', progress: 45 },
  { id: 3, title: 'National Team Advances to Tournament Finals', category: 'Sports', image: 'https://via.placeholder.com/150', lastRead: '2026-07-06', progress: 100 },
  { id: 4, title: 'Heavy Rainfall Warning Issued for Coastal Regions', category: 'Weather', image: 'https://via.placeholder.com/150', lastRead: '2026-07-05', progress: 20 },
  { id: 5, title: 'Local Elections: Results Announced', category: 'Politics', image: 'https://via.placeholder.com/150', lastRead: '2026-07-04', progress: 60 },
];

const bookmarks = [
  { id: 6, title: 'The Future of Renewable Energy in South Asia', category: 'Environment', image: 'https://via.placeholder.com/300x180', savedDate: '2026-07-06' },
  { id: 7, title: 'Inside the New Metro Rail Expansion Plan', category: 'Infrastructure', image: 'https://via.placeholder.com/300x180', savedDate: '2026-07-05' },
  { id: 8, title: 'How Remote Work Reshaped the Job Market', category: 'Business', image: 'https://via.placeholder.com/300x180', savedDate: '2026-07-02' },
];

const recentComments = [
  { id: 1, articleTitle: 'Global Markets Rally Amid Rate Cut Hopes', comment: 'This is exactly the correction the market needed after last quarter.', date: '2026-07-08', likes: 12 },
  { id: 2, articleTitle: 'Tech Giant Unveils New AI Model', comment: 'Curious how this compares to the previous release in real-world benchmarks.', date: '2026-07-06', likes: 8 },
  { id: 3, articleTitle: 'Local Elections: Results Announced', comment: 'Turnout numbers this year are genuinely encouraging for the district.', date: '2026-07-04', likes: 5 },
];

const reader = {
  name: 'Nabila Islam',
  memberSince: 'Member since Jan 2025',
  avatar: 'https://ui-avatars.com/api/?name=Nabila+Islam&background=D97706&color=fff&bold=true',
};

const ReaderIndex = () => {
  return (
    <div className="mt-3">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="w-full p-6 flex flex-col items-start gap-y-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className={`inline-flex items-center justify-center h-11 w-11 rounded-lg ${colorStyles[stat.color]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Reading */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Continue Reading</h2>
            <p className="text-sm text-gray-500 mt-0.5">Pick up where you left off</p>
          </div>
          <Link
            to="/reader/history"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Article</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Last Read</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Progress</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {continueReading.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate max-w-[280px]">{item.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{item.lastRead}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.progress === 100 ? 'Completed' : `${item.progress}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/news/${item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      {item.progress === 100 ? 'Read again' : 'Continue'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Your Bookmarks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Bookmarks</h2>
            <p className="text-sm text-gray-500 mt-0.5">Articles you've saved to read later</p>
          </div>
          <Link
            to="/reader/bookmarks"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/90 text-gray-700 text-xs font-medium">
                  {item.category}
                </span>
                <span className="absolute top-2 right-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-white/90 text-amber-600">
                  <IconBookmark className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">Saved on {item.savedDate}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Comments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Comments</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your latest replies and discussions</p>
          </div>
          <Link
            to="/reader/comments"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentComments.map((item) => (
            <div key={item.id} className="flex gap-3">
              <span className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-50 text-blue-600 inline-flex items-center justify-center">
                <IconMessageCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">&ldquo;{item.comment}&rdquo;</p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1.5 text-xs text-gray-500">
                  <span>on</span>
                  <span className="font-medium text-gray-700 truncate max-w-[220px]">{item.articleTitle}</span>
                  <span>&bull;</span>
                  <span className="whitespace-nowrap">{item.date}</span>
                  <span>&bull;</span>
                  <span className="whitespace-nowrap">{item.likes} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account: Profile & Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <img src={reader.avatar} alt={reader.name} className="h-14 w-14 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{reader.name}</p>
            <p className="text-sm text-gray-500 truncate">{reader.memberSince}</p>
          </div>
          <Link
            to="/reader/profile"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 flex-shrink-0"
          >
            Edit
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-50 text-gray-600 flex-shrink-0">
            <IconSettings className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">Settings</p>
            <p className="text-sm text-gray-500 truncate">Notifications, privacy &amp; preferences</p>
          </div>
          <Link
            to="/reader/settings"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 flex-shrink-0"
          >
            Open
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReaderIndex;