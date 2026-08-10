import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";

const ListManager = ({
  title,
  description,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const [search, setSearch] = useState("");

  // Search filter
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      (item.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="
              w-full h-12 rounded-xl border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-slate-100
              placeholder-slate-400 dark:placeholder-slate-500
              pl-12 pr-4 outline-none
              focus:border-amber-600 dark:focus:border-amber-500
            "
          />
        </div>

        {/* Add Button */}
        <button
          onClick={onAdd}
          className="
            h-12 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white
            flex items-center gap-2
          "
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200">#</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200">Title</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-200">Position</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-200">Visibility</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item._id || item.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                >
                  {/* Serial */}
                  <td className="px-6 py-5 text-slate-700 dark:text-slate-300">{index + 1}</td>

                  {/* Title */}
                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Position Column */}
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.position === "right"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.position === "right" ? "Right" : "Left"}
                    </span>
                  </td>

                  {/* Cleaned Visibility Toggle Button */}
                  <td className="px-6 py-5 text-center">
                    <button
                      disabled={item.isHome}
                      onClick={() => onToggle?.(item)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition
                      ${
                        item.visible
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }
                      ${
                        item.isHome
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:opacity-80"
                      }`}
                    >
                      {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      {item.visible ? "Visible" : "Hidden"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item)}
                        className="
                          h-10 w-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200
                          dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60
                          flex items-center justify-center transition
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete Button */}
                      {!item.isHome && (
                        <button
                          onClick={() => onDelete(item)}
                          className="
                            h-10 w-10 rounded-lg bg-red-100 text-red-700 hover:bg-red-200
                            dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60
                            flex items-center justify-center transition
                          "
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 py-16 text-center">
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No Data Found</h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400">There are no items available in this section.</p>
          <button
            onClick={onAdd}
            className="
              mt-8 h-12 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white
              inline-flex items-center gap-2
            "
          >
            <Plus size={18} />
            Create First Item
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Total Items : <span className="ml-2 font-bold text-slate-800 dark:text-slate-100">{filteredData.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button disabled className="h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            Previous
          </button>
          <button className="h-10 w-10 rounded-lg bg-amber-700 dark:bg-amber-600 text-white font-semibold">1</button>
          <button disabled className="h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListManager;