import { formatBanglaRelativeTime } from "./formatTime";

export const mapNewsItem = (item) => {
  if (!item) return null;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    description: item.summary || "",
    image: item.thumbnail?.media?.url || "/default-news-thumbnail.jpg",
    time: formatBanglaRelativeTime(item.publishedAt || item.createdAt),
    views: item.views ?? 0,
  };
};

export const mapNewsList = (list = []) => list.map(mapNewsItem).filter(Boolean);