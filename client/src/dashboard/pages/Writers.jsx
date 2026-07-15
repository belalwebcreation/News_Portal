import { Link } from "react-router-dom";

const writers = [
  {
    id: 1,
    image: "https://i.pravatar.cc/150?img=11",
    name: "Belal Hossain",
    email: "belal@gmail.com",
    role: "Senior Writer",
    category: "Technology",
    articles: 42,
    status: "Active",
    join: "05 Jul 2026",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/150?img=12",
    name: "Rakib Hasan",
    email: "rakib@gmail.com",
    role: "Writer",
    category: "Sports",
    articles: 25,
    status: "Inactive",
    join: "02 Jul 2026",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/150?img=13",
    name: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    role: "Editor",
    category: "Education",
    articles: 61,
    status: "Active",
    join: "20 Jun 2026",
  },
];

const Writers = () => {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Writers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all writers of your news portal.
          </p>
        </div>

        <Link
          to="/dashboard/admin/add-writer"
          className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          + Add Writer
        </Link>

      </div>

      {/* Filter */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

        <div className="grid lg:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search writer..."
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-amber-700"
          />

          <select className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-amber-700">

            <option>All Roles</option>
            <option>Writer</option>
            <option>Senior Writer</option>
            <option>Editor</option>

          </select>

          <select className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-amber-700">

            <option>All Categories</option>
            <option>Technology</option>
            <option>Sports</option>
            <option>Education</option>
            <option>Politics</option>
            <option>Campus</option>

          </select>

          <button className="bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition">
            Search
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b flex justify-between items-center">

          <h2 className="text-lg font-semibold">
            All Writers
          </h2>

          <span className="text-sm text-gray-500">
            Total : {writers.length}
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-5 py-3 text-left">Writer</th>

                <th className="px-5 py-3 text-left">Role</th>

                <th className="px-5 py-3 text-left">Category</th>

                <th className="px-5 py-3 text-left">Articles</th>

                <th className="px-5 py-3 text-left">Join Date</th>

                <th className="px-5 py-3 text-left">Status</th>

                <th className="px-5 py-3 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {writers.map((writer) => (

                <tr
                  key={writer.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={writer.image}
                        alt=""
                        className="size-12 rounded-full object-cover border"
                      />

                      <div>

                        <h3 className="font-semibold text-gray-800">
                          {writer.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {writer.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {writer.role}
                  </td>

                  <td className="px-5 py-4">
                    {writer.category}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {writer.articles}
                  </td>

                  <td className="px-5 py-4">
                    {writer.join}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        writer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {writer.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-2">

                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                        View
                      </button>

                      <button className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded">
                        Edit
                      </button>

                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Writers;