import { AlertCircle, CheckCircle2, Filter, Inbox, Layers, Loader2, Plus, RefreshCw, Search, Tags, X } from 'lucide-react';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './modals/CategoryModal';
import CategoryTable from './components/CategoryTable';
import DeleteCategoryModal from './modals/DeleteCategoryModal';
import { useCategoryManager } from './hooks/useCategoryManager';

function EmptyState({ hasFilters, onAdd, onClearFilters }) {
  return (
    <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-5 py-14 text-center sm:px-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-base-100 text-base-content/30 shadow-sm">
        <Inbox aria-hidden="true" size={22} />
      </div>
      <h2 className="mt-4 text-sm font-bold text-base-content">
        {hasFilters ? 'কোনো ফলাফল পাওয়া যায়নি' : 'এখনও কোনো ক্যাটাগরি নেই'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-base-content/50">
        {hasFilters
          ? 'সার্চ শব্দ অথবা স্ট্যাটাস ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
          : 'প্রথম ক্যাটাগরি যোগ করে পোর্টালের নেভিগেশন ও নিউজ ফিল্টার সাজানো শুরু করুন।'}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        {hasFilters ? (
          <button
            className="rounded-xl border border-base-300 px-4 py-2.5 text-xs font-bold text-base-content/80 transition hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
            onClick={onClearFilters}
            type="button"
          >
            ফিল্টার পরিষ্কার করুন
          </button>
        ) : (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-content shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onAdd}
            type="button"
          >
            <Plus aria-hidden="true" size={15} /> নতুন ক্যাটাগরি
          </button>
        )}
      </div>
    </div>
  );
}

