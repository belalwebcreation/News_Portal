import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../news/services/newsService';
import { ConfirmDialog } from './ConfirmDialog';

const STATUS_TONE = {
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-700',
};

const PAGE_SIZE = 10;

// প্রতিটা status আলাদাভাবে fetch করার জন্য একটা বড় limit — writer নিজের
// draft/review লিস্ট সাধারণত এত বড় হয় না, তাই client-side pagination-এর
// জন্য একবারে সবটা এনে রাখলেই যথেষ্ট
const MERGE_FETCH_LIMIT = 200;

const DRAFT_STATUSES = ['draft', 'review'];

function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withGaps = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) withGaps.push(`gap-${p}`);
    withGaps.push(p);
    prev = p;
  }
  return withGaps;
}

function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const pageList = getPageList(page, pages);

  return (
    <nav className="mt-4 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors duration-200 hover:border-amber-900 hover:text-amber-900 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
      >
        ‹
      </button>

      {pageList.map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-2 text-slate-400">…</span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`min-w-[2.25rem] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              item === page
                ? 'border-amber-900 bg-amber-900 text-white'
                : 'border-slate-200 text-slate-600 hover:border-amber-900 hover:text-amber-900'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors duration-200 hover:border-amber-900 hover:text-amber-900 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
      >
        ›
      </button>
    </nav>
  );
}

// PUBLISHED tab — একটাই status, তাই backend-এর server-side pagination
// সরাসরি ব্যবহার করা হচ্ছে (আগের মতোই)। প্রতি page change-এ নতুন request যায়।
function useServerPagedSection(status, currentUserId) {
  const requestIdRef = useRef(0);
  const [state, setState] = useState({
    items: [],
    total: 0,
    pages: 1,
    page: 1,
    loading: true,
    error: null,
    loaded: false,
  });

  const load = useCallback(
    async (page = 1) => {
      if (!currentUserId) return;
      const requestId = ++requestIdRef.current;
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const response = await newsService.getAllNews({
          author: currentUserId,
          status,
          page,
          limit: PAGE_SIZE,
        });
        if (requestId !== requestIdRef.current) return;
        const items = Array.isArray(response) ? response : response?.data ?? [];
        const meta = response?.meta || {};
        setState({
          items,
          total: meta.total ?? items.length,
          pages: meta.pages ?? 1,
          page: meta.page ?? page,
          loading: false,
          error: null,
          loaded: true,
        });
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setState((s) => ({ ...s, loading: false, error: err.message || 'নিউজ লোড করা যায়নি।' }));
      }
    },
    [status, currentUserId]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, status]);

  const afterDelete = useCallback(() => {
    const isLastOnPage = state.items.length === 1 && state.page > 1;
    return load(isLastOnPage ? state.page - 1 : state.page);
  }, [load, state.items.length, state.page]);

  return { ...state, load, afterDelete };
}

// DRAFT tab — 'draft' আর 'review' দুটো status আলাদা request দিয়ে আনা হয়,
// frontend-এই merge + sort + client-side pagination করা হচ্ছে। এই approach-এ
// backend-এর comma-separated status support-এর ওপর কোনো নির্ভরতা নেই।
function useMergedSection(statuses, currentUserId) {
  const requestIdRef = useRef(0);
  const [state, setState] = useState({
    allItems: [],
    page: 1,
    loading: true,
    error: null,
    loaded: false,
  });

  const fetchAll = useCallback(async () => {
    if (!currentUserId) return;
    const requestId = ++requestIdRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const responses = await Promise.all(
        statuses.map((status) =>
          newsService.getAllNews({
            author: currentUserId,
            status,
            page: 1,
            limit: MERGE_FETCH_LIMIT,
          })
        )
      );
      if (requestId !== requestIdRef.current) return;

      const merged = responses.flatMap((response) =>
        Array.isArray(response) ? response : response?.data ?? []
      );
      merged.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
      );

      setState((s) => {
        const pages = Math.max(1, Math.ceil(merged.length / PAGE_SIZE));
        const clampedPage = Math.min(s.page, pages);
        return { allItems: merged, page: clampedPage, loading: false, error: null, loaded: true };
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setState((s) => ({ ...s, loading: false, error: err.message || 'নিউজ লোড করা যায়নি।' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, statuses]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const load = useCallback((page) => {
    setState((s) => ({ ...s, page }));
  }, []);

  const afterDelete = useCallback(() => fetchAll(), [fetchAll]);

  const total = state.allItems.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = state.allItems.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  return {
    items,
    total,
    pages,
    page: state.page,
    loading: state.loading,
    error: state.error,
    loaded: state.loaded,
    load,
    afterDelete,
  };
}

function ArticleList({ section, onEdit, onDelete, deletingId }) {
  if (section.loading && !section.loaded) return <p className="text-sm text-slate-500">Loading…</p>;
  if (section.error) return <p className="text-sm text-red-600">{section.error}</p>;
  if (section.items.length === 0) return <p className="text-sm text-slate-400">No articles here yet.</p>;

  return (
    <>
      <ul className="space-y-3">
        {section.items.map((article) => (
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
                onClick={() => onEdit(article)}
                className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-900 transition-colors duration-300 hover:bg-amber-900 hover:text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(article)}
                disabled={deletingId === article._id}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white disabled:opacity-50"
              >
                {deletingId === article._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={section.page} pages={section.pages} onChange={section.load} />
    </>
  );
}

export function ManageNews({ currentUserId }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('draft');

  const draftSection = useMergedSection(DRAFT_STATUSES, currentUserId);
  const publishedSection = useServerPagedSection('published', currentUserId);

  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const sections = { draft: draftSection, published: publishedSection };
  const activeSection = sections[activeTab];

  const sectionForStatus = (status) => (status === 'published' ? publishedSection : draftSection);

  const handleEdit = (article) => {
    navigate(`/dashboard/writer/add-news/editor?id=${article._id}`);
  };

  const handleDelete = (article) => {
    setDeleteError(null);
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
      await sectionForStatus(pendingDelete.status).afterDelete();
      setPendingDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleteError(err.message || 'ডিলিট করা যায়নি।');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-6 flex items-center justify-between gap-4">
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

      <div role="tablist" className="mb-6 flex gap-2 border-b border-slate-200">
        {[
          { key: 'draft', label: 'Draft News' },
          { key: 'published', label: 'Published News' },
        ].map((tab) => {
          const section = sections[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'border-amber-900 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {section.loaded ? section.total : '…'}
              </span>
            </button>
          );
        })}
      </div>

      <ArticleList section={activeSection} onEdit={handleEdit} onDelete={handleDelete} deletingId={deletingId} />

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