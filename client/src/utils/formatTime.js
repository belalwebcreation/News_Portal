const UNITS = [
  { label: "বছর", seconds: 31536000 },
  { label: "মাস", seconds: 2592000 },
  { label: "সপ্তাহ", seconds: 604800 },
  { label: "দিন", seconds: 86400 },
  { label: "ঘণ্টা", seconds: 3600 },
  { label: "মিনিট", seconds: 60 },
];

const toBanglaDigits = (num) =>
  String(num).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export const formatBanglaRelativeTime = (dateInput) => {
  if (!dateInput) return "";

  const seconds = Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000);
  if (seconds < 60) return "এইমাত্র";

  for (const unit of UNITS) {
    const count = Math.floor(seconds / unit.seconds);
    if (count >= 1) return `${toBanglaDigits(count)} ${unit.label} আগে`;
  }

  return "এইমাত্র";
};