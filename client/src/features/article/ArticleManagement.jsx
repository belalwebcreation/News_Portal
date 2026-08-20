import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import TipTapEditor from "../editor/TipTapEditor";
import useAutoSave from "../hooks/useAutoSave";
import useImageUpload from "../hooks/useImageUpload";

import { formatReadingTime } from "../utills/readingTime";
import { countWords } from "../utills/wordCount";
import { sanitizeHtml } from "../utills/sanitizeHtml";

import { hasEmbeddedVideo } from "../../utils/hasEmbeddedVideo";

import "../editor/styles.css";

import { categoryService } from "../category/services/categoryService";

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
    tone: "neutral",
  },
  {
    value: "review",
    label: "In review",
    tone: "warning",
  },
  {
    value: "published",
    label: "Published",
    tone: "success",
  },
];

// ============================================================
// SLUGIFY
// ============================================================

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

// ============================================================
// SAVED TIME
// ============================================================

function formatSavedTime(date) {
  if (!date) return "Not saved yet";

  return `Saved ${new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)}`;
}

// ============================================================
// ARTICLE PAYLOAD
// ============================================================

function createArticlePayload(article) {
  return {
    ...article,
    body: sanitizeHtml(article.body),
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================
// CATEGORY NORMALIZER
// ============================================================

function normalizeCategory(category) {
  if (!category) return "";

  return typeof category === "object"
    ? category._id || ""
    : category;
}

// ============================================================
// STATUS PILL
// ============================================================

function StatusPill({ status }) {
  const option =
    STATUS_OPTIONS.find((item) => item.value === status) ||
    STATUS_OPTIONS[0];

  return (
    <span
      className={`status-pill status-pill--${option.tone}`}
    >
      <span className="status-pill__dot" />
      {option.label}
    </span>
  );
}

// ============================================================
// ARTICLE MANAGEMENT
// ============================================================

export function ArticleManagement({
  initialArticle,
  onSave,
  onPublish,
  uploadImage,
  currentUserId,
  currentUserRole,   // ✅ NEW
  className = "",
}) {
  const navigate = useNavigate();

    const isWriterOnly = currentUserRole === "writer";

  const visibleStatusOptions = isWriterOnly
    ? STATUS_OPTIONS.filter((option) => option.value !== "published")
    : STATUS_OPTIONS;

  // ==========================================================
  // DRAFT KEY
  // ==========================================================

  const draftKey = useCallback(
    (id) =>
      `article-draft-${currentUserId || "anon"}-${id || "new"}`,
    [currentUserId]
  );

  // ==========================================================
  // INITIAL ARTICLE
  // ==========================================================

  const getInitialArticle = useCallback(() => {
    // Existing article
    if (initialArticle) {
      return {
        ...initialArticle,

        category: normalizeCategory(
          initialArticle.category
        ),

        isFeatured: Boolean(
          initialArticle.isFeatured
        ),

        showInVideoSection: Boolean(
          initialArticle.showInVideoSection
        ),
      };
    }

    // Local draft
    try {
      const saved = localStorage.getItem(
        draftKey()
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        return {
          ...parsed,

          category: normalizeCategory(
            parsed.category
          ),

          isFeatured: Boolean(
            parsed.isFeatured
          ),

          showInVideoSection: Boolean(
            parsed.showInVideoSection
          ),
        };
      }
    } catch (error) {
      console.error(
        "Failed to restore local draft:",
        error
      );
    }

    // New article
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
      showInVideoSection: false,
      updatedAt: null,
    };
  }, [initialArticle, draftKey]);

  // ==========================================================
  // STATE
  // ==========================================================

  const [article, setArticle] = useState(
    getInitialArticle
  );

  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);

  const [toast, setToast] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [categoryError, setCategoryError] =
    useState(null);

  const [isPublishing, setIsPublishing] =
    useState(false);

  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  const imageUpload = useImageUpload({
    upload: uploadImage,
  });

  // ==========================================================
  // PERSISTED ARTICLE ID
  //
  // This is the most important part for preventing:
  //
  // POST /news
  // POST /news
  // POST /news
  //
  // Instead:
  //
  // POST /news
  // PUT /news/:id
  // PUT /news/:id
  // ==========================================================

  const persistedArticleIdRef = useRef(
    initialArticle?.id ||
      initialArticle?._id ||
      null
  );

  // ==========================================================
  // CURRENT PUBLISHING REF
  //
  // Ref is used in addition to state because state updates
  // are asynchronous.
  // ==========================================================

  const isPublishingRef = useRef(false);

  // ==========================================================
  // CURRENT SAVE REQUEST
  //
  // If autosave is already sending a request and user clicks
  // Publish, Publish will WAIT for this request to finish.
  // ==========================================================

  const activeSavePromiseRef = useRef(null);

  // ==========================================================
  // SAVE GENERATION
  //
  // Every save operation gets a generation number.
  //
  // When Publish starts, generation changes so no NEW
  // autosave is allowed to continue.
  // ==========================================================

  const saveGenerationRef = useRef(0);

  // ==========================================================
  // USER LOADED TRACKING
  // ==========================================================

  const [loadedForUserId, setLoadedForUserId] =
    useState(currentUserId);

  useEffect(() => {
    if (
      currentUserId &&
      currentUserId !== loadedForUserId
    ) {
      const nextArticle = getInitialArticle();

      setArticle(nextArticle);

      persistedArticleIdRef.current =
        nextArticle?.id ||
        nextArticle?._id ||
        null;

      setLoadedForUserId(currentUserId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // ==========================================================
  // UPDATE ARTICLE
  // ==========================================================

  const update = useCallback((patch) => {
    setArticle((current) => ({
      ...current,
      ...patch,
    }));
  }, []);

  // ==========================================================
  // SAVE PAYLOAD
  //
  // First save:
  //
  // POST /api/news
  //
  // Subsequent saves:
  //
  // PUT /api/news/:id
  // ==========================================================

  const savePayload = useCallback(
    async (nextArticle) => {
      /*
       * If publishing has already started, do not start
       * another autosave.
       */
      if (isPublishingRef.current) {
        return nextArticle;
      }

      const generation =
        saveGenerationRef.current;

      const existingId =
        nextArticle?.id ||
        nextArticle?._id ||
        persistedArticleIdRef.current ||
        null;

      const payload = createArticlePayload({
        ...nextArticle,
        id: existingId,
      });

      /*
       * Save local copy immediately.
       */
      try {
        localStorage.setItem(
          draftKey(existingId),
          JSON.stringify(payload)
        );
      } catch (error) {
        console.error(
          "Failed to save local draft:",
          error
        );
      }

      if (!onSave) {
        return payload;
      }

      /*
       * Create the actual server save promise.
       */
      const savePromise = (async () => {
        /*
         * Generation changed while waiting.
         * Do not start stale save.
         */
        if (
          generation !== saveGenerationRef.current ||
          isPublishingRef.current
        ) {
          return payload;
        }

        const savedArticle =
          await onSave(payload);

        /*
         * If Publish started while the request was running,
         * DO NOT update article state from this stale request.
         */
        if (
          generation !==
            saveGenerationRef.current ||
          isPublishingRef.current
        ) {
          return savedArticle;
        }

        const savedId =
          savedArticle?._id ||
          savedArticle?.id ||
          savedArticle?.data?._id ||
          savedArticle?.data?.id ||
          existingId;

        /*
         * Store the real MongoDB ID.
         */
        if (savedId) {
          persistedArticleIdRef.current =
            savedId;

          setArticle((current) => {
            if (current.id === savedId) {
              return current;
            }

            return {
              ...current,
              id: savedId,
            };
          });

          /*
           * Move local draft from "new" to real ID.
           */
          try {
            localStorage.setItem(
              draftKey(savedId),
              JSON.stringify({
                ...payload,
                id: savedId,
              })
            );

            if (!existingId) {
              localStorage.removeItem(
                draftKey()
              );
            }
          } catch (error) {
            console.error(
              "Failed to persist article draft:",
              error
            );
          }
        }

        return savedArticle;
      })();

      activeSavePromiseRef.current =
        savePromise;

      try {
        return await savePromise;
      } finally {
        /*
         * Only clear if this is still the current
         * active request.
         */
        if (
          activeSavePromiseRef.current ===
          savePromise
        ) {
          activeSavePromiseRef.current = null;
        }
      }
    },
    [draftKey, onSave]
  );

  // ==========================================================
  // AUTO SAVE
  // ==========================================================

  const autoSave = useAutoSave(
    article,
    savePayload,
    {
      delay: 1800,

      enabled:
        !isPublishing &&
        Boolean(article.category) &&
        Boolean(article.title?.trim()),
    }
  );

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories = useCallback(
    async () => {
      setLoadingCategories(true);
      setCategoryError(null);

      try {
        const response =
          await categoryService.getAllCategories();

        const list = Array.isArray(response)
          ? response
          : response?.data ?? [];

        setCategories(
          list.filter(
            (item) => item.isActive
          )
        );
      } catch (error) {
        console.error(error);
        setCategoryError(
          error.message ||
            "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ==========================================================
  // LOCAL DRAFT CACHE
  // ==========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        draftKey(article.id),
        JSON.stringify(article)
      );
    } catch (error) {
      console.error(
        "Failed to cache article:",
        error
      );
    }
  }, [article, draftKey]);

  // ==========================================================
  // WORD COUNT
  // ==========================================================

  const wordCount = useMemo(
    () => countWords(article.body),
    [article.body]
  );

  // ==========================================================
  // READING TIME
  // ==========================================================

  const readingTime = useMemo(
    () => formatReadingTime(article.body),
    [article.body]
  );

  // ==========================================================
  // VIDEO DETECTION
  // ==========================================================

  const videoDetected = useMemo(
    () => hasEmbeddedVideo(article.body),
    [article.body]
  );

  // ==========================================================
  // REMOVE VIDEO SECTION FLAG IF VIDEO REMOVED
  // ==========================================================

  useEffect(() => {
    if (
      !videoDetected &&
      article.showInVideoSection
    ) {
      update({
        showInVideoSection: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDetected]);

  // ==========================================================
  // TAG
  // ==========================================================

  const addTag = useCallback(
    (value) => {
      const tag = value
        .trim()
        .replace(/^#/, "")
        .slice(0, 32);

      if (!tag) return;

      if (
        article.tags.some(
          (item) =>
            item.toLowerCase() ===
            tag.toLowerCase()
        )
      ) {
        return;
      }

      if (article.tags.length >= 5) {
        return;
      }

      update({
        tags: [...article.tags, tag],
      });

      setTagInput("");
    },
    [article.tags, update]
  );

  // ==========================================================
  // MANUAL SAVE DRAFT
  // ==========================================================

  const saveNow = useCallback(async () => {
    if (isPublishingRef.current) {
      return;
    }

    try {
      await autoSave.saveNow(article);

      setToast({
        type: "success",
        message: "Your article is saved.",
      });
    } catch (error) {
      console.error(
        "Manual save failed:",
        error
      );

      setToast({
        type: "error",
        message:
          error?.message ||
          "Could not save this article.",
      });
    }

    window.setTimeout(() => {
      setToast(null);
    }, 2800);
  }, [article, autoSave]);

  // ==========================================================
  // PUBLISH
  // ==========================================================

  const publish = useCallback(async () => {
    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!article.category) {
      setToast({
        type: "error",
        message:
          "Select a category before publishing.",
      });

      window.setTimeout(() => {
        setToast(null);
      }, 2800);

      return;
    }

    if (!article.title?.trim()) {
      setToast({
        type: "error",
        message:
          "Add a title before publishing.",
      });

      window.setTimeout(() => {
        setToast(null);
      }, 2800);

      return;
    }

    if (isPublishingRef.current) {
      return;
    }

    // --------------------------------------------------------
    // LOCK PUBLISHING IMMEDIATELY
    //
    // Ref changes synchronously.
    // State changes asynchronously.
    // --------------------------------------------------------

    isPublishingRef.current = true;
    setIsPublishing(true);

    /*
     * Invalidate NEW autosave generations.
     */
    saveGenerationRef.current += 1;

    /*
     * Cancel pending debounce timer.
     */
    autoSave.cancel();

    // --------------------------------------------------------
    // WAIT FOR CURRENT AUTOSAVE
    //
    // If an autosave request is already in flight,
    // wait for it before publishing.
    // --------------------------------------------------------

    try {
      if (activeSavePromiseRef.current) {
        await activeSavePromiseRef.current;
      }

      // ------------------------------------------------------
      // Build published article
      // ------------------------------------------------------

           const targetStatus = isWriterOnly ? "review" : "published";

      const next = {
        ...article,
        status: targetStatus,
        slug:
          article.slug ||
          slugify(article.title),
      };

      // ------------------------------------------------------
      // Update local state
      // ------------------------------------------------------

      setArticle(next);

      // ------------------------------------------------------
      // Create final publish payload
      // ------------------------------------------------------

      const payload =
        createArticlePayload(next);

      // ------------------------------------------------------
      // PUBLISH
      // ------------------------------------------------------

      if (onPublish) {
        await onPublish(payload);
      } else {
        /*
         * If no publish handler exists,
         * use savePayload directly.
         *
         * Temporarily allow this exact publish request.
         */
        const previousPublishing =
          isPublishingRef.current;

        isPublishingRef.current = false;

        try {
          await savePayload(payload);
        } finally {
          isPublishingRef.current =
            previousPublishing;
        }
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

            setToast({
        type: "success",
        message: isWriterOnly
          ? "Article submitted for review."
          : "Article published successfully.",
      });

      window.setTimeout(() => {
        setToast(null);
      }, 2800);
    } catch (error) {
      console.error(
        "Publish failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Publishing failed. Try again.";

      setToast({
        type: "error",
        message,
      });
    } finally {
      /*
       * Release publishing lock.
       */
      isPublishingRef.current = false;
      setIsPublishing(false);
    }
  }, [
    article,
    autoSave,
    onPublish,
    savePayload,
    // currentUserRole intentionally excluded to avoid unnecessary re-creations
    isWriterOnly, // included to satisfy hook dependency
  ]);

  // ==========================================================
  // COVER IMAGE
  // ==========================================================

  const addCoverImage = useCallback(
    async (file) => {
      try {
        const asset =
          await imageUpload.upload(file);

        update({
          coverImage: {
            mediaId: asset.mediaId,
            url: asset.url,
            alt: asset.name,
          },
        });
      } catch (error) {
        console.error(
          "Cover image upload failed:",
          error
        );

        setToast({
          type: "error",
          message:
            error?.message ||
            "Could not upload cover image.",
        });

        window.setTimeout(() => {
          setToast(null);
        }, 2800);
      }
    },
    [imageUpload, update]
  );

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel = useCallback(() => {
    autoSave.cancel();

    navigate(
      "/dashboard/writer/add-news/manage"
    );
  }, [autoSave, navigate]);

  // ==========================================================
  // PREVIEW
  // ==========================================================

  if (preview) {
    return (
      <main
        className={`article-preview ${className}`.trim()}
      >
        <div className="article-preview__bar">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setPreview(false)}
          >
            ← Back to editor
          </button>

          <StatusPill
            status={article.status}
          />
        </div>

        <article className="article-preview__article">
          {article.coverImage?.url && (
            <img
              className="article-preview__cover"
              src={article.coverImage.url}
              alt={
                article.coverImage.alt || ""
              }
            />
          )}

          <div className="article-preview__meta">
            <span>{readingTime}</span>
            <span>·</span>
            <span>
              {wordCount.toLocaleString()} words
            </span>
          </div>

          <h1>
            {article.title ||
              "Untitled article"}
          </h1>

          {article.excerpt && (
            <p className="article-preview__excerpt">
              {article.excerpt}
            </p>
          )}

          <div className="article-preview__tags">
            {article.tags.map((tag) => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>

          <div
            className="article-preview__body"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(
                article.body
              ),
            }}
          />
        </article>
      </main>
    );
  }

  // ==========================================================
  // EDITOR
  // ==========================================================

  return (
    <main
      className={`article-management ${className}`.trim()}
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="article-management__header">
        <div className="article-management__breadcrumb">
          <span>Workspace</span>
          <span>/</span>
          <strong>Articles</strong>
        </div>

        <div className="article-management__actions">
          <span
            className={`save-state save-state--${autoSave.status}`}
            aria-live="polite"
          >
            <span className="save-state__dot" />

            {autoSave.status === "saving" ||
            autoSave.status === "pending"
              ? "Saving…"
              : formatSavedTime(
                  autoSave.lastSavedAt
                )}
          </span>

          <button
            type="button"
            className="button button--ghost"
            onClick={handleCancel}
            disabled={isPublishing}
          >
            Cancel
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={() =>
              setPreview(true)
            }
            disabled={isPublishing}
          >
            Preview
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={saveNow}
            disabled={
              isPublishing ||
              !article.title?.trim() ||
              !article.category
            }
          >
            Save draft
          </button>

                    <button
            type="button"
            className="button button--primary"
            onClick={publish}
            disabled={isPublishing}
          >
            {isPublishing
              ? isWriterOnly
                ? "Submitting…"
                : "Publishing…"
              : isWriterOnly
              ? "Submit for review"
              : "Publish"}

            {!isPublishing && (
              <span>↗</span>
            )}
          </button>

          <button
            type="button"
            className="icon-button"
            aria-label="More article actions"
            disabled={isPublishing}
          >
            •••
          </button>
        </div>
      </header>

      {/* ================================================== */}
      {/* LAYOUT */}
      {/* ================================================== */}

      <div className="article-management__layout">
        {/* ================================================= */}
        {/* MAIN EDITOR */}
        {/* ================================================= */}

        <section className="article-management__main">
          <div className="title-field">
            <input
              maxLength={120}
              value={article.title}
              onChange={(event) =>
                update({
                  title:
                    event.target.value,

                  slug:
                    article.slug ||
                    slugify(
                      event.target.value
                    ),
                })
              }
              placeholder="Untitled article"
              aria-label="Article title"
            />

            <span>
              {article.title.length}/120
            </span>
          </div>

          <textarea
            className="excerpt-field"
            value={article.excerpt}
            onChange={(event) =>
              update({
                excerpt:
                  event.target.value,
              })
            }
            placeholder="Write a short description to help readers decide if this is for them…"
            maxLength={180}
            aria-label="Article excerpt"
          />

          <TipTapEditor
            value={article.body}
            onChange={(body) =>
              update({ body })
            }
            uploadImage={uploadImage}
            onWordCount={() => {}}
          />

          <footer className="editor-footer">
            <span>
              {wordCount.toLocaleString()} words
            </span>

            <span>·</span>

            <span>{readingTime}</span>

            <span className="editor-footer__hint">
              Changes save automatically
            </span>
          </footer>
        </section>

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="article-management__sidebar">
          {/* =============================================== */}
          {/* PUBLISHING */}
          {/* =============================================== */}

          <div className="sidebar-card">
            <div className="sidebar-card__heading">
              <h2>Publishing</h2>

              <StatusPill
                status={article.status}
              />
            </div>

            <label
              className="field-label"
              htmlFor="article-status"
            >
              Status
            </label>

                        <select
              id="article-status"
              className="field"
              value={article.status}
              onChange={(event) =>
                update({
                  status:
                    event.target.value,
                })
              }
              disabled={
                isPublishing ||
                (isWriterOnly && article.status === "published")
              }
            >
              {visibleStatusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            <label
              className="field-label"
              htmlFor="article-category"
            >
              Category{" "}
              <span aria-hidden="true">
                *
              </span>
            </label>

            <select
              id="article-category"
              className="field"
              value={
                article.category || ""
              }
              onChange={(event) =>
                update({
                  category:
                    event.target.value,
                })
              }
              disabled={
                isPublishing ||
                loadingCategories ||
                (!categoryError &&
                  categories.length === 0)
              }
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories…"
                  : categoryError
                  ? "Could not load categories"
                  : categories.length === 0
                  ? "No categories yet"
                  : "Select category"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            {categoryError && (
              <small className="field-help">
                {categoryError}{" "}

                <button
                  type="button"
                  className="button button--ghost"
                  onClick={fetchCategories}
                >
                  Retry
                </button>
              </small>
            )}

            <div className="slug-field">
              <span>/articles/</span>

              <input
                id="article-slug"
                value={article.slug}
                onChange={(event) =>
                  update({
                    slug: slugify(
                      event.target.value
                    ),
                  })
                }
                placeholder="your-article-slug"
                disabled={isPublishing}
              />
            </div>

            {/* FEATURED */}

            <label
              className="field-label"
              htmlFor="article-featured"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                cursor: isPublishing
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <input
                id="article-featured"
                type="checkbox"
                checked={
                  article.isFeatured
                }
                onChange={(event) =>
                  update({
                    isFeatured:
                      event.target.checked,
                  })
                }
                disabled={isPublishing}
              />

              <span>
                Feature this in Main Grid
              </span>
            </label>

            <small className="field-help">
              চেক করলে হোমপেজের
              সবচেয়ে ওপরে Featured হিসেবে
              দেখাবে। নতুন কোনো আর্টিকেল
              ফিচার করলে এটা automatically
              Text News-এ নেমে যাবে, এবং
              জায়গা শেষ হলে Main Grid থেকে
              বাদ পড়বে — তবে ক্যাটাগরি
              পেজে সবসময় থেকেই যাবে।
            </small>

            {/* VIDEO SECTION */}

            <label
              className="field-label"
              htmlFor="article-show-video"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                cursor: videoDetected
                  ? "pointer"
                  : "not-allowed",
                opacity: videoDetected
                  ? 1
                  : 0.6,
              }}
            >
              <input
                id="article-show-video"
                type="checkbox"
                checked={
                  article.showInVideoSection
                }
                disabled={
                  !videoDetected ||
                  isPublishing
                }
                onChange={(event) =>
                  update({
                    showInVideoSection:
                      event.target.checked,
                  })
                }
              />

              <span>
                Show in Video section
              </span>
            </label>

            <small className="field-help">
              {videoDetected
                ? "ভিডিও এমবেড শনাক্ত হয়েছে — চেক করলে হোমপেজের Video Gallery-তে এই আর্টিকেলটি দেখাবে।"
                : "এই আর্টিকেলে এখনো কোনো ইউটিউব ভিডিও এমবেড করা নেই, তাই এই অপশনটি বন্ধ আছে।"}
            </small>
          </div>

          {/* =============================================== */}
          {/* COVER IMAGE */}
          {/* =============================================== */}

          <div className="sidebar-card">
            <div className="sidebar-card__heading">
              <h2>Cover image</h2>
              <span className="muted">
                Optional
              </span>
            </div>

            {article.coverImage?.url ? (
              <div className="cover-preview">
                <img
                  src={
                    article.coverImage.url
                  }
                  alt={
                    article.coverImage.alt ||
                    ""
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    update({
                      coverImage: null,
                    })
                  }
                  disabled={isPublishing}
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="cover-empty">
                <span>▧</span>

                <strong>
                  Add a cover image
                </strong>

                <small>
                  Recommended 1600 × 900px
                </small>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={isPublishing}
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0];

                    if (file) {
                      addCoverImage(file);
                    }

                    /*
                     * Allow selecting the same
                     * file again later.
                     */
                    event.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {/* =============================================== */}
          {/* TAGS */}
          {/* =============================================== */}

          <div className="sidebar-card">
            <div className="sidebar-card__heading">
              <h2>Tags</h2>

              <span className="muted">
                {article.tags.length}/5
              </span>
            </div>

            <div className="tag-list">
              {article.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="tag-chip"
                  >
                    #{tag}

                    <button
                      type="button"
                      onClick={() =>
                        update({
                          tags:
                            article.tags.filter(
                              (item) =>
                                item !== tag
                            ),
                        })
                      }
                      aria-label={`Remove ${tag}`}
                      disabled={isPublishing}
                    >
                      ×
                    </button>
                  </span>
                )
              )}
            </div>

            <div className="tag-input-wrap">
              <input
                value={tagInput}
                onChange={(event) =>
                  setTagInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    ["Enter", ","].includes(
                      event.key
                    )
                  ) {
                    event.preventDefault();

                    addTag(tagInput);
                  }
                }}
                onBlur={() =>
                  addTag(tagInput)
                }
                placeholder="Add a tag…"
                disabled={
                  isPublishing ||
                  article.tags.length >= 5
                }
              />
            </div>

            <small className="field-help">
              Press Enter to add a tag
            </small>
          </div>

          {/* =============================================== */}
          {/* ARTICLE HEALTH */}
          {/* =============================================== */}

          <div className="sidebar-card sidebar-card--stats">
            <div className="sidebar-card__heading">
              <h2>Article health</h2>

              <span className="health-score">
                Good
              </span>
            </div>

            <div className="health-row">
              <span>
                Title clarity
              </span>

              <span className="health-indicator is-good">
                ●
              </span>
            </div>

            <div className="health-row">
              <span>
                Reading time
              </span>

              <strong>
                {readingTime}
              </strong>
            </div>

            <div className="health-row">
              <span>
                Accessibility
              </span>

              <span className="health-indicator is-good">
                ●
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* ================================================== */}
      {/* TOAST */}
      {/* ================================================== */}

      {toast && (
        <div
          className={`toast toast--${toast.type}`}
          role="status"
        >
          <span>
            {toast.type === "success"
              ? "✓"
              : "!"}
          </span>

          {toast.message}
        </div>
      )}
    </main>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default ArticleManagement;