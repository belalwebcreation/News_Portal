import { useEffect, useRef } from "react";
import { newsService } from "../services/newsService"; // adjust path as needed

/**
 * Custom Hook to increment article view count cleanly with session storage protection
 * @param {string} articleId 
 */
export const useArticleView = (articleId) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!articleId || hasTriggeredRef.current) return;

    const storageKey = `viewed_article_${articleId}`;
    const alreadyViewedInSession = sessionStorage.getItem(storageKey);

    // If not viewed in this browser session yet, increment view
    if (!alreadyViewedInSession) {
      hasTriggeredRef.current = true;
      sessionStorage.setItem(storageKey, "true");

      newsService.incrementView(articleId).catch((err) => {
        console.error("Failed to increment view:", err);
      });
    }
  }, [articleId]);
};