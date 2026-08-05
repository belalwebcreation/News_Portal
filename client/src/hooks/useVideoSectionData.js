import { useEffect, useState } from "react";
import { videoService } from "../../src/features/video/videoService";
import { categoryService } from "../features/category/services/categoryService";

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "কিছুক্ষণ আগে";
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
  return `${Math.floor(diffHours / 24)} দিন আগে`;
}

function mapNewsToVideo(news) {
  return {
    id: news._id,
    slug: news.slug,
    title: news.title,
    description: news.summary,
    thumbnail: news.videoMeta?.thumbnail || news.thumbnail?.media?.url || null,
    embedUrl: news.videoMeta?.embedUrl,
    duration: null, // YouTube Data API ছাড়া reliably পাওয়া যায় না — card এ badge auto-hide হবে
    views: news.views,
    time: formatRelativeTime(news.publishedAt || news.createdAt),
    category: news.category?.slug,
  };
}

export function useVideoSectionData() {
  const [videos, setVideos] = useState([]);
  const [topics, setTopics] = useState([{ id: "all", name: "সব" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [videoRes, categoryRes] = await Promise.all([
          videoService.getVideoNews({ limit: 20 }),
          categoryService.getAllCategories(),
        ]);

        if (cancelled) return;

        const videoList = Array.isArray(videoRes) ? videoRes : videoRes?.data ?? [];
        const categoryList = Array.isArray(categoryRes) ? categoryRes : categoryRes?.data ?? [];

        setVideos(videoList.map(mapNewsToVideo));

        const usedSlugs = new Set(videoList.map((n) => n.category?.slug).filter(Boolean));
        const relevantTopics = categoryList
          .filter((cat) => cat.isActive && usedSlugs.has(cat.slug))
          .map((cat) => ({ id: cat.slug, name: cat.name }));

        setTopics([{ id: "all", name: "সব" }, ...relevantTopics]);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { videos, topics, loading, error };
}

export default useVideoSectionData;