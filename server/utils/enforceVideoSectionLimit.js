import News from '../models/News.js';

const VIDEO_SECTION_LIMIT = 30;

/**
 * showInVideoSection: true থাকা published article-এর সংখ্যা ৩০-এর বেশি হলে,
 * সবচেয়ে পুরনো (publishedAt অনুযায়ী) গুলোর flag unset করে দেয়।
 * article নিজে কখনো delete হয় না — শুধু video section থেকে বাদ পড়ে,
 * category page-এ ঠিকই থেকে যায় (কারণ category filtering এই flag-এর
 * উপর নির্ভর করে না)।
 */
export async function enforceVideoSectionLimit(limit = VIDEO_SECTION_LIMIT) {
  const flaggedCount = await News.countDocuments({
    showInVideoSection: true,
    status: 'published',
  });

  if (flaggedCount <= limit) return;

  const excess = flaggedCount - limit;

  const oldestExcess = await News.find({
    showInVideoSection: true,
    status: 'published',
  })
    .sort({ publishedAt: 1, createdAt: 1 }) // সবচেয়ে পুরনো আগে
    .limit(excess)
    .select('_id');

  const idsToUnflag = oldestExcess.map((doc) => doc._id);

  if (idsToUnflag.length > 0) {
    await News.updateMany(
      { _id: { $in: idsToUnflag } },
      { $set: { showInVideoSection: false } }
    );
  }
}

export default enforceVideoSectionLimit;