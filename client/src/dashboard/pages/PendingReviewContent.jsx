import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  ImageOff,
  Search,
  Eye,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { newsService } from "../../features/news/services/newsService";
import { categoryService } from "../../features/category/services/categoryService";
import Toast from "../pages/Toast";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const LIMIT = 10;

// ----------------------------------------------------------------------
// Small self-contained modal for Accept / Reject confirmation
// ----------------------------------------------------------------------
const ReviewActionModal = ({ mode, item, isLoading, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!item) return null;

  const isReject = mode === "reject";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-bold text-slate-900">
          {isReject ? "Reject this article?" : "Approve & publish this article?"}
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          "{item.title}" {isReject ? "will go back to Draft." : "will go live immediately."}
        </p>

        {isReject && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="লেখককে জানানোর জন্য কারণ লিখুন (optional)…"
            rows={3}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-700"
          />
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={isLoading}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-60 ${
              isReject ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? "Please wait…" : isReject ? "Reject" : "Approve & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Pending Review Component
// ----------------------------------------------------------------------
const PendingReviewContent = () => {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionModal, setActionModal] = useState({ mode: null, item: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getAllCategories()
      .then((res) => {
        if (cancelled) return;
        const catArray = Array.isArray(res) ? res : res?.data || res?.categories || [];
        setCategories(catArray);
      })
      .catch((err) => console.error("Failed to load categories:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await newsService.getAllNews({
        status: "review",
        page,
        limit: LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryId && { category: categoryId }),
      });
      setNewsList(res?.data || res?.news || []);
      setMeta(res?.meta || { total: res?.total || 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err.message || "লিস্ট লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleConfirmAction = async (reason) => {
    const { mode, item } = actionModal;
    if (!item) return;

    try {
      setActionLoading(true);

      if (mode === "approve") {
        await newsService.approveNews(item._id);
        setToast({ message: `✓ "${item.title}" published.`, type: "success" });
      } else {
        await newsService.rejectNews(item._id, reason);
        setToast({ message: `"${item.title}" sent back to draft.`, type: "success" });
      }

      setNewsList((prev) => prev.filter((n) => n._id !== item._id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      setToast({ message: err.message || "Action failed.", type: "error" });
    } finally {
      setActionLoading(false);
      setActionModal({ mode: null, item: null });
    }
  };

  const startRange = meta.total === 0 ? 0 : (meta.page - 1) * LIMIT + 1;
  const endRange = Math.min(meta.page * LIMIT, meta.total);

  return (
    <div className="space-y-6 pb-12">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <ReviewActionModal
        mode={actionModal.mode}
        item={actionModal.item}
        isLoading={actionLoading}
        onClose={() => setActionModal({ mode: null, item: null })}
        onConfirm={handleConfirmAction}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck size={20} className="text-amber-700" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Pending Review
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Writer-দের জমা দেওয়া আর্টিকেল যেগুলো Approve/Reject-এর অপেক্ষায় আছে।
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by article title..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-52 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Thumbnail</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
                      <span>Loading pending review...</span>
                    </div>
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium">
                    কোনো আর্টিকেল এখন Review-এর অপেক্ষায় নেই।
                  </td>
                </tr>
              ) : (
                newsList.map((item, index) => (
                  <tr
                    key={item._id}
                    className="group border-b border-slate-100/80 hover:bg-amber-50/40 transition-all duration-150"
                  >
                    <td className="px-5 py-3.5 text-slate-400 font-medium">
                      {(meta.page - 1) * LIMIT + index + 1}
                    </td>

                    <td className="px-5 py-3.5">
                      {item.thumbnail?.media?.url || item.thumbnail?.url ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm w-11 h-11">
                          <img
                            src={item.thumbnail?.media?.url || item.thumbnail?.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {item.author?.name || "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200">
                        {item.category?.name || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          
  href={`/news/${item.category?.slug || "uncategorized"}/${item.slug || item._id}`}
  target="_blank"
  rel="noreferrer"
  title="Preview"
  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
>
                          <Eye size={16} />
                        </a>

                        <Link
                          to={`/dashboard/writer/add-news/editor?id=${item._id}`}
                          title="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50"
                        >
                          <Edit3 size={16} />
                        </Link>

                        <button
                          type="button"
                          title="Approve"
                          onClick={() => setActionModal({ mode: "approve", item })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          title="Reject"
                          onClick={() => setActionModal({ mode: "reject", item })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{startRange}–{endRange}</span> of{" "}
            <span className="font-bold text-slate-800">{meta.total}</span> results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs font-bold rounded-xl bg-amber-600 text-white">
              {meta.page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              disabled={meta.page >= meta.pages}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReviewContent;