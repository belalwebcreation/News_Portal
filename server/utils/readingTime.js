/**
 * Calculates word count from a string or Tiptap JSON content
 */
export const getWordCount = (content) => {
  if (!content) return 0;

  let text = "";

  if (typeof content === "string") {
    text = content;
  } else if (typeof content === "object") {
    // If it's a Tiptap JSON structure, extract text recursively
    const extractText = (node) => {
      if (!node) return;
      if (node.text) {
        text += node.text + " ";
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractText);
      }
    };
    extractText(content);
  }

  const words = text.trim().split(/\s+/);
  return text.trim() === "" ? 0 : words.length;
};

/**
 * Calculates reading time in minutes based on average reading speed (e.g., 200 words per minute)
 */
export const getReadingTime = (content) => {
  const words = getWordCount(content);
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes < 1 ? 1 : minutes; // Minimum 1 minute
};