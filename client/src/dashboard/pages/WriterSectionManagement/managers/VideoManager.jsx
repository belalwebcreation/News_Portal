import { memo, useCallback, useMemo, useState } from "react";
import {
  Edit3,
  Film,
  Layers,
  Loader2,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Tv,
  X,
} from "lucide-react";

import { videoSectionData } from "../../../../data/videoSectionData";
import { useSectionManager } from "../hooks/useSectionManager";
import { useWriterSectionManager } from "../hooks/useWriterSectionManager";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { ManagerErrorBanner, ManagerPageLoader } from "../components/ManagerFeedback";

const EMPTY_VIDEO_FORM = {
  title: "",
  description: "",
  category: "",
  duration: "",
  thumbnail: "",
};

const VideoEditorModal = memo(({ isOpen, mode, formData, topics, isSaving, onChange, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && !isSaving && onClose()}
    >
      <section
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-editor-title"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
          <h2 id="video-editor-title" className="text-xs font-black uppercase tracking-wider text-white">
            {mode === "edit" ? "ভিডিও কন্টেন্ট সম্পাদনা" : "নতুন ভিডিও যোগ করুন"}
          </h2>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="text-slate-400 hover:text-white disabled:opacity-40"
            aria-label="ভিডিও এডিটর বন্ধ করুন"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4 text-xs">
          <label className="block space-y-1">
            <span className="font-bold text-slate-400">শিরোনাম</span>
            <input
              required
              autoFocus
              value={formData.title}
              onChange={(event) => onChange("title", event.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-2.5 py-2 text-slate-100 outline-none transition focus:border-red-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-400">সংক্ষিপ্ত বিবরণ</span>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(event) => onChange("description", event.target.value)}
              className="w-full resize-none rounded-md border border-slate-800 bg-slate-950 px-2.5 py-2 text-slate-100 outline-none transition focus:border-red-500"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="font-bold text-slate-400">নিউজ ক্যাটাগরি</span>
              <select
                required
                value={formData.category}
                onChange={(event) => onChange("category", event.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-2 text-slate-100 outline-none focus:border-red-500"
              >
                <option value="" disabled>ক্যাটাগরি বাছুন</option>
                {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-400">ভিডিওর দৈর্ঘ্য</span>
              <input
                required
                inputMode="text"
                placeholder="যেমন 03:45"
                value={formData.duration}
                onChange={(event) => onChange("duration", event.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-2 text-center font-mono text-slate-100 outline-none transition focus:border-red-500"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="font-bold text-slate-400">থাম্বনেইল URL</span>
            <input
              required
              type="url"
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={(event) => onChange("thumbnail", event.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-2.5 py-2 font-mono text-slate-100 outline-none transition focus:border-red-500"
            />
          </label>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:justify-end">
            <button type="button" disabled={isSaving} onClick={onClose} className="rounded-md bg-slate-800 px-3 py-2 font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50">
              বাতিল
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 font-bold text-white hover:bg-red-500 disabled:opacity-50">
              {isSaving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
});

VideoEditorModal.displayName = "VideoEditorModal";

const VideoManager = memo(() => {
  const rawManager = useSectionManager("video");
  const { layout, pool: videoPool, loading, error, modal, formData, actions } = useWriterSectionManager(rawManager, "video");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [pendingDeletion, setPendingDeletion] = useState(null);

  const topics = useMemo(
    () => (videoSectionData?.topics ?? []).filter((topic) => topic.id !== "all"),
    []
  );
  const safeFormData = useMemo(() => ({ ...EMPTY_VIDEO_FORM, ...formData }), [formData]);
  const sliderIds = layout.sliderVideoIds ?? [];
  const featuredVideo = layout.featuredVideoId ? videoPool[layout.featuredVideoId] : null;
  const pendingVideo = pendingDeletion ? videoPool[pendingDeletion] : null;

  const visibleVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const videos = Object.values(videoPool).filter((video) => {
      if (!video) return false;
      const matchesCategory = category === "all" || video.category === category;
      const searchable = `${video.title ?? ""} ${video.description ?? ""} ${video.category ?? ""}`.toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    return videos.sort((a, b) => {
      if (sortBy === "category") return String(a.category).localeCompare(String(b.category));
      return String(a.title).localeCompare(String(b.title), "bn");
    });
  }, [videoPool, category, query, sortBy]);

  const changeField = useCallback((field, value) => {
    actions.setFormData?.((current) => ({ ...current, [field]: value }));
  }, [actions]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeletion || !actions.deleteItem) return;
    await actions.deleteItem(pendingDeletion);
    setPendingDeletion(null);
  }, [actions, pendingDeletion]);

  if (loading.initial) return <ManagerPageLoader message="ভিডিও ডাটাবেজ লোড হচ্ছে..." />;

  return (
    <div className="space-y-5 text-slate-100 sm:space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-white">
            <Film className="text-red-500" size={22} aria-hidden="true" /> ভিডিও গ্যালারি স্লট ও পুল
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">একই Section Manager contract দিয়ে ভিডিও, স্লট এবং মডাল নিয়ন্ত্রণ করা হচ্ছে।</p>
        </div>
        <button
          type="button"
          onClick={() => actions.openModal?.("create")}
          disabled={loading.mutating}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} aria-hidden="true" /> নতুন ভিডিও যোগ করুন
        </button>
      </header>

      <ManagerErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
        <aside className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-md sm:p-5 xl:col-span-1">
          <div className="border-b border-slate-800 pb-2.5">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white"><Layers size={14} className="text-red-400" /> স্লট কন্ট্রোল</h3>
          </div>

          <section className="space-y-2" aria-labelledby="featured-slot-heading">
            <h4 id="featured-slot-heading" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Tv size={13} className="text-blue-400" /> প্রধান ভিডিও</h4>
            {featuredVideo ? (
              <article className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-slate-950/40 p-3">
                <img src={featuredVideo.thumbnail} className="aspect-video w-16 rounded bg-slate-800 object-cover" alt="" />
                <div className="min-w-0">
                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-400">Featured</span>
                  <h5 className="mt-1 truncate text-xs font-bold text-white">{featuredVideo.title}</h5>
                </div>
              </article>
            ) : <p className="rounded-lg border border-dashed border-slate-800 bg-slate-950/20 p-4 text-center text-xs text-slate-500">কোনো প্রধান ভিডিও সিলেক্ট করা নেই</p>}
          </section>

          <section className="space-y-2" aria-labelledby="slider-slot-heading">
            <h4 id="slider-slot-heading" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Film size={13} className="text-emerald-400" /> স্লাইডার ({sliderIds.length}টি)</h4>
            {sliderIds.length > 0 ? (
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {sliderIds.map((id, index) => {
                  const video = videoPool[id];
                  if (!video) return null;
                  return (
                    <article key={id} className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/30 p-2">
                      <span className="w-4 text-center font-mono text-[10px] font-bold text-slate-600">{index + 1}</span>
                      <img src={video.thumbnail} className="aspect-video w-12 rounded bg-slate-800 object-cover" alt="" />
                      <h5 className="min-w-0 flex-1 truncate text-xs font-bold text-slate-300">{video.title}</h5>
                      <button type="button" onClick={() => actions.updateLayout?.("TOGGLE_SLIDER", { id })} disabled={loading.layout} className="rounded p-1 text-slate-500 hover:text-red-400 disabled:opacity-40" aria-label={`${video.title} স্লাইডার থেকে সরান`}>
                        <X size={14} />
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : <p className="rounded-lg border border-dashed border-slate-800 bg-slate-950/20 p-4 text-center text-xs text-slate-500">স্লাইডারে কোনো ভিডিও নেই</p>}
          </section>
        </aside>

        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md xl:col-span-2" aria-labelledby="video-pool-heading">
          <div className="space-y-3 border-b border-slate-800 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 id="video-pool-heading" className="text-xs font-black uppercase tracking-wider text-white">ভিডিও ডাটাবেজ পুল</h3>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-400">{visibleVideos.length}/{Object.keys(videoPool).length}টি</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <label className="relative sm:col-span-1">
                <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ভিডিও খুঁজুন" className="w-full rounded-md border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-2 text-xs text-slate-100 outline-none focus:border-red-500" aria-label="ভিডিও খুঁজুন" />
              </label>
              <label className="relative">
                <SlidersHorizontal size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-md border border-slate-800 bg-slate-950 py-1.5 pl-7 pr-2 text-xs text-slate-100 outline-none focus:border-red-500" aria-label="ক্যাটাগরি দিয়ে ফিল্টার">
                  <option value="all">সব ক্যাটাগরি</option>
                  {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                </select>
              </label>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-red-500" aria-label="ভিডিও সাজান">
                <option value="title">শিরোনাম অনুযায়ী</option>
                <option value="category">ক্যাটাগরি অনুযায়ী</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left text-xs">
              <thead className="bg-slate-950/20 text-[10px] uppercase tracking-wider text-slate-400">
                <tr className="border-b border-slate-800"><th className="px-4 py-3">ভিডিও</th><th className="px-4 py-3">ক্যাটাগরি</th><th className="px-4 py-3 text-center">স্লট</th><th className="px-4 py-3 text-right">অ্যাকশন</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleVideos.map((video) => {
                  const isFeatured = layout.featuredVideoId === video.id;
                  const isInSlider = sliderIds.includes(video.id);
                  return (
                    <tr key={video.id} className="group transition-colors hover:bg-slate-800/20">
                      <td className="max-w-xs px-4 py-3">
                        <div className="flex items-center gap-3"><div className="relative aspect-video w-16 shrink-0 overflow-hidden rounded border border-slate-800 bg-slate-950"><img src={video.thumbnail} alt="" className="h-full w-full object-cover" /><span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 font-mono text-[8px] text-slate-300">{video.duration}</span></div><div className="min-w-0"><h4 className="truncate font-bold text-slate-200 group-hover:text-white">{video.title}</h4><p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500">{video.description}</p></div></div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3"><span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">{video.category}</span></td>
                      <td className="whitespace-nowrap px-4 py-3"><div className="flex justify-center gap-1.5"><button type="button" aria-pressed={isFeatured} disabled={loading.layout} onClick={() => actions.updateLayout?.("SET_FEATURED", { id: video.id })} className={`rounded px-2 py-1 text-[10px] font-bold transition disabled:opacity-40 ${isFeatured ? "bg-red-600 text-white" : "border border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-200"}`}>Featured</button><button type="button" aria-pressed={isInSlider} disabled={loading.layout} onClick={() => actions.updateLayout?.("TOGGLE_SLIDER", { id: video.id })} className={`rounded px-2 py-1 text-[10px] font-bold transition disabled:opacity-40 ${isInSlider ? "bg-emerald-600 text-white" : "border border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-200"}`}>Slider</button></div></td>
                      <td className="whitespace-nowrap px-4 py-3 text-right"><div className="inline-flex rounded border border-slate-800 bg-slate-950/40 p-0.5"><button type="button" disabled={loading.mutating} onClick={() => actions.openModal?.("edit", video.id)} className="rounded p-1 text-slate-500 hover:text-blue-400 disabled:opacity-40" aria-label={`${video.title} সম্পাদনা করুন`}><Edit3 size={13} /></button><button type="button" disabled={loading.mutating} onClick={() => setPendingDeletion(video.id)} className="rounded p-1 text-slate-500 hover:text-red-400 disabled:opacity-40" aria-label={`${video.title} মুছুন`}><Trash2 size={13} /></button></div></td>
                    </tr>
                  );
                })}
                {visibleVideos.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-xs text-slate-500">এই ফিল্টারে কোনো ভিডিও পাওয়া যায়নি।</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <VideoEditorModal
        isOpen={modal.isOpen && (modal.type === "create" || modal.type === "edit")}
        mode={modal.type}
        formData={safeFormData}
        topics={topics}
        isSaving={loading.add || loading.update}
        onChange={changeField}
        onClose={() => actions.closeModal?.()}
        onSubmit={actions.submit}
      />
      <DeleteConfirmDialog isOpen={Boolean(pendingVideo)} itemName={pendingVideo?.title ?? "এই ভিডিও"} isLoading={loading.delete} onCancel={() => setPendingDeletion(null)} onConfirm={confirmDelete} />
    </div>
  );
});

VideoManager.displayName = "VideoManager";

export default VideoManager;
