import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../news/services/newsService';
import { ConfirmDialog } from './ConfirmDialog';

const STATUS_TONE = {
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-700',
};

export function ManageNews({ currentUserId }) {
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null); // ✅ NEW — শুধু dialog-এর ভেতরে দেখানোর জন্য

  const loadArticles = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const response = await newsService.getAllNews({
        author: currentUserId,
        limit: 50,
      });
      if (requestId !== requestIdRef.current) return;
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setArticles(list);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || 'নিউজ লোড করা যায়নি।');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const handleEdit = (article) => {
    navigate(`/dashboard/writer/add-news/editor?id=${article._id}`);
  };

  const handleDelete = (article) => {
    setDeleteError(null); // নতুন target সেট করার সময় আগের error মুছে দাও
    setPendingDelete(article);
  };

  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteError(null);
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete._id);
    setDeleteError(null);
    try {
      await newsService.deleteNews(pendingDelete._id);
      setArticles((current) => current.filter((item) => item._id !== pendingDelete._id));
      setPendingDelete(null);
    } catch (err) {
      console.error('Delete failed:', err); // ✅ পুরো error object console-এ, debugging-এর জন্য
      setDeleteError(err.message || 'ডিলিট করা যায়নি।'); // ✅ dialog বন্ধ হবে না, error দেখাবে
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Manage News</h1>
          <p className="mt-1 text-slate-600">Edit or delete one of your articles below.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/writer/add-news')}
          className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-300 hover:border-amber-900 hover:text-amber-900"
        >
          ← Back
        </button>
      </header>

      {loading && <p className="text-slate-500">Loading your articles…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="text-slate-500">You haven&apos;t written any articles yet.</p>
      )}

      <ul className="space-y-3">
        {articles.map((article) => (
          <li
            key={article._id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{article.title}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_TONE[article.status] || STATUS_TONE.draft
                }`}
              >
                {article.status}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(article)}
                className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-900 transition-colors duration-300 hover:bg-amber-900 hover:text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article)}
                disabled={deletingId === article._id}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white disabled:opacity-50"
              >
                {deletingId === article._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!pendingDelete}
        title="আর্টিকেলটি ডিলিট করবেন?"
        description={pendingDelete ? `"${pendingDelete.title}" স্থায়ীভাবে মুছে যাবে। এই কাজটি আর ফিরিয়ে আনা যাবে না।` : ''}
        confirmLabel="Delete"
        loading={!!deletingId}
        errorMessage={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </main>
  );
}

export default ManageNews;