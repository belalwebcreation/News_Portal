import { useState, useMemo } from "react";
import { Plus, ChevronUp, ChevronDown, Trash2, Pencil, Check, X } from "lucide-react";

import { useNavbarManager } from "../../../../hooks/useNavbarManager";
import EmptyState from "../../../pages/WriterSectionManagement/components/EmptyState";
import ToggleSwitch from "../../ToggleSwitch";
import ConfirmModal from "../../../pages/WriterSectionManagement/modals/ConfirmModal";
import { ManagerErrorBanner, ManagerPageLoader } from "../../../pages/WriterSectionManagement/components/ManagerFeedback";

const POSITION_OPTIONS = [
  { value: "left", label: "Left Menu" },
  { value: "right", label: "Right Menu" },
];

const NavbarManager = () => {
  const { menus, availableCategories, loading, error, confirmModal, actions } = useNavbarManager();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(POSITION_OPTIONS[0].value);

  const [editingHome, setEditingHome] = useState(null);
  const [homeTitle, setHomeTitle] = useState("");

  const grouped = useMemo(() => {
    const map = {};
    POSITION_OPTIONS.forEach((p) => {
      map[p.value] = [];
    });
    menus.forEach((m) => {
      if (!map[m.position]) map[m.position] = [];
      map[m.position].push(m);
    });
    Object.keys(map).forEach((key) => map[key].sort((a, b) => a.order - b.order));
    return map;
  }, [menus]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || loading.mutating) return;
    actions.addMenu(selectedCategory, selectedPosition);
    setSelectedCategory("");
  };

  const handleMove = (group, index, direction) => {
    const list = grouped[group];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const a = list[index];
    const b = list[targetIndex];
    actions.reorder([
      { _id: a._id, order: b.order },
      { _id: b._id, order: a.order },
    ]);
  };

  if (loading.initial) return <ManagerPageLoader message="নেভবার মেনু লোড হচ্ছে..." />;

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-3 sm:space-y-6 sm:p-4">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Navbar Manager</h2>
        <p className="mt-1 text-sm text-slate-500">
          সাইটের হেডার নেভিগেশনে কোন ক্যাটাগরি, কোন পজিশনে ও কোন অর্ডারে দেখাবে তা নিয়ন্ত্রণ করুন।
        </p>
      </header>

      <ManagerErrorBanner message={error} />

      {/* Add new menu form */}
      <form
        onSubmit={handleAddSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="nav-category" className="mb-1 block text-xs font-semibold text-slate-600">
            Category
          </label>
          <select
            id="nav-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <option value="">নির্বাচন করুন...</option>
            {availableCategories
  .filter(
    (category) =>
      !menus.some(
        (menu) =>
          menu.category?._id === category._id ||
          menu.category === category._id
      )
  )
  .map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
          </select>
        </div>

        <div className="sm:w-48">
          <label htmlFor="nav-position" className="mb-1 block text-xs font-semibold text-slate-600">
            Position
          </label>
          <select
            id="nav-position"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {POSITION_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!selectedCategory || loading.mutating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add to Navbar
        </button>
      </form>

      {/* Position groups */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {POSITION_OPTIONS.map((pos) => {
          const list = grouped[pos.value] || [];
          return (
            <section key={pos.value} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">{pos.label}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {list.length} item{list.length !== 1 ? "s" : ""}
                </span>
              </div>

              {list.length > 0 ? (
                <ul className="space-y-2">
                  {list.map((item, index) => (
                    <li
                      key={item._id}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleMove(pos.value, index, "up")}
                          disabled={index === 0 || loading.mutating}
                          aria-label="উপরে সরান"
                          className="rounded p-0.5 text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(pos.value, index, "down")}
                          disabled={index === list.length - 1 || loading.mutating}
                          aria-label="নিচে সরান"
                          className="rounded p-0.5 text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Inline Editing UI Condition */}
                      {item.isHome && editingHome === item._id ? (
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <input
  type="text"
  value={homeTitle}
  onChange={(e) => setHomeTitle(e.target.value)}
  onKeyDown={async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!homeTitle.trim() || loading.mutating) return;

      const success = await actions.updateMenu(item._id, {
        title: homeTitle.trim(),
      });

      if (success) {
        setEditingHome(null);
        setHomeTitle("");
      }
    }

    if (e.key === "Escape") {
      setEditingHome(null);
      setHomeTitle("");
    }
  }}
  autoFocus
  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
/>

                          <button
                            type="button"
                            onClick={async () => {
                              if (!homeTitle.trim()) return;
                              const success = await actions.updateMenu(item._id, {
                                title: homeTitle.trim(),
                              });
                              if (success) {
                                setEditingHome(null);
                                setHomeTitle("");
                              }
                            }}
                            disabled={loading.mutating}
                            className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            aria-label="Save title"
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingHome(null);
                              setHomeTitle(""); // ক্যানসেল করলে স্টেট ক্লিয়ার হবে
                            }}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                            {item.isHome
                              ? item.title
                              : item.category?.name || "Untitled category"}
                          </span>

                          {item.isHome && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingHome(item._id);
                                setHomeTitle(item.title || "");
                              }}
                              className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                              aria-label="Edit home title"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}

                      <div className="ml-auto flex items-center gap-3">
                        <ToggleSwitch
                          checked={item.visible}
                          onChange={() => actions.toggleVisibility(item._id)}
                          disabled={loading.mutating}
                          label={`${
                            item.isHome
                              ? item.title
                              : item.category?.name || "menu"
                          } visibility`}
                        />
                        
                        {!item.isHome && (
                          <button
                            type="button"
                            onClick={() => actions.confirmDelete(item._id, item.category?.name || "this item")}
                            disabled={loading.mutating}
                            aria-label="ডিলিট করুন"
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="কোনো মেনু নেই" description={`${pos.label}-এ এখনো কোনো ক্যাটাগরি যোগ করা হয়নি।`} />
              )}
            </section>
          );
        })}
      </div>

      {confirmModal.isOpen && (
        <ConfirmModal
          isOpen
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={actions.closeConfirmModal}
        />
      )}
    </div>
  );
};

export default NavbarManager;