export default function CategoryManagement() {
  const {
    categories,
    totalCount,
    activeCount,

    isFetching,
    isMutating,

    error,
    modalError,

    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,

    sortConfig,
    toggleSort,

    editor,
    deleteTarget,

    openCreateModal,
    openEditModal,
    closeEditor,

    openDeleteModal,
    closeDeleteModal,

    saveCategory,
    confirmDelete,

    refreshCategories,
    clearError,
  } = useCategoryManager();

  const hasFilters = Boolean(searchTerm.trim()) || statusFilter !== 'all';
  const initialLoading = isFetching && totalCount === 0;

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <main className="min-h-screen bg-base-200/40 p-4 text-base-content antialiased sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-base-300/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="hidden shrink-0 rounded-2xl bg-primary/10 p-3 text-primary shadow-sm shadow-primary/20 sm:flex">
              <Tags aria-hidden="true" size={22} />
            </div>
            <div>
              <p className="font-meta text-xs font-bold uppercase tracking-[0.18em] text-primary">Content settings</p>
              <h1 className="font-display mt-1 text-2xl font-black tracking-tight text-base-content sm:text-3xl">
                ক্যাটাগরি কন্ট্রোল সেন্টার
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-base-content/60">
                পোর্টালের মেনুবার ও নিউজ ফিল্টারিংয়ের ক্যাটাগরি কনফিগার করুন।
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              aria-label="ক্যাটাগরি তালিকা রিফ্রেশ করুন"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3.5 py-2.5 text-xs font-bold text-base-content/80 transition hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFetching || isMutating}
              onClick={() => refreshCategories().catch(() => undefined)}
              type="button"
            >
              <RefreshCw aria-hidden="true" className={isFetching ? 'animate-spin' : ''} size={15} /> রিফ্রেশ
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-content shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isMutating}
              onClick={openCreateModal}
              type="button"
            >
              <Plus aria-hidden="true" size={16} /> নতুন ক্যাটাগরি
            </button>
          </div>
        </header>

        <section aria-label="ক্যাটাগরি সারাংশ" className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="group rounded-2xl border border-base-300/60 bg-base-100 px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-base-200 text-base-content/50 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Layers aria-hidden="true" size={14} />
              </span>
              <p className="font-meta text-[11px] font-semibold uppercase tracking-wide text-base-content/50">সর্বমোট</p>
            </div>
            <p className="mt-1.5 text-xl font-black text-base-content">{totalCount}</p>
          </div>
          <div className="group rounded-2xl border border-base-300/60 bg-base-100 px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success">
                <CheckCircle2 aria-hidden="true" size={14} />
              </span>
              <p className="font-meta text-[11px] font-semibold uppercase tracking-wide text-base-content/50">সক্রিয়</p>
            </div>
            <p className="mt-1.5 text-xl font-black text-success">{activeCount}</p>
          </div>
        </section>

        <section
          aria-label="সার্চ ও ফিল্টার"
          className="mt-6 rounded-2xl border border-base-300/60 bg-base-100/70 p-3 shadow-sm backdrop-blur-xl sm:p-4"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
              <input
                aria-label="ক্যাটাগরি সার্চ"
                className="w-full rounded-xl border border-base-300 bg-base-100 py-2.5 pl-10 pr-10 text-sm text-base-content placeholder:text-base-content/40 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ক্যাটাগরি নাম বা স্লাগ লিখে খুঁজুন..."
                type="search"
                value={searchTerm}
              />
              {searchTerm && (
                <button
                  aria-label="সার্চ মুছুন"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-base-content/40 transition hover:bg-base-200 hover:text-base-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40"
                  onClick={() => setSearchTerm('')}
                  type="button"
                >
                  <X aria-hidden="true" size={15} />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={15} />
              <label className="sr-only" htmlFor="category-status-filter">ক্যাটাগরি স্ট্যাটাস ফিল্টার</label>
              <select
                className="w-full cursor-pointer appearance-none rounded-xl border border-base-300 bg-base-100 py-2.5 pl-10 pr-4 text-sm text-base-content/80 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="category-status-filter"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="active">সক্রিয়</option>
                <option value="inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div
            className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-error/20 bg-error/10 p-3.5 text-xs leading-5 text-error animate-fadeIn"
            role="alert"
          >
            <span className="flex gap-2">
              <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
              {error}
            </span>
            <button
              aria-label="ত্রুটির বার্তা বন্ধ করুন"
              className="rounded p-0.5 text-error/70 transition hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-error/40"
              onClick={clearError}
              type="button"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        )}

        <section aria-live="polite" className="mt-6">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-base-300/60 bg-base-100/70 py-20 text-base-content/50 backdrop-blur-xl">
              <Loader2 aria-hidden="true" className="animate-spin text-primary" size={30} />
              <p className="text-xs">ক্যাটাগরি লোড হচ্ছে...</p>
            </div>
          ) : categories.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onAdd={openCreateModal} onClearFilters={resetFilters} />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between text-xs text-base-content/50">
                <p>{categories.length}টি ক্যাটাগরি দেখানো হচ্ছে</p>
                {isFetching && (
                  <p className="inline-flex items-center gap-1.5 text-primary">
                    <Loader2 aria-hidden="true" className="animate-spin" size={13} /> সিঙ্ক হচ্ছে...
                  </p>
                )}
              </div>
              <div className="hidden overflow-hidden rounded-2xl border border-base-300/60 bg-base-100 shadow-sm lg:block">
                <CategoryTable
                  categories={categories}
                  disabled={isMutating}
                  onDelete={openDeleteModal}
                  onEdit={openEditModal}
                  sortConfig={sortConfig}
                  onSort={toggleSort}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {categories.map((category) => (
                  <CategoryCard category={category} disabled={isMutating} key={category._id} onDelete={openDeleteModal} onEdit={openEditModal} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ক্রিয়েট / আপডেট মোডাল */}
      {editor.isOpen && (
        <CategoryModal
          data={editor.data}
          error={modalError}
          loading={isMutating}
          mode={editor.mode}
          onClose={closeEditor}
          onSave={saveCategory}
        />
      )}

      {/* ডিলিট কনফার্মেশন মোডাল */}
      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          error={modalError}
          loading={isMutating}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}