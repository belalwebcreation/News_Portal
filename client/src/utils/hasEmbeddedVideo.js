export function hasEmbeddedVideo(html = "") {
  if (!html) return false;
  return /data-youtube-video/i.test(html);
}

export default hasEmbeddedVideo;