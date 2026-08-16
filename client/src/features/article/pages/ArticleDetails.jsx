// src/features/pages/ArticleDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { newsService } from "../../../features/news/services/newsService";

import { sanitizeHtml } from "../../utills/sanitizeHtml";
import { useAuth } from "../../../context/AuthContext";

import ArticleHeader from "./components/ArticleHeader";
import ArticleHero from "./components/ArticleHero";
import ArticleMeta from "./components/ArticleMeta";
import ArticleContent from "./components/ArticleContent";
import ReadingProgress from "./components/ReadingProgress";
import RelatedArticles from "./components/RelatedArticles";
import '../../editor/styles.css';
import "./style.css";

import ScrollTop from "./components/ScrollTop";
import FloatingShareBar from "./components/FloatingShareBar";
import { useScrollRange } from "./hooks/useScrollRange";

const ArticleDetails = () => {
  const { slug } = useParams();
  const { hasRole } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { startRef, endRef, isVisible } = useScrollRange();

  const canSeeViews = hasRole("admin", "superadmin", "writer");

  // 1. Fetch Article Data
  useEffect(() => {
    if (!slug) return;

    let mounted = true;

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const news = await newsService.getSingleNews(slug);

        if (!mounted) return;

        if (!news) {
          throw new Error("Article not found.");
        }

        setArticle(news);

        document.title = `${news.title} | BelalWebCreation`;

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.message || "Failed to load article."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // 2. Trigger Anti-Spam View Counter Logic once article ID is available
  useEffect(() => {
    if (!article?._id) return;

    const storageKey = `viewed_article_${article._id}`;
    const alreadyViewedInSession = sessionStorage.getItem(storageKey);

    if (!alreadyViewedInSession) {
      sessionStorage.setItem(storageKey, "true");

      newsService
        .incrementView(article._id)
        .then((res) => {
          if (res?.views !== undefined) {
            setArticle((prev) => (prev ? { ...prev, views: res.views } : prev));
          }
        })
        .catch((err) => {
          console.error("Failed to increment view count:", err);
        });
    }
  }, [article?._id]);

  const articleHtml = useMemo(() => {
    return sanitizeHtml(article?.content || "");
  }, [article]);

  const metrics = useMemo(() => {
    if (!article) return null;

    return {
      words: article.wordCount,
      minutes: article.readingTime,
      views: canSeeViews ? article.views : undefined,
    };
  }, [article, canSeeViews]);

  const shareUrl = useMemo(() => {
    if (!article) return "";
    return `${window.location.origin}/articles/${article.slug}`;
  }, [article]);

  if (loading) {
    return (
      <section className="article-details loading dark:bg-ink dark:text-paper transition-colors duration-300">
        <div className="container">
          Loading article...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="article-details error dark:bg-ink dark:text-paper transition-colors duration-300">
        <div className="container">
          <h2>{error}</h2>
        </div>
      </section>
    );
  }

  if (!article) return null;

  return (
    <main className="article-details bg-paper dark:bg-ink dark:text-paper transition-colors duration-300">

      <ReadingProgress newsId={article._id} />

      <ArticleHeader article={article} />

      <ArticleMeta
        article={article}
        metrics={metrics}
      />

      <div className="article-hero-wrap relative">
        <ArticleHero article={article} />
      </div>

      <FloatingShareBar
        url={shareUrl}
        title={article.title}
        summary={article.summary}
      />

      {/* Sentinel: floating rail turns on once the hero has scrolled past this point */}
      <div ref={startRef} aria-hidden="true" />

      <section className="article-details__wrapper">
  <div className="container mx-auto px-10 sm:px-8">

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-x-12">
            <div className="min-w-0">
              <ArticleContent
                article={article}
                html={articleHtml}
              />
            </div>

            <aside className="mt-12 min-w-0 lg:sticky lg:top-24 lg:mt-0">
              <RelatedArticles
                article={article}
              />
            </aside>
          </div>

          {/* Sentinel: floating rail steps aside once we're this close to the end */}
          <div ref={endRef} aria-hidden="true" />

          <ScrollTop threshold={400} />

  
        </div>
      </section>

    </main>
  );
};

export default ArticleDetails;