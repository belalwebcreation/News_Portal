/**
 * FIX: this file already existed but was never actually used —
 * CategoryModal.jsx had its own INLINE `formatSlug` that stripped
 * everything not matching `\w` (ASCII word chars only). For a Bangla
 * category name like "রাজনীতি" that regex removes every character,
 * producing an EMPTY slug. This version whitelists the Bangla Unicode
 * block (\u0980-\u09FF) alongside \w, so Bangla names slugify correctly.
 * This is now the single source of truth for slug generation — import
 * this everywhere instead of writing a local copy.
 */
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF-]/g, "") // বাংলা ইউনিকোড ব্লক প্রিজার্ভ করে বাকি স্পেশাল ক্যারেক্টার রিমুভ
    .replace(/\s+/g, "-")                  // স্পেসের জায়গায় ড্যাশ (-)
    .replace(/-+/g, "-")                   // একাধিক ড্যাশ থাকলে ১টি ড্যাশ
    .replace(/^-+|-+$/g, "");              // শুরু/শেষে অবশিষ্ট ড্যাশ ছাঁটাই
};
