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

import TopHeadlineImage from "./TopHeadlineImage";
import ConfirmModal from "../../../../dashboard/pages/ConfirmModal";

import {
  getTopHeadline,
  updateTopHeadline,
  addHeadline,
  deleteHeadline,
  toggleHeadlineVisibility,
} from "../../../../services/topHeadlineService";

const TopHeadlineManager = ({
  onSaved,
  onClose,               // 🆕 CMSModal close korar function (ContentManagement.jsx theke ashe)
  maxHeadlines = 3,
  autoCloseDelay = 900,   // 🆕 success dekhanor por koto ms por action complete hobe
} = {}) => {
  // -----------------------------------------
  // Loading States
  // -----------------------------------------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // -----------------------------------------
  // Headlines
  // -----------------------------------------
  const [items, setItems] = useState([]);
  const [initialItems, setInitialItems] = useState([]);

  // -----------------------------------------
  // Messages
  // -----------------------------------------
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // -----------------------------------------
  // 🆕 Modal states (window.confirm replace + success confirm modal)
  // -----------------------------------------
  const [successInfo, setSuccessInfo] = useState(null);          // { title, message } | null
  const [pendingDeleteId, setPendingDeleteId] = useState(null);  // delete confirm-e ase headline _id
  const [pendingCancel, setPendingCancel] = useState(false);     // discard-changes confirm

  /*
  ==========================================
  Load Headlines
  ==========================================
  */
  const fetchHeadline = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getTopHeadline();
      const headline = res.headline || {};

      const nextItems = (headline.items || []).map((item) => ({
        ...item,
        image: item.image || "",
        imagePublicId: item.imagePublicId || "",
        visible: item.visible ?? true,
      }));

      setItems(nextItems);
      setInitialItems(nextItems);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load Top Headlines."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadline();
  }, []);

  /*
  ==========================================
  Auto Hide Alerts
  ==========================================
  */
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

  /*
  ==========================================
  Dirty Checker
  ==========================================
  */
  const isDirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(initialItems),
    [items, initialItems]
  );

  const limitReached = items.length >= maxHeadlines;

  /*
  ==========================================
  Update Local Item
  ==========================================
  */
  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      )
    );
  };

  /*
  ==========================================
  Image Uploaded (Cloudinary)
  ==========================================
  */
  const handleImageUploaded = (id, imageUrl, publicId) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, image: imageUrl, imagePublicId: publicId }
          : item
      )
    );
  };

  /*
  ==========================================
  Image Deleted
  ==========================================
  */
  const handleImageDeleted = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, image: "", imagePublicId: "" } : item
      )
    );
  };

  /*
  ==========================================
  Add Headline
  ==========================================
  */
  const handleAdd = async () => {
    if (limitReached) {
      setActionError(`You can add up to ${maxHeadlines} headlines only.`);
      return;
    }

    try {
      setAdding(true);

      await addHeadline({
        title: "New Headline",
        slug: "/news/new-headline",
        image: "",
        imagePublicId: "",
        visible: true,
      });

      await fetchHeadline();
      setSuccess("Headline added successfully.");
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to add headline."
      );
    } finally {
      setAdding(false);
    }
  };

  /*
  ==========================================
  Delete Headline
  ==========================================
  */
  // Delete button -> ekhon shudhu confirm modal khulbe (window.confirm noy)
  const requestDelete = (id) => setPendingDeleteId(id);

  // Asol delete logic — ConfirmModal-e "Confirm" chaple cholbe
  const handleDelete = async () => {
    const id = pendingDeleteId;
    if (!id) return;

    try {
      setBusyId(id);

      await deleteHeadline(id);

      setItems((prev) => prev.filter((item) => item._id !== id));
      setInitialItems((prev) => prev.filter((item) => item._id !== id));

      setSuccess("Headline deleted successfully.");
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to delete headline."
      );
    } finally {
      setBusyId(null);
      setPendingDeleteId(null);
    }
  };

  /*
  ==========================================
  Toggle Visibility
  ==========================================
  */
  const handleToggle = async (id) => {
    try {
      setBusyId(id);

      await toggleHeadlineVisibility(id);

      const next = items.map((item) =>
        item._id === id ? { ...item, visible: !item.visible } : item
      );

      setItems(next);

      // 🆕 toggle already server-e persisted, tai initialItems-eo sync korlam —
      // na hole "Unsaved changes" pill vul kore theke jeto
      setInitialItems(next);

      setSuccessInfo({
        title: "Updated",
        message: "Visibility updated successfully.",
      });

      setTimeout(() => setSuccessInfo(null), autoCloseDelay);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to update visibility."
      );
    } finally {
      setBusyId(null);
    }
  };

  /*
  ==========================================
  Save All Changes
  ==========================================
  */
  const handleSave = async () => {
    const invalidItem = items.find(
      (item) => !item.title?.trim() || !item.slug?.trim()
    );

    if (invalidItem) {
      setError("Every headline must have both a title and a news link.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        items: items.map((item) => ({
          _id: item._id,
          title: item.title.trim(),
          slug: item.slug.trim(),
          image: item.image || "",
          imagePublicId: item.imagePublicId || "",
          visible: item.visible,
        })),
      };

      await updateTopHeadline(payload);

      setInitialItems(payload.items);

      setSuccessInfo({
        title: "Saved",
        message: "Top Headlines updated successfully.",
      });

      // 🆕 success dekhano hoye gele CMSModal auto-close
      setTimeout(() => {
        setSuccessInfo(null);
        onSaved?.();
        onClose?.();
      }, autoCloseDelay);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  /*
  ==========================================
  Cancel Changes
  ==========================================
  */
  const requestCancel = () => {
    if (!isDirty) {
      fetchHeadline();
      return;
    }
    setPendingCancel(true);
  };

  const handleCancel = () => {
    setPendingCancel(false);
    fetchHeadline();
  };

  /*
  ==========================================
  Loading Screen
  ==========================================
  */
  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={38} className="animate-spin text-amber-700" />
        <p className="text-sm font-medium">Loading top headlines...</p>
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
        <p className="mt-2 text-slate-500">
          Manage the headlines, links and images shown at the top of your site.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
        >
          {success}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600"
        >
          {actionError}
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-800">Headlines</h3>
          <span className="inline-flex h-6 min-w-fit items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-bold text-amber-800">
            {items.length}/{maxHeadlines}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || limitReached}
            title={limitReached ? `Maximum of ${maxHeadlines} headlines reached` : undefined}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={17} />
                Add Headline
              </>
            )}
          </button>

          {limitReached && (
            <p className="text-xs text-slate-400">
              Maximum of {maxHeadlines} reached — delete one to add another.
            </p>
          )}
        </div>
      </div>

      {/* Headlines List */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-14 text-center">
            <Inbox size={34} className="mx-auto text-slate-400" />
            <p className="mt-4 font-medium text-slate-600">No headlines yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Add your first headline to feature it on the site.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || limitReached}
              className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
            >
              <Plus size={17} />
              Add Headline
            </button>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-sm font-bold text-amber-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="truncate text-lg font-bold text-slate-800">
                    {item.title?.trim() || "Untitled headline"}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => requestDelete(item._id)}
                  disabled={busyId === item._id}
                  aria-label="Delete headline"
                  className="shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  {busyId === item._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

              {/* Cloudinary Image */}
              <div className="mb-6">
                <TopHeadlineImage
                  headlineId={item._id}
                  image={item.image}
                  publicId={item.imagePublicId}
                  onUpload={({ image, imagePublicId }) =>
                    handleImageUploaded(item._id, image, imagePublicId)
                  }
                  onDelete={() => handleImageDeleted(item._id)}
                />
              </div>

              {/* Title + Link */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item._id, "title", e.target.value)}
                    placeholder="e.g. PM announces new education policy"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    News Link
                  </label>
                  <input
                    type="text"
                    value={item.slug}
                    onChange={(e) => updateItem(item._id, "slug", e.target.value)}
                    placeholder="/news/article-slug"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <p className="mt-2 text-sm text-slate-400">
                    Where this headline links to on your site.
                  </p>
                </div>
              </div>

              {/* Visibility */}
              <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 p-5">
                <div>
                  <h4 className="font-semibold text-slate-800">Visibility</h4>
                  <p className="text-sm text-slate-500">
                    Show or hide this headline on the site.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(item._id)}
                  disabled={busyId === item._id}
                  className={`h-11 px-6 rounded-xl text-white flex items-center gap-2 transition disabled:opacity-50 ${
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

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {isDirty && (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={requestCancel}
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

      {/* Delete confirm modal (age window.confirm chilo) */}
      <ConfirmModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
        type="delete"
        title="Delete Headline"
        message="আপনি কি নিশ্চিত এই headline টি delete করতে চান? এই action ফেরানো যাবে না।"
        isLoading={busyId === pendingDeleteId}
      />

      {/* Discard changes confirm modal (age window.confirm chilo) */}
      <ConfirmModal
        isOpen={pendingCancel}
        onClose={() => setPendingCancel(false)}
        onConfirm={handleCancel}
        type="default"
        title="Discard Changes"
        message="আপনার unsaved changes আছে। আপনি কি সেগুলো discard করতে চান?"
      />

      {/* Success confirm modal (toggle visibility + save changes) */}
      <ConfirmModal
        isOpen={!!successInfo}
        onClose={() => setSuccessInfo(null)}
        type="success"
        hideCancel
        confirmText="OK"
        title={successInfo?.title}
        message={successInfo?.message}
      />
    </div>
  );
};

export default TopHeadlineManager;