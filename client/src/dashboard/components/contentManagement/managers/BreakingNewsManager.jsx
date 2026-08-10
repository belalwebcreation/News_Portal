import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Gauge,
  Loader2,
  Pause,
  Play,
  Plus,
  Power,
  RefreshCw,
  Rss,
  Save,
  Tag,
  Trash2,
  Undo2,
  X,
} from "lucide-react";

import {
  addBreakingNews,
  deleteBreakingNews,
  getBreakingNews,
  toggleBreakingNewsVisibility,
  updateBreakingNews,
} from "../../../../services/breakingNewsService";

const LABEL_MAX_LENGTH = 20;
const MIN_SPEED = 10;
const MAX_SPEED = 200;

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const clampSpeed = (value) => Math.max(MIN_SPEED, Math.min(MAX_SPEED, Number(value) || MIN_SPEED));
const getTickerDuration = (speed) => Math.max(8, Math.min(90, 400 / clampSpeed(speed)));

const normalizeItems = (items) => (
  Array.isArray(items)
    ? items.map((item) => ({
      _id: item._id,
      title: item.title ?? "",
      slug: item.slug ?? "",
      visible: item.visible ?? true,
    }))
    : []
);

const makeSnapshot = ({ label = "", date = "", speed = 40, showDate = true, visible = true, items = [] }) => ({
  label,
  date,
  speed: clampSpeed(speed),
  showDate,
  visible,
  items: normalizeItems(items),
});

const Toast = ({ notice, onClose }) => {
  if (!notice) return null;
  const isError = notice.type === "error";

  return (
    <div className="breaking-news-toast fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm" role={isError ? "alert" : "status"} aria-live="polite">
      <div className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ${isError ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300" : "border-emerald-200 bg-white text-emerald-800 dark:border-emerald-900/50 dark:bg-slate-900 dark:text-emerald-300"}`}>
        {isError ? <AlertCircle className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" size={20} /> : <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" size={20} />}
        <p className="min-w-0 flex-1 text-sm font-semibold leading-5">{notice.message}</p>
        <button type="button" onClick={onClose} className="rounded-md p-0.5 text-slate-400 transition hover:bg-black/5 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300" aria-label="নোটিফিকেশন বন্ধ করুন"><X size={16} /></button>
      </div>
    </div>
  );
};

const DeleteDialog = ({ item, isBusy, onCancel, onConfirm }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isBusy && onCancel()}>
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900" role="alertdialog" aria-modal="true" aria-labelledby="delete-breaking-title">
        <div className="flex items-start justify-between gap-4"><div><h2 id="delete-breaking-title" className="text-base font-black text-slate-900 dark:text-white">আইটেমটি মুছে ফেলবেন?</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">"{item.title || "এই ব্রেকিং আইটেম"}" স্থায়ীভাবে মুছে যাবে।</p></div><button type="button" disabled={isBusy} onClick={onCancel} className="text-slate-400 hover:text-slate-700 disabled:opacity-40 dark:text-slate-500 dark:hover:text-slate-300" aria-label="ডিলিট ডায়ালগ বন্ধ করুন"><X size={18} /></button></div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={isBusy} onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">বাতিল</button><button type="button" disabled={isBusy} onClick={onConfirm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600">{isBusy && <Loader2 size={15} className="animate-spin" />}হ্যাঁ, মুছে ফেলুন</button></div>
      </section>
    </div>
  );
};

const TickerPreview = ({ label, date, speed, showDate, visible, items, paused, onTogglePause }) => {
  const liveItems = items.filter((item) => item.visible && item.title.trim());

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg" aria-labelledby="preview-title">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3"><div><p id="preview-title" className="text-xs font-black uppercase tracking-[0.14em] text-slate-300">লাইভ প্রিভিউ</p><p className="mt-1 text-[11px] text-slate-500">প্রতিটি পরিবর্তন কেমন দেখাবে তা এখানে দেখুন।</p></div><button type="button" onClick={onTogglePause} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/10" aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? "চালু করুন" : "থামান"}</button></div>
      <div className={`flex min-h-12 flex-col sm:flex-row ${visible ? "opacity-100" : "opacity-50"}`}>
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 px-3 py-2 text-white sm:px-4"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" /><span className="relative inline-flex h-2 w-2 rounded-full bg-white" /></span><span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em]">{label.trim() || "ব্রেকিং নিউজ"}</span></div>
        <div className="relative min-w-0 flex-1 overflow-hidden bg-white py-2">
          {liveItems.length ? <div className={`breaking-preview__track ${paused ? "breaking-preview__track--paused" : ""}`} style={{ "--preview-duration": `${getTickerDuration(speed)}s` }}>{[0, 1].map((copy) => <div key={copy} className={`breaking-preview__copy ${copy === 1 ? "breaking-preview__copy--clone" : ""}`} aria-hidden={copy === 1}>{liveItems.map((item, index) => <span key={`${copy}-${item._id ?? index}`} className="inline-flex shrink-0 items-center whitespace-nowrap text-sm font-semibold text-slate-700">{item.title}{index < liveItems.length - 1 && <b className="mx-6 text-xs text-red-500">●</b>}</span>)}<b className="mx-6 text-xs text-red-500">●</b></div>)}</div> : <p className="px-4 text-sm text-slate-400">একটি দৃশ্যমান ব্রেকিং শিরোনাম যোগ করুন।</p>}
        </div>
        {showDate && date && <div className="hidden shrink-0 items-center border-l border-slate-100 bg-white px-4 text-xs font-semibold text-slate-500 lg:flex">{date}</div>}
      </div>
    </section>
  );
};

