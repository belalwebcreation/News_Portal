import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TipTapEditor from '../editor/TipTapEditor';
import useAutoSave from '../hooks/useAutoSave';
import useImageUpload from '../hooks/useImageUpload';
import { formatReadingTime } from '../utills/readingTime';
import { countWords } from '../utills/wordCount';
import { sanitizeHtml } from '../utills/sanitizeHtml';
import { hasEmbeddedVideo } from '../../utils/hasEmbeddedVideo';
import '../editor/styles.css';
import { categoryService } from "../category/services/categoryService";



const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', tone: 'neutral' },
  { value: 'review', label: 'In review', tone: 'warning' },
  { value: 'published', label: 'Published', tone: 'success' },
];

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/(^-|-$)/g, '').slice(0, 90);
}

function formatSavedTime(date) {
  if (!date) return 'Not saved yet';
  return `Saved ${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)}`;
}

function createArticlePayload(article) {
  return {
    ...article,
    body: sanitizeHtml(article.body),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCategory(category) {
  if (!category) return '';
  return typeof category === 'object' ? category._id || '' : category;
}

function StatusPill({ status }) {
  const option = STATUS_OPTIONS.find((item) => item.value === status) || STATUS_OPTIONS[0];
  return <span className={`status-pill status-pill--${option.tone}`}><span className="status-pill__dot" />{option.label}</span>;
}

export function ArticleManagement({
  initialArticle,
  onSave,
  onPublish,
  uploadImage,
  currentUserId,
  className = '',
}) {
  const navigate = useNavigate();

  console.log("currentUserId received:", currentUserId);
  const draftKey = (id) => `article-draft-${currentUserId || 'anon'}-${id || 'new'}`;

  const getInitialArticle = () => {
    if (initialArticle) {
      return {
        ...initialArticle,
        category: normalizeCategory(initialArticle.category),
        isFeatured: Boolean(initialArticle.isFeatured),
        showInVideoSection: Boolean(initialArticle.showInVideoSection), // ✅ NEW
      };
    }

    const saved = localStorage.getItem(draftKey());

    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        category: normalizeCategory(parsed.category),
        isFeatured: Boolean(parsed.isFeatured),
        showInVideoSection: Boolean(parsed.showInVideoSection), // ✅ NEW
      };
    }

    return {
      id: null,
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      body: "<p></p>",
      status: "draft",
      tags: [],
      coverImage: null,
      isFeatured: false,
      showInVideoSection: false, // ✅ NEW
      updatedAt: null,
    };
  };

  const [article, setArticle] = useState(getInitialArticle);
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const imageUpload = useImageUpload({ upload: uploadImage });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    setArticle(getInitialArticle());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const savePayload = async (nextArticle) => {
    const payload = createArticlePayload(nextArticle);

    localStorage.setItem(draftKey(payload.id), JSON.stringify(payload));

    if (onSave) {
      await onSave(payload);
    }
  };
  const autoSave = useAutoSave(article, savePayload, { delay: 1800 });

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      const response = await categoryService.getAllCategories();
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setCategories(list.filter((item) => item.isActive));
    } catch (err) {
      console.error(err);
      setCategoryError(err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem(draftKey(article.id), JSON.stringify(article));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  const update = (patch) => setArticle((current) => ({ ...current, ...patch }));
  const wordCount = useMemo(() => countWords(article.body), [article.body]);
  const readingTime = useMemo(() => formatReadingTime(article.body), [article.body]);

  // ✅ NEW: body-তে youtube embed আছে কিনা লাইভ চেক — checkbox enable/disable
  // আর hint text-এর জন্য
  const videoDetected = useMemo(() => hasEmbeddedVideo(article.body), [article.body]);

  // ✅ NEW: এডিট করতে করতে ভিডিও body থেকে সরে গেলে checkbox নিজে থেকে uncheck হয়ে
  // যাবে, নাহলে empty video card নিয়ে stale flag থেকে যেতে পারে
  useEffect(() => {
    if (!videoDetected && article.showInVideoSection) {
      update({ showInVideoSection: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDetected]);

  const addTag = (value) => {
    const tag = value.trim().replace(/^#/, '').slice(0, 32);
    if (!tag || article.tags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    update({ tags: [...article.tags, tag] });
    setTagInput('');
  };
  const saveNow = async () => {
    try {
      await autoSave.saveNow(article);
      setToast({ type: 'success', message: 'Your article is saved.' });
    } catch { setToast({ type: 'error', message: 'Could not save this article.' }); }
    window.setTimeout(() => setToast(null), 2800);
  };
  const publish = async () => {
    if (!article.category) {
      setToast({ type: 'error', message: 'Select a category before publishing.' });
      window.setTimeout(() => setToast(null), 2800);
      return;
    }
    const next = { ...article, status: 'published', slug: article.slug || slugify(article.title) };
    update(next);
    const payload = createArticlePayload(next);
    try {
  if (onPublish) await onPublish(payload);
  else await savePayload(payload);
  setToast({ type: 'success', message: 'Article published successfully.' });
} catch (err) {
  console.error('Publish failed:', err);
  const message = err?.response?.data?.message || err?.message || 'Publishing failed. Try again.';
  setToast({ type: 'error', message });
}
    window.setTimeout(() => setToast(null), 2800);
  };
  const addCoverImage = async (file) => {
    const asset = await imageUpload.upload(file);
    update({
  coverImage: {
    mediaId: asset.mediaId,
    url: asset.url,
    alt: asset.name,
  },
});
  };

  const handleCancel = () => {
    navigate('/dashboard/writer/add-news/manage');
  };

  if (preview) {
    return (
      <main className={`article-preview ${className}`.trim()}>
        <div className="article-preview__bar"><button type="button" className="button button--ghost" onClick={() => setPreview(false)}>← Back to editor</button><StatusPill status={article.status} /></div>
        <article className="article-preview__article">
          {article.coverImage?.url && <img className="article-preview__cover" src={article.coverImage.url} alt={article.coverImage.alt || ''} />}
          <div className="article-preview__meta"><span>{readingTime}</span><span>·</span><span>{wordCount.toLocaleString()} words</span></div>
          <h1>{article.title || 'Untitled article'}</h1>
          {article.excerpt && <p className="article-preview__excerpt">{article.excerpt}</p>}
          <div className="article-preview__tags">{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
          <div className="article-preview__body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }} />
        </article>
      </main>
    );
  }

  return (
    <main className={`article-management ${className}`.trim()}>
      <header className="article-management__header">
        <div className="article-management__breadcrumb"><span>Workspace</span><span>/</span><strong>Articles</strong></div>
        <div className="article-management__actions">
          <span className={`save-state save-state--${autoSave.status}`} aria-live="polite"><span className="save-state__dot" />{autoSave.status === 'saving' || autoSave.status === 'pending' ? 'Saving…' : formatSavedTime(autoSave.lastSavedAt)}</span>
          <button type="button" className="button button--ghost" onClick={handleCancel}>Cancel</button>
          <button type="button" className="button button--ghost" onClick={() => setPreview(true)}>Preview</button>
          <button type="button" className="button button--ghost" onClick={saveNow}>Save draft</button>
          <button type="button" className="button button--primary" onClick={publish}>Publish <span>↗</span></button>
          <button type="button" className="icon-button" aria-label="More article actions">•••</button>
        </div>
      </header>
      <div className="article-management__layout">
        <section className="article-management__main">
          <div className="title-field"><input maxLength={120} value={article.title} onChange={(event) => update({ title: event.target.value, slug: article.slug || slugify(event.target.value) })} placeholder="Untitled article" aria-label="Article title" /><span>{article.title.length}/120</span></div>
          <textarea className="excerpt-field" value={article.excerpt} onChange={(event) => update({ excerpt: event.target.value })} placeholder="Write a short description to help readers decide if this is for them…" maxLength={180} aria-label="Article excerpt" />
          <TipTapEditor value={article.body} onChange={(body) => update({ body })} uploadImage={uploadImage} onWordCount={() => {}} />
          <footer className="editor-footer"><span>{wordCount.toLocaleString()} words</span><span>·</span><span>{readingTime}</span><span className="editor-footer__hint">Changes save automatically</span></footer>
        </section>
        <aside className="article-management__sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card__heading"><h2>Publishing</h2><StatusPill status={article.status} /></div>
            <label className="field-label" htmlFor="article-status">Status</label>
            <select id="article-status" className="field" value={article.status} onChange={(event) => update({ status: event.target.value })}>{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            <label className="field-label" htmlFor="article-category">Category <span aria-hidden="true">*</span></label>
            <select id="article-category" className="field" value={article.category || ''} onChange={(event) => update({ category: event.target.value })} disabled={loadingCategories || (!categoryError && categories.length === 0)}>
              <option value="">{loadingCategories ? 'Loading categories…' : categoryError ? 'Could not load categories' : categories.length === 0 ? 'No categories yet' : 'Select category'}</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            {categoryError && <small className="field-help">{categoryError} <button type="button" className="button button--ghost" onClick={fetchCategories}>Retry</button></small>}
            <div className="slug-field"><span>/articles/</span><input id="article-slug" value={article.slug} onChange={(event) => update({ slug: slugify(event.target.value) })} placeholder="your-article-slug" /></div>

            <label className="field-label" htmlFor="article-featured" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', cursor: 'pointer' }}>
              <input
                id="article-featured"
                type="checkbox"
                checked={article.isFeatured}
                onChange={(event) => update({ isFeatured: event.target.checked })}
              />
              <span>Feature this in Main Grid</span>
            </label>
            <small className="field-help">
              চেক করলে হোমপেজের সবচেয়ে ওপরে Featured হিসেবে দেখাবে। নতুন কোনো আর্টিকেল
              ফিচার করলে এটা automatically Text News-এ নেমে যাবে, এবং জায়গা শেষ হলে
              Main Grid থেকে বাদ পড়বে — তবে ক্যাটাগরি পেজে সবসময় থেকেই যাবে।
            </small>

            {/* ✅ NEW: Video Section toggle — শুধু body-তে আসলে youtube embed
                থাকলেই enable হবে */}
            <label
              className="field-label"
              htmlFor="article-show-video"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                cursor: videoDetected ? 'pointer' : 'not-allowed',
                opacity: videoDetected ? 1 : 0.6,
              }}
            >
              <input
                id="article-show-video"
                type="checkbox"
                checked={article.showInVideoSection}
                disabled={!videoDetected}
                onChange={(event) => update({ showInVideoSection: event.target.checked })}
              />
              <span>Show in Video section</span>
            </label>
            <small className="field-help">
              {videoDetected
                ? 'ভিডিও এমবেড শনাক্ত হয়েছে — চেক করলে হোমপেজের Video Gallery-তে এই আর্টিকেলটি দেখাবে।'
                : 'এই আর্টিকেলে এখনো কোনো ইউটিউব ভিডিও এমবেড করা নেই, তাই এই অপশনটি বন্ধ আছে।'}
            </small>
          </div>
          <div className="sidebar-card"><div className="sidebar-card__heading"><h2>Cover image</h2><span className="muted">Optional</span></div>{article.coverImage?.url ? <div className="cover-preview"><img src={article.coverImage.url} alt={article.coverImage.alt || ''} /><button type="button" onClick={() => update({ coverImage: null })}>Remove image</button></div> : <label className="cover-empty"><span>▧</span><strong>Add a cover image</strong><small>Recommended 1600 × 900px</small><input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && addCoverImage(event.target.files[0])} /></label>}</div>
          <div className="sidebar-card"><div className="sidebar-card__heading"><h2>Tags</h2><span className="muted">{article.tags.length}/5</span></div><div className="tag-list">{article.tags.map((tag) => <span key={tag} className="tag-chip">#{tag}<button type="button" onClick={() => update({ tags: article.tags.filter((item) => item !== tag) })} aria-label={`Remove ${tag}`}>×</button></span>)}</div><div className="tag-input-wrap"><input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (['Enter', ','].includes(event.key)) { event.preventDefault(); addTag(tagInput); } }} onBlur={() => addTag(tagInput)} placeholder="Add a tag…" disabled={article.tags.length >= 5} /></div><small className="field-help">Press Enter to add a tag</small></div>
          <div className="sidebar-card sidebar-card--stats"><div className="sidebar-card__heading"><h2>Article health</h2><span className="health-score">Good</span></div><div className="health-row"><span>Title clarity</span><span className="health-indicator is-good">●</span></div><div className="health-row"><span>Reading time</span><strong>{readingTime}</strong></div><div className="health-row"><span>Accessibility</span><span className="health-indicator is-good">●</span></div></div>
        </aside>
      </div>
      {toast && <div className={`toast toast--${toast.type}`} role="status"><span>{toast.type === 'success' ? '✓' : '!'}</span>{toast.message}</div>}
    </main>
  );
}

export default ArticleManagement;