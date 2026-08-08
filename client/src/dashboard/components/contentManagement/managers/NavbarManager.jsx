import { useState, useMemo, Fragment } from "react";
import { Plus, ChevronUp, ChevronDown, Trash2, Pencil, Check, X, GripVertical } from "lucide-react";

import { useNavbarManager } from "../../../../hooks/useNavbarManager";
import EmptyState from "../../../pages/WriterSectionManagement/components/EmptyState";
import ToggleSwitch from "../../ToggleSwitch";
import ConfirmModal from "../../../pages/WriterSectionManagement/modals/ConfirmModal";
import { ManagerErrorBanner, ManagerPageLoader } from "../../../pages/WriterSectionManagement/components/ManagerFeedback";

// 🆕 এখন শুধু Left Menu-ই সাপোর্টেড, তাই Right Menu অপশন বাদ দেওয়া হয়েছে
const POSITION = "left";

const NavbarManager = () => {
  const { menus, availableCategories, loading, error, confirmModal, actions } = useNavbarManager();

  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingHome, setEditingHome] = useState(null);
  const [homeTitle, setHomeTitle] = useState("");

  // 🆕 ড্র্যাগ-অ্যান্ড-ড্রপ রি-অর্ডারিং এর জন্য স্টেট
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null); // কোন item-এর উপর দিয়ে ড্র্যাগ হচ্ছে
  const [dropPosition, setDropPosition] = useState(null); // "above" | "below" — item-টার ঠিক কোন পাশে বসবে

  // 🆕 dragOverIndex + dropPosition থেকে হিসেব করা হচ্ছে item-টা মূল (sortedMenus)
  // array-এর কোন "ফাঁকা জায়গায়" গিয়ে বসবে — এটাই ইনসার্শন পয়েন্ট, কোনো item-কে
  // রিপ্লেস করা হয় না
  const insertionIndex =
    draggedIndex !== null && dragOverIndex !== null
      ? dropPosition === "below"
        ? dragOverIndex + 1
        : dragOverIndex
      : null;

  const sortedMenus = useMemo(() => {
    return [...menus].sort((a, b) => a.order - b.order);
  }, [menus]);

  const filteredCategoryOptions = useMemo(() => {
    return availableCategories.filter(
      (category) =>
        !menus.some(
          (menu) => menu.category?._id === category._id || menu.category === category._id
        )
    );
  }, [availableCategories, menus]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || loading.mutating) return;
    actions.addMenu(selectedCategory, POSITION);
    setSelectedCategory("");
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedMenus.length) return;
    const a = sortedMenus[index];
    const b = sortedMenus[targetIndex];
    actions.reorder([
      { _id: a._id, order: b.order },
      { _id: b._id, order: a.order },
    ]);
  };

  // 🆕 রি-অর্ডার করার লজিক: item-কে fromIndex থেকে সরিয়ে insertionIdx নির্দেশিত
  // "ফাঁকা জায়গায়" বসানো হয় (insertionIdx মূল sortedMenus array-এর ইনডেক্স হিসেবে
  // "এই ইনডেক্সের ঠিক আগে বসাও" বোঝায়)। মাঝে পড়া item গুলোর শুধু order value শিফট
  // হয় — কারো সাথে কারো সরাসরি অদল-বদল/রিপ্লেসমেন্ট হয় না।
  const applyReorder = (fromIndex, insertionIdx) => {
    if (loading.mutating || insertionIdx === null) return;

    // fromIndex বাদ দিলে insertionIdx-এর পরের item গুলো এক ঘর করে সামনে চলে আসে,
    // তাই সেই অনুযায়ী target index সমন্বয় করা হচ্ছে
    const targetIndex = fromIndex < insertionIdx ? insertionIdx - 1 : insertionIdx;

    const working = [...sortedMenus];
    const [moved] = working.splice(fromIndex, 1);
    working.splice(targetIndex, 0, moved);

    const updates = working.reduce((acc, item, i) => {
      const newOrder = sortedMenus[i].order;
      if (item.order !== newOrder) {
        acc.push({ _id: item._id, order: newOrder });
      }
      return acc;
    }, []);

    if (updates.length > 0) {
      actions.reorder(updates);
    }
  };

  const handleDragStart = (e, index) => {
    if (loading.mutating) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Firefox-এর জন্য ড্র্যাগ শুরু হতে data সেট করা জরুরি
    e.dataTransfer.setData("text/plain", String(index));
  };

  // 🆕 আইটেমের উপর মাউস/আঙুলের Y-পজিশন দেখে ঠিক করা হয় সেটা item-টার উপরের
  // ফাঁকা অংশে নাকি নিচের ফাঁকা অংশে ইনসার্ট হবে
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isBelowMidpoint = e.clientY > rect.top + rect.height / 2;

    setDragOverIndex(index);
    setDropPosition(isBelowMidpoint ? "below" : "above");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedIndex !== null && insertionIndex !== null) {
      applyReorder(draggedIndex, insertionIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  if (loading.initial) return <ManagerPageLoader message="নেভবার মেনু লোড হচ্ছে..." />;

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-3 sm:space-y-6 sm:p-4">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Navbar Manager</h2>
        <p className="mt-1 text-sm text-slate-500">
          সাইটের হেডার নেভিগেশনে কোন ক্যাটাগরি ও কোন অর্ডারে দেখাবে তা নিয়ন্ত্রণ করুন।
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
            {filteredCategoryOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
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

      {/* Menu list */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Left Menu</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {sortedMenus.length} item{sortedMenus.length !== 1 ? "s" : ""}
          </span>
        </div>

        {sortedMenus.length > 0 ? (
          <ul className="space-y-1.5">
            {sortedMenus.map((item, index) => (
              <Fragment key={item._id}>
                {/* 🆕 ইনসার্শন ইন্ডিকেটর লাইন: item-টা ঠিক এখানে "ফাঁকা জায়গায়" বসবে,
                    এর আশেপাশের কোনো item রিপ্লেস হবে না */}
                {insertionIndex === index && (
                  <li aria-hidden="true" className="h-1 rounded-full bg-blue-500" />
                )}

                <li
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  className={`flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-opacity ${
                    draggedIndex === index ? "opacity-40" : ""
                  }`}
                >
                  {/* 🆕 ড্র্যাগ হ্যান্ডেল: এখান থেকে ধরে টেনে item রি-অর্ডার করা যাবে */}
                  <button
                    type="button"
                    draggable={!loading.mutating}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    aria-label="টেনে নিয়ে ক্রম পরিবর্তন করুন"
                    className="cursor-grab touch-none rounded p-0.5 text-slate-400 hover:text-slate-700 active:cursor-grabbing disabled:opacity-30"
                    disabled={loading.mutating}
                  >
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0 || loading.mutating}
                      aria-label="উপরে সরান"
                      className="rounded p-0.5 text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === sortedMenus.length - 1 || loading.mutating}
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
                        {item.isHome ? item.title : item.category?.name || "Untitled category"}
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
                      label={`${item.isHome ? item.title : item.category?.name || "menu"} visibility`}
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
              </Fragment>
            ))}

            {/* 🆕 লিস্টের একদম শেষে ড্রপ করার জন্য ইনসার্শন ইন্ডিকেটর */}
            {insertionIndex === sortedMenus.length && (
              <li aria-hidden="true" className="h-1 rounded-full bg-blue-500" />
            )}
          </ul>
        ) : (
          <EmptyState title="কোনো মেনু নেই" description="Left Menu-এ এখনো কোনো ক্যাটাগরি যোগ করা হয়নি।" />
        )}
      </section>

      {confirmModal.isOpen && (
        <ConfirmModal
          open={confirmModal.isOpen}
          title="ডিলিট নিশ্চিত করুন"
          message={confirmModal.message}
          confirmText="ডিলিট করুন"
          cancelText="বাতিল"
          loading={loading.mutating}
          onConfirm={confirmModal.onConfirm}
          onClose={actions.closeConfirmModal}
        />
      )}
    </div>
  );
};

export default NavbarManager;
