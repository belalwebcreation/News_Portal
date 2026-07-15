import React from 'react';
import { Link } from 'react-router-dom';

const IconNewspaper = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="7" y1="8" x2="12" y2="8" />
    <line x1="7" y1="11" x2="17" y2="11" />
    <line x1="7" y1="14" x2="17" y2="14" />
    <line x1="7" y1="17" x2="14" y2="17" />
  </svg>
);

const IconClock = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

const IconCheckCircle = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 5-5" />
  </svg>
);

const IconXCircle = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5l5 5" />
    <path d="M14.5 9.5l-5 5" />
  </svg>
);

const IconUsers = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15.5 14.2c2.5.4 4.5 2.5 4.5 5.3" />
  </svg>
);

const IconArrowRight = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

const stats = [
  { label: 'Total News', value: 128, icon: IconNewspaper, color: 'amber' },
  { label: 'Pending News', value: 14, icon: IconClock, color: 'yellow' },
  { label: 'Approved News', value: 98, icon: IconCheckCircle, color: 'emerald' },
  { label: 'Rejected News', value: 16, icon: IconXCircle, color: 'red' },
  { label: 'Writers', value: 12, icon: IconUsers, color: 'blue' },
];

const colorStyles = {
  amber: 'bg-amber-50 text-amber-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
};

const statusStyles = {
  Approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  Rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
};

const statusDot = {
  Approved: 'bg-emerald-500',
  Pending: 'bg-amber-500',
  Rejected: 'bg-red-500',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
    {status}
  </span>
);

const recentNews = [
  { id: 1, title: 'Global Markets Rally Amid Rate Cut Hopes', category: 'Business', image: 'https://via.placeholder.com/150', date: '2026-07-05', status: 'Approved' },
  { id: 2, title: 'Tech Giant Unveils New AI Model', category: 'Technology', image: 'https://via.placeholder.com/150', date: '2026-07-05', status: 'Pending' },
  { id: 3, title: 'National Team Advances to Tournament Finals', category: 'Sports', image: 'https://via.placeholder.com/150', date: '2026-07-04', status: 'Approved' },
  { id: 4, title: 'Heavy Rainfall Warning Issued for Coastal Regions', category: 'Weather', image: 'https://via.placeholder.com/150', date: '2026-07-04', status: 'Rejected' },
  { id: 5, title: 'Local Elections: Results Announced', category: 'Politics', image: 'https://via.placeholder.com/150', date: '2026-07-03', status: 'Pending' },
];

const topWriters = [
  { id: 1, name: 'Ayesha Rahman', articles: 42 },
  { id: 2, name: 'Tanvir Ahmed', articles: 36 },
  { id: 3, name: 'Nusrat Jahan', articles: 29 },
  { id: 4, name: 'Rakibul Islam', articles: 24 },
  { id: 5, name: 'Farzana Akter', articles: 19 },
];

const maxArticles = Math.max(...topWriters.map((w) => w.articles));

const rankBadgeStyles = {
  1: 'bg-amber-500 text-white',
  2: 'bg-gray-300 text-gray-700',
  3: 'bg-amber-200 text-amber-800',
};

const AdminIndex = () => {
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

      {/* Recent news */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent News</h2>
          <Link
            to="/admin/news"
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
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">News</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentNews.map((item) => (
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
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{item.date}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/admin/news/${item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top writers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top Writers</h2>
            <p className="text-sm text-gray-500 mt-0.5">Most articles published this month</p>
          </div>
          <Link
            to="/admin/writers"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {topWriters.map((writer, index) => {
            const rank = index + 1;
            const widthPct = (writer.articles / maxArticles) * 100;
            return (
              <div key={writer.id} className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    rankBadgeStyles[rank] || 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {rank}
                </span>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name)}&background=D97706&color=fff&bold=true`}
                  alt={writer.name}
                  className="h-9 w-9 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{writer.name}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 flex-shrink-0">{writer.articles}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;