import { countWords } from './wordCount';

export function getReadingTime(value = '', wordsPerMinute = 220) {
  const words = countWords(value);
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / Math.max(1, wordsPerMinute)));
  return { words, minutes };
}

export function formatReadingTime(value = '', wordsPerMinute = 220) {
  const { minutes } = getReadingTime(value, wordsPerMinute);
  if (!minutes) return '0 min read';
  return `${minutes} min read`;
}

export default getReadingTime;
