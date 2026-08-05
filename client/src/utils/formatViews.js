/**
 * Shortens numbers into readable K / M format (e.g. 1200 -> 1.2K)
 * @param {number} count 
 * @returns {string}
 */
export const formatViews = (count = 0) => {
  const num = Number(count) || 0;

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
};

/**
 * Bengali Numeral Formatter (Optional, if your portal is in Bengali)
 */
export const toBengaliNumber = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (digit) => banglaDigits[digit]);
};