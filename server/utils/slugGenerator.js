import News from '../models/News.js';

// বাংলা বর্ণমালা (\u0980-\u09FF), ইংরেজি আলফানিউমেরিক এবং স্পেস/ড্যাশ বাদে সব রিমুভ
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * FIX (review item #5 — slug isn't SEO-friendly):
 * The old generator always appended a random hex token
 * ("messi-wins-2026-a9bc32"), which never looks clean in a URL.
 * Production news sites use a clean slug ("messi-wins-world-cup") and
 * only disambiguate on an ACTUAL collision, using -2, -3, ... — so this
 * generator only adds a suffix when the clean slug is already taken.
 *
 * `session` is optional but should be passed when called inside a
 * transaction so the uniqueness check sees uncommitted writes from the
 * same transaction consistently.
 */
export async function generateSeoSlug(title, { session } = {}) {
  const base = slugify(title || '') || 'news';
  let candidate = base;
  let counter = 2;

  let query = News.exists({ slug: candidate });
  if (session) query = query.session(session);

  while (await query) {
    candidate = `${base}-${counter}`;
    counter += 1;
    query = News.exists({ slug: candidate });
    if (session) query = query.session(session);
  }

  return candidate;
}