const BreakingNewsManager = ({ onSaved } = {}) => {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [speed, setSpeed] = useState(40);
  const [showDate, setShowDate] = useState(true);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [items, setItems] = useState([]);
  const [initial, setInitial] = useState(() => makeSnapshot({}));
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [paused, setPaused] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = useCallback((type, message) => setNotice({ type, message }), []);

  const loadNews = useCallback(async ({ preserveDrafts } = {}) => {
    try {
      setLoading(true);
      setLoadError("");
      const response = await getBreakingNews();
      const breakingNews = response?.breakingNews ?? {};
      const next = makeSnapshot({
        label: breakingNews.label,
        date: breakingNews.date,
        speed: breakingNews.speed,
        showDate: breakingNews.showDate ?? true,
        visible: breakingNews.visible ?? true,
        items: breakingNews.items,
      });

      setInitial(next);
      if (preserveDrafts) {
        const draftById = new Map(preserveDrafts.items.map((item) => [item._id, item]));
        setLabel(preserveDrafts.label);
        setDate(preserveDrafts.date);
        setSpeed(preserveDrafts.speed);
        setShowDate(preserveDrafts.showDate);
        setTickerVisible(preserveDrafts.visible);
        setItems(next.items.map((item) => draftById.get(item._id) ?? item));
      } else {
        setLabel(next.label);
        setDate(next.date);
        setSpeed(next.speed);
        setShowDate(next.showDate);
        setTickerVisible(next.visible);
        setItems(next.items);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, "ব্রেকিং নিউজ লোড করা যায়নি।"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), notice.type === "error" ? 5000 : 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const settingsDirty = useMemo(() => (
    label !== initial.label || date !== initial.date || speed !== initial.speed || showDate !== initial.showDate || tickerVisible !== initial.visible
  ), [label, date, speed, showDate, tickerVisible, initial]);
  const originalItems = useMemo(() => new Map(initial.items.map((item) => [item._id, item])), [initial.items]);
  const dirtyItemIds = useMemo(() => new Set(items.filter((item) => {
    const original = originalItems.get(item._id);
    return !original || item.title !== original.title || item.slug !== original.slug || item.visible !== original.visible;
  }).map((item) => item._id)), [items, originalItems]);
  const filteredItems = useMemo(() => {
    const keyword = filter.trim().toLocaleLowerCase();
    return keyword ? items.filter((item) => `${item.title} ${item.slug}`.toLocaleLowerCase().includes(keyword)) : items;
  }, [filter, items]);
  const activeCount = useMemo(() => items.filter((item) => item.visible).length, [items]);
  const anyItemBusy = Boolean(busyItemId);

  const updateItem = (id, field, value) => setItems((current) => current.map((item) => item._id === id ? { ...item, [field]: value } : item));
  const resetItem = (id) => {
    const original = originalItems.get(id);
    if (original) setItems((current) => current.map((item) => item._id === id ? original : item));
  };

  const notifySaved = () => onSaved?.();

  const saveSettings = async () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return notify("error", "টিকার লেবেল আবশ্যক।");
    if (trimmedLabel.length > LABEL_MAX_LENGTH) return notify("error", `লেবেল সর্বোচ্চ ${LABEL_MAX_LENGTH} অক্ষরের হতে পারে।`);

    // Keep the server's last saved item list. Unsaved edits in individual rows
    // cannot be accidentally included in this settings-only request.
    const payload = { ...initial, label: trimmedLabel, date: date.trim(), speed: clampSpeed(speed), showDate, visible: tickerVisible, items: initial.items };
    try {
      setSavingSettings(true);
      await updateBreakingNews(payload);
      setLabel(payload.label);
      setDate(payload.date);
      setSpeed(payload.speed);
      setInitial((current) => ({ ...current, label: payload.label, date: payload.date, speed: payload.speed, showDate: payload.showDate, visible: payload.visible }));
      notify("success", "টিকার সেটিংস সংরক্ষণ করা হয়েছে।");
      notifySaved();
    } catch (error) {
      notify("error", getErrorMessage(error, "টিকার সেটিংস সংরক্ষণ করা যায়নি।"));
    } finally {
      setSavingSettings(false);
    }
  };

  const saveItem = async (id) => {
    const currentItem = items.find((item) => item._id === id);
    if (!currentItem) return;
    const title = currentItem.title.trim();
    const slug = currentItem.slug.trim();
    if (!title || !slug) return notify("error", "এই আইটেমের শিরোনাম এবং নিউজ লিংক দুটিই দিন।");
    if (items.some((item) => item._id !== id && item.slug.trim() === slug)) return notify("error", "একই নিউজ লিংক একাধিক আইটেমে ব্যবহার করা যাবে না।");

    const savedItem = { ...currentItem, title, slug };
    // `updateBreakingNews` currently saves the document as a whole. Build the
    // payload from the saved snapshot, then replace just this one item.
    const payload = { ...initial, items: initial.items.map((item) => item._id === id ? savedItem : item) };
    try {
      setBusyItemId(id);
      await updateBreakingNews(payload);
      setItems((current) => current.map((item) => item._id === id ? savedItem : item));
      setInitial((current) => ({ ...current, items: current.items.map((item) => item._id === id ? savedItem : item) }));
      notify("success", "শুধু এই ব্রেকিং আইটেমটি সংরক্ষণ করা হয়েছে।");
      notifySaved();
    } catch (error) {
      notify("error", getErrorMessage(error, "এই ব্রেকিং আইটেমটি সংরক্ষণ করা যায়নি।"));
    } finally {
      setBusyItemId(null);
    }
  };

  const addItem = async () => {
    const drafts = { label, date, speed, showDate, visible: tickerVisible, items };
    try {
      setAdding(true);
      await addBreakingNews({ title: "নতুন ব্রেকিং সংবাদ", slug: "/news/new-breaking-news", visible: true });
      await loadNews({ preserveDrafts: drafts });
      notify("success", "নতুন আইটেম যোগ হয়েছে। এই row-টি সম্পাদনা করে আলাদা Save চাপুন।");
      notifySaved();
    } catch (error) {
      notify("error", getErrorMessage(error, "নতুন ব্রেকিং আইটেম যোগ করা যায়নি।"));
    } finally {
      setAdding(false);
    }
  };

  const toggleItem = async (id) => {
    try {
      setBusyItemId(id);
      await toggleBreakingNewsVisibility(id);
      const applyToggle = (list) => list.map((item) => item._id === id ? { ...item, visible: !item.visible } : item);
      setItems(applyToggle);
      setInitial((current) => ({ ...current, items: applyToggle(current.items) }));
      notify("success", "এই আইটেমের দৃশ্যমানতা আপডেট করা হয়েছে।");
      notifySaved();
    } catch (error) {
      notify("error", getErrorMessage(error, "আইটেমটির দৃশ্যমানতা বদলানো যায়নি।"));
    } finally {
      setBusyItemId(null);
    }
  };

  const deleteItem = async () => {
    const id = deleteTarget?._id;
    if (!id) return;
    try {
      setBusyItemId(id);
      await deleteBreakingNews(id);
      const removeItem = (list) => list.filter((item) => item._id !== id);
      setItems(removeItem);
      setInitial((current) => ({ ...current, items: removeItem(current.items) }));
      setDeleteTarget(null);
      notify("success", "ব্রেকিং আইটেমটি মুছে ফেলা হয়েছে।");
      notifySaved();
    } catch (error) {
      notify("error", getErrorMessage(error, "আইটেমটি মুছা যায়নি।"));
    } finally {
      setBusyItemId(null);
    }
  };

  const useToday = () => setDate(new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date()));
  const resetSettings = () => { setLabel(initial.label); setDate(initial.date); setSpeed(initial.speed); setShowDate(initial.showDate); setTickerVisible(initial.visible); };

  if (loading) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500" role="status"><Loader2 size={34} className="animate-spin text-red-600 dark:text-red-500" /><p className="text-sm font-semibold">ব্রেকিং নিউজ লোড হচ্ছে...</p></div>;
  if (loadError) return <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30"><AlertCircle className="mx-auto text-red-600 dark:text-red-400" size={32} /><h2 className="mt-3 font-black text-red-900 dark:text-red-200">ব্রেকিং নিউজ লোড করা যায়নি</h2><p className="mt-1 text-sm text-red-700 dark:text-red-300">{loadError}</p><button type="button" onClick={() => loadNews()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"><RefreshCw size={15} /> আবার চেষ্টা করুন</button></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10 sm:space-y-6">
      <Toast notice={notice} onClose={() => setNotice(null)} />
      <DeleteDialog item={deleteTarget} isBusy={Boolean(busyItemId)} onCancel={() => setDeleteTarget(null)} onConfirm={deleteItem} />

      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-700 dark:bg-slate-900"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-red-600 dark:text-red-400">Live newsroom</p><h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">ব্রেকিং নিউজ ম্যানেজার</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">প্রতিটি টিকার আইটেম আলাদাভাবে সম্পাদনা ও সংরক্ষণ করুন।</p></div><div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"><span className={`h-2 w-2 rounded-full ${tickerVisible ? "animate-pulse bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />{tickerVisible ? `${activeCount}টি আইটেম লাইভ` : "টিকার বন্ধ আছে"}</div></header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="settings-title">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800"><div><h2 id="settings-title" className="text-lg font-black text-slate-900 dark:text-white">টিকার সেটিংস</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">এই Save শুধুমাত্র লেবেল, তারিখ ও টিকারের সেটিংস সংরক্ষণ করে।</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setTickerVisible((value) => !value)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${tickerVisible ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`} aria-pressed={tickerVisible}><Power size={15} />{tickerVisible ? "টিকার চালু" : "টিকার বন্ধ"}</button><button type="button" onClick={() => setShowDate((value) => !value)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${showDate ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/60" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`} aria-pressed={showDate}>{showDate ? "তারিখ দেখাবে" : "তারিখ লুকানো"}</button></div></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3"><label className="block"><span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300"><span className="flex items-center gap-1.5"><Tag size={15} className="text-red-600 dark:text-red-400" /> টিকার লেবেল</span><span className="font-normal text-slate-400 dark:text-slate-500">{label.length}/{LABEL_MAX_LENGTH}</span></span><input value={label} maxLength={LABEL_MAX_LENGTH} onChange={(event) => setLabel(event.target.value)} placeholder="যেমন: ব্রেকিং" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-red-950/50" /></label><div><span className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300"><CalendarDays size={15} className="text-red-600 dark:text-red-400" /> প্রকাশের তারিখ</span><div className="flex gap-2"><input value={date} onChange={(event) => setDate(event.target.value)} placeholder="১৫ জুলাই ২০২৬" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-red-950/50" /><button type="button" onClick={useToday} className="shrink-0 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">আজকের</button></div></div><div><span className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300"><Gauge size={15} className="text-red-600 dark:text-red-400" /> স্ক্রল গতি <span className="font-normal text-slate-400 dark:text-slate-500">({getTickerDuration(speed).toFixed(0)} সেকেন্ড)</span></span><div className="flex items-center gap-3"><input type="range" min={MIN_SPEED} max={MAX_SPEED} value={speed} onChange={(event) => setSpeed(clampSpeed(event.target.value))} className="w-full accent-red-600" /><input type="number" min={MIN_SPEED} max={MAX_SPEED} value={speed} onChange={(event) => setSpeed(clampSpeed(event.target.value))} className="w-20 rounded-xl border border-slate-300 px-2 py-2 text-center text-sm outline-none focus:border-red-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" /></div><p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">বেশি মানে দ্রুত স্ক্রল হবে।</p></div></div>
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-800"><button type="button" onClick={resetSettings} disabled={savingSettings || !settingsDirty} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"><Undo2 size={15} /> ফিরিয়ে নিন</button><button type="button" onClick={saveSettings} disabled={savingSettings || anyItemBusy || !settingsDirty} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-red-700 dark:hover:bg-red-600 dark:disabled:bg-slate-700">{savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{savingSettings ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ"}</button></div>
      </section>

      <TickerPreview label={label} date={date} speed={speed} showDate={showDate} visible={tickerVisible} items={items} paused={paused} onTogglePause={() => setPaused((value) => !value)} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="items-title">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between dark:border-slate-800"><div className="flex items-center gap-3"><div><h2 id="items-title" className="text-lg font-black text-slate-900 dark:text-white">টিকার আইটেম</h2><p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">প্রতিটি row-র Save শুধু সেই আইটেমটিই সংরক্ষণ করে।</p></div><span className="grid h-7 min-w-7 place-items-center rounded-full bg-red-50 px-2 text-xs font-black text-red-700 dark:bg-red-950/40 dark:text-red-300">{items.length}</span></div><div className="flex flex-col gap-2 sm:flex-row"><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="আইটেম খুঁজুন" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 sm:w-52 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" /><button type="button" onClick={addItem} disabled={adding || savingSettings || anyItemBusy} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600">{adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}{adding ? "যোগ হচ্ছে..." : "নতুন আইটেম"}</button></div></div>

        {items.length === 0 ? <div className="p-10 text-center sm:p-14"><Rss size={34} className="mx-auto text-slate-300 dark:text-slate-600" /><h3 className="mt-3 font-bold text-slate-700 dark:text-slate-200">এখনও কোনো ব্রেকিং আইটেম নেই</h3><p className="mt-1 text-sm text-slate-400 dark:text-slate-500">একটি আইটেম যোগ করে লাইভ টিকার চালু করুন।</p><button type="button" onClick={addItem} disabled={adding || savingSettings || anyItemBusy} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"><Plus size={16} /> নতুন আইটেম</button></div> : filteredItems.length === 0 ? <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">এই খোঁজে কোনো আইটেম পাওয়া যায়নি।</div> : <div className="divide-y divide-slate-100 dark:divide-slate-800">{filteredItems.map((item, index) => {
          const isDirty = dirtyItemIds.has(item._id);
          const isBusy = busyItemId === item._id;
          return <article key={item._id} className={`grid gap-3 p-4 transition sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center ${isDirty ? "bg-amber-50/40 dark:bg-amber-950/20" : "bg-white dark:bg-slate-900"}`}><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">{String(items.findIndex((current) => current._id === item._id) + 1 || index + 1).padStart(2, "0")}</span><div className="grid min-w-0 gap-2 md:grid-cols-2"><label className="min-w-0"><span className="sr-only">শিরোনাম</span><input value={item.title} disabled={anyItemBusy && !isBusy} onChange={(event) => updateItem(item._id, "title", event.target.value)} placeholder="ব্রেকিং শিরোনাম" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-red-950/50 dark:disabled:bg-slate-800/50" /></label><label className="min-w-0"><span className="sr-only">নিউজ লিংক</span><input value={item.slug} disabled={anyItemBusy && !isBusy} onChange={(event) => updateItem(item._id, "slug", event.target.value)} placeholder="/news/article-slug" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-red-950/50 dark:disabled:bg-slate-800/50" /></label></div><div className="flex flex-wrap items-center justify-end gap-2"><button type="button" disabled={anyItemBusy || savingSettings} onClick={() => toggleItem(item._id)} className={`grid h-10 w-10 place-items-center rounded-xl transition disabled:opacity-50 ${item.visible ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"}`} aria-label={item.visible ? "আইটেম লুকান" : "আইটেম দেখান"}>{isBusy ? <Loader2 size={17} className="animate-spin" /> : item.visible ? <Eye size={17} /> : <EyeOff size={17} />}</button>{isDirty && <button type="button" disabled={anyItemBusy || savingSettings} onClick={() => resetItem(item._id)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"><Undo2 size={14} /> ফিরিয়ে নিন</button>}<button type="button" disabled={anyItemBusy || savingSettings || !isDirty} onClick={() => saveItem(item._id)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">{isBusy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{isBusy ? "সংরক্ষণ..." : "Save"}</button><button type="button" disabled={anyItemBusy || savingSettings} onClick={() => setDeleteTarget(item)} className="grid h-10 w-10 place-items-center rounded-xl text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40" aria-label="আইটেম মুছুন"><Trash2 size={17} /></button></div></article>;
        })}</div>}
      </section>

      <style>{`
        .breaking-news-toast { animation: breaking-news-toast-in 180ms ease-out; }
        .breaking-preview__track { display: flex; width: max-content; animation: breaking-preview-scroll var(--preview-duration, 40s) linear infinite; will-change: transform; }
        .breaking-preview__track:hover, .breaking-preview__track--paused { animation-play-state: paused; }
        .breaking-preview__copy { display: flex; align-items: center; flex-shrink: 0; }
        @keyframes breaking-news-toast-in { from { opacity: 0; transform: translate3d(0, -10px, 0) scale(.98); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
        @keyframes breaking-preview-scroll { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
        @media (prefers-reduced-motion: reduce) { .breaking-news-toast { animation: none; } .breaking-preview__track { animation: none; } .breaking-preview__copy--clone { display: none; } }
      `}</style>
    </div>
  );
};

export default BreakingNewsManager;