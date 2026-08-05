const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBanglaNumber(num) {
  return String(num)
    .split("")
    .map((char) => (/\d/.test(char) ? banglaDigits[Number(char)] : char))
    .join("");
}

// আপনার প্রজেক্টে যদি ইতিমধ্যে কোনো time-ago util থাকে (utills/readingTime.js এর
// পাশে), সেটা থাকলে এই ফাইলটার আর দরকার নেই — শুধু import path পাল্টে
// normalizeNewsForHero.js এ সেটা বসিয়ে দিলেই হবে।
export function formatTimeAgoBn(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "এইমাত্র";
  if (diffMin < 60) return `${toBanglaNumber(diffMin)} মিনিট আগে`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${toBanglaNumber(diffHour)} ঘণ্টা আগে`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${toBanglaNumber(diffDay)} দিন আগে`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${toBanglaNumber(diffMonth)} মাস আগে`;

  const diffYear = Math.floor(diffMonth / 12);
  return `${toBanglaNumber(diffYear)} বছর আগে`;
}

export default formatTimeAgoBn;
