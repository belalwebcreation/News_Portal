export function extractYoutubeVideo(html = "") {
  if (!html) return null;

  // data-youtube-video wrapper-এর ভেতরের iframe src থেকে videoId বের করা —
  // domain (youtube.com বা youtube-nocookie.com) যাই হোক না কেন কাজ করবে
  const match = html.match(
    /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{6,})/
  );
  if (!match) return null;

  const videoId = match[1];

  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

export default extractYoutubeVideo;