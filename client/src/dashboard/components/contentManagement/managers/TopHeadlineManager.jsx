import { useEffect, useMemo, useState } from "react";
import {
  Save,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Loader2,
  Inbox,
} from "lucide-react";

import {
  getTopHeadline,
  updateTopHeadline,
  addHeadline,
  deleteHeadline,
  toggleHeadlineVisibility,
} from "../../../../services/topHeadlineService";

const emptyHeadline = {
  label: "",
  date: "",
  speed: 40,
  items: [],
};

// `onSaved` is optional — pass it in if this component is rendered inside
// a modal/popup and you want that popup to close itself after a
// successful save, e.g. <TopHeadlineManager onSaved={() => setOpen(false)} />
const TopHeadlineManager = ({ onSaved } = {}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null); // item currently being deleted/toggled

  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [speed, setSpeed] = useState(40);
  const [items, setItems] = useState([]);
  const [initial, setInitial] = useState(emptyHeadline); // last-synced snapshot, used for dirty check

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  /*
  ------------------------------------------
  Load Headline
  ------------------------------------------
  */

  const fetchHeadline = async () => {
    try {
      setLoading(true);
      setError("");

      const { headline } = await getTopHeadline();

      const nextLabel = headline.label || "";
      const nextDate = headline.date || "";
      const nextSpeed = headline.speed ?? 40;
      const nextItems = headline.items || [];

      setLabel(nextLabel);
      setDate(nextDate);
      setSpeed(nextSpeed);
    
      setItems(nextItems);

      setInitial({
        label: nextLabel,
        date: nextDate,
        speed: nextSpeed,
        items: nextItems,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load Top Headline."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadline();
  }, []);

  // Auto-dismiss transient banners so they don't sit on screen forever
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!actionError) return;
    const timer = setTimeout(() => setActionError(""), 4000);
    return () => clearTimeout(timer);
  }, [actionError]);

  // Tracks whether label/date/speed/items differ from the last saved snapshot
  const isDirty = useMemo(() => {
    return (
      label !== initial.label ||
      date !== initial.date ||
      speed !== initial.speed ||
      JSON.stringify(items) !== JSON.stringify(initial.items)
    );
  }, [label, date, speed, items, initial]);

  /*
  ------------------------------------------
  Update Local Item
  ------------------------------------------
  */

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  /*
  ------------------------------------------
  Delete Headline
  ------------------------------------------
  */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this headline? This cannot be undone.")) {
      return;
    }

    const snapshot = items;
    setBusyId(id);
    setActionError("");
    setItems((prev) => prev.filter((item) => item._id !== id)); // optimistic

    try {
      await deleteHeadline(id);
    } catch (err) {
      setItems(snapshot); // rollback on failure
      setActionError(
        err.response?.data?.message || "Failed to delete headline."
      );
    } finally {
      setBusyId(null);
    }
  };

  /*
  ------------------------------------------
  Toggle Visibility
  ------------------------------------------
  */

  const handleToggle = async (id) => {
    const snapshot = items;
    setBusyId(id);
    setActionError("");
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, visible: !item.visible } : item
      )
    ); // optimistic

    try {
      await toggleHeadlineVisibility(id);
    } catch (err) {
      setItems(snapshot); // rollback on failure
      setActionError(
        err.response?.data?.message || "Failed to update visibility."
      );
    } finally {
      setBusyId(null);
    }
  };

  /*
  ------------------------------------------
  Add Headline
  ------------------------------------------
  */

 /*
------------------------------------------
Add Headline
------------------------------------------
*/

const handleAdd = async () => {
  try {
    await addHeadline({
      title: "New Headline",
      slug: "/news/new-headline",
      visible: true,
    });

    fetchHeadline();
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to add headline."
    );
  }
};

  /*
  ------------------------------------------
  Save All Changes
  ------------------------------------------
  */

  const handleSave = async () => {
    const trimmedLabel = label.trim();
    const invalidItem = items.find(
      (item) => !item.title?.trim() || !item.slug?.trim()
    );

    if (!trimmedLabel) {
      setError("Label cannot be empty.");
      return;
    }

    if (invalidItem) {
      setError("Every headline needs both a title and a link.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        label: trimmedLabel,
        date,
        speed,
        items: items.map((item) => ({
          ...item,
          title: item.title.trim(),
          slug: item.slug.trim(),
        })),
      };

      await updateTopHeadline(payload);

      setLabel(payload.label);
      setItems(payload.items);
      setInitial({
        label: payload.label,
        date,
        speed,
        items: payload.items,
      });
      setSuccess("Top Headline updated successfully.");

      // Let the success message flash briefly before the parent
      // (e.g. a popup/modal) closes itself.
      if (onSaved) {
        setTimeout(() => onSaved(), 700);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    fetchHeadline();
  };

  /*
  ------------------------------------------
  Loading Screen
  ------------------------------------------
  */

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 size={40} className="animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800">
          Top Headline Manager
        </h2>
        <p className="mt-2 text-slate-500">Manage scrolling headlines.</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
          {success}
        </div>
      )}

      {actionError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
          {actionError}
        </div>
      )}

      {/* General Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-xl font-bold">General Settings</h3>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div>
            <label
              htmlFor="headline-label"
              className="block mb-2 font-semibold"
            >
              Label
            </label>
            <input
              id="headline-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label
              htmlFor="headline-date"
              className="block mb-2 font-semibold"
            >
              Date
            </label>
            <input
              id="headline-date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label
              htmlFor="headline-speed"
              className="block mb-2 font-semibold"
            >
              Scroll Speed
            </label>

            <input
              id="headline-speed"
              type="number"
              min="10"
              max="200"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            />

            <p className="mt-2 text-sm text-slate-500">
              Lower = Faster • Higher = Slower
            </p>
          </div>
        </div>
      </div>

      {/* Headlines */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Inbox size={32} className="mx-auto text-slate-400" />
            <p className="mt-3 text-slate-500">
              No headlines yet. Add your first one below.
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Headline {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={busyId === item._id}
                  aria-label={`Delete headline ${index + 1}`}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busyId === item._id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label
                  htmlFor={`title-${item._id}`}
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Headline Title
                </label>
                <input
                  id={`title-${item._id}`}
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updateItem(item._id, "title", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                />
              </div>

              {/* Link */}
              <div className="mb-5">
                <label
                  htmlFor={`slug-${item._id}`}
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  News Link
                </label>
                <input
                  id={`slug-${item._id}`}
                  type="text"
                  value={item.slug}
                  onChange={(e) =>
                    updateItem(item._id, "slug", e.target.value)
                  }
                  placeholder="/news/example-news"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-5">
                <div>
                  <h4 className="font-semibold text-slate-800">Visibility</h4>
                  <p className="text-sm text-slate-500">
                    Show or hide this headline.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(item._id)}
                  disabled={busyId === item._id}
                  className={`h-11 px-6 rounded-xl text-white flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    item.visible
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {busyId === item._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : item.visible ? (
                    <>
                      <Eye size={18} />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} />
                      Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Add */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          Add Headline
        </button>

        {/* Right Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="h-12 px-6 rounded-xl border border-slate-300 hover:bg-slate-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={`h-12 px-8 rounded-xl text-white flex items-center gap-2 transition ${
              saving || !isDirty
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeadlineManager;
