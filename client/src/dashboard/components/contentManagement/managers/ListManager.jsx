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
}) => {

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {

    return data.filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, data]);

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h2 className="text-3xl font-black text-slate-800">

          {title}

        </h2>

        <p className="mt-2 text-slate-500">

          {description}

        </p>

      </div>

      {/* Top Bar */}

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search..."
            className="
              w-full
              h-12
              rounded-xl
              border
              border-slate-300
              pl-12
              pr-4
              outline-none
              focus:border-amber-600
            "
          />

        </div>

        {/* Add Button */}

        <button
          onClick={onAdd}
          className="
            h-12
            px-6
            rounded-xl
            bg-amber-700
            hover:bg-amber-800
            text-white
            flex
            items-center
            gap-2
          "
        >

          <Plus size={18} />

          Add New

        </button>

      </div>

            {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-bold">
                  #
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold">
                  Title
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold">
                  Visibility
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredData.map((item, index) => (

                <tr
                  key={item._id || item.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  {/* Serial */}

                  <td className="px-6 py-5">

                    {index + 1}

                  </td>

                  {/* Title */}

                  <td className="px-6 py-5">

                    <div>

                      <h3 className="font-semibold text-slate-800">

                        {item.title}

                      </h3>

                      {item.description && (

                        <p className="mt-1 text-sm text-slate-500">

                          {item.description}

                        </p>

                      )}

                    </div>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-5 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {item.status || "Draft"}

                    </span>

                  </td>

                  {/* Visibility */}

                  <td className="px-6 py-5 text-center">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.visible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {item.visible ? (

                        <Eye size={14} />

                      ) : (

                        <EyeOff size={14} />

                      )}

                      {item.visible
                        ? "Visible"
                        : "Hidden"}

                    </span>

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => onEdit(item)}
                        className="
                          h-10
                          w-10
                          rounded-lg
                          bg-blue-100
                          text-blue-700
                          hover:bg-blue-200
                          flex
                          items-center
                          justify-center
                          transition
                        "
                      >

                        <Pencil size={18} />

                      </button>

                      <button
                        onClick={() => onDelete(item)}
                        className="
                          h-10
                          w-10
                          rounded-lg
                          bg-red-100
                          text-red-700
                          hover:bg-red-200
                          flex
                          items-center
                          justify-center
                          transition
                        "
                      >

                        <Trash2 size={18} />

                      </button>

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

        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">

          <h3 className="text-xl font-bold text-slate-700">

            No Data Found

          </h3>

          <p className="mt-3 text-slate-500">

            There are no items available in this section.

          </p>

          <button
            onClick={onAdd}
            className="
              mt-8
              h-12
              px-6
              rounded-xl
              bg-amber-700
              hover:bg-amber-800
              text-white
              inline-flex
              items-center
              gap-2
            "
          >

            <Plus size={18} />

            Create First Item

          </button>

        </div>

      )}

      {/* Footer */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-200 pt-6">

        <div className="text-sm text-slate-500">

          Total Items :

          <span className="ml-2 font-bold text-slate-800">

            {filteredData.length}

          </span>

        </div>

        {/* Pagination Placeholder */}

        <div className="flex items-center gap-2">

          <button
            disabled
            className="
              h-10
              px-4
              rounded-lg
              border
              border-slate-300
              text-slate-400
              cursor-not-allowed
            "
          >
            Previous
          </button>

          <button
            className="
              h-10
              w-10
              rounded-lg
              bg-amber-700
              text-white
              font-semibold
            "
          >
            1
          </button>

          <button
            disabled
            className="
              h-10
              px-4
              rounded-lg
              border
              border-slate-300
              text-slate-400
              cursor-not-allowed
            "
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

};

export default ListManager;