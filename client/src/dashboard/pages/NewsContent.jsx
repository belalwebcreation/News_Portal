import React from 'react';

const statusStyles = {
  Approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  Rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      statusStyles[status] || 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20'
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === 'Approved'
          ? 'bg-emerald-500'
          : status === 'Pending'
          ? 'bg-amber-500'
          : status === 'Rejected'
          ? 'bg-red-500'
          : 'bg-gray-400'
      }`}
    />
    {status}
  </span>
);

const newsData = [
  {
    id: 1,
    title: 'News Title',
    image: 'https://via.placeholder.com/150',
    category: 'Category 1',
    description: 'This is a short description of the news article.',
    date: '2023-10-01',
    status: 'Approved',
  },
  {
    id: 2,
    title: 'Another News Title',
    image: 'https://via.placeholder.com/150',
    category: 'Category 2',
    description: 'This is another short description of a different news article.',
    date: '2023-10-02',
    status: 'Pending',
  },
];

const NewsContent = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">News management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review, approve, and manage all published news</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          + Add News
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 flex flex-wrap gap-3 border-b border-gray-100 bg-gray-50/50">
        <div className="relative flex-1 min-w-55 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            placeholder="Search news"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 transition-colors"
          />
        </div>
        <select className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 transition-colors text-gray-700">
          <option value="">All categories</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">No</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Title</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Image</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Description</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {newsData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-4 text-gray-500">{item.id}</td>
                <td className="px-5 py-4 font-medium text-gray-900">{item.title}</td>
                <td className="px-5 py-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{item.description}</td>
                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{item.date}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{newsData.length}</span> of{' '}
          <span className="font-medium text-gray-700">{newsData.length}</span> results
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-amber-600 text-white">1</button>
          <button className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsContent;
