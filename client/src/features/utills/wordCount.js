/**
 * Text metrics for article content. The helpers accept either HTML or plain
 * text so they are safe to use with TipTap JSON/HTML and form previews.
 */

export function getTextFromHtml(value = '') {
  if (!value) return '';

  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    const document = new window.DOMParser().parseFromString(String(value), 'text/html');
    return (document.body?.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(value = '') {
  const text = getTextFromHtml(value);
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .length;
}

export function countCharacters(value = '', { includeSpaces = true } = {}) {
  const text = getTextFromHtml(value);
  return includeSpaces ? text.length : text.replace(/\s/gu, '').length;
}

export function getWordCount(value = '') {
  return countWords(value);
}

export function getCharacterCount(value = '', options) {
  return countCharacters(value, options);
}

export function getTextMetrics(value = '') {
  const text = getTextFromHtml(value);
  return {
    text,
    words: countWords(text),
    characters: text.length,
    charactersWithoutSpaces: text.replace(/\s/gu, '').length,
    paragraphs: text ? text.split(/\n+/u).filter(Boolean).length : 0,
  };
}

export default countWords;
