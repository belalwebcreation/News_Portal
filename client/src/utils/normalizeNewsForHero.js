import { formatTimeAgoBn } from "./formatTimeAgo";

// ⚠️ এই ফাইলটাই একমাত্র জায়গা যেখানে backend News document-এর raw field name
// (title / summary / thumbnail / createdAt ইত্যাদি) আর Hero card-গুলোর
// প্রত্যাশিত prop shape (id / title / description / time / image) এর মধ্যে
// mapping হয়। আসল News schema দেখার পর এখানেই সামান্য অ্যাডজাস্ট করলেই হবে —
// HeroCenter/HeroLeft/HeroRight/HeroSmallCard কিছুই ছোঁয়া লাগবে না।
export function normalizeNewsForHero(item) {
  if (!item) return null;

  return {
    id: item.slug || item._id,
    title: item.title || "",
    description: item.summary || "",
    // News.js মডেলে status "published" হলেই publishedAt সেট হয় (pre-save hook) —
    // সেটা না থাকলে (edge case) createdAt fallback হিসেবে ব্যবহার হবে।
    time: formatTimeAgoBn(item.publishedAt || item.createdAt),
    // thumbnail আসলে { media: ObjectId } sub-schema, populate হওয়ার পর
    // thumbnail.media একটা পূর্ণ Media document হয়ে যায় — তাই .media.url
    image: item.thumbnail?.media?.url || "",
  };
}

export default normalizeNewsForHero;
