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
    time: formatTimeAgoBn(item.publishedAt || item.createdAt),
    image: item.thumbnail?.media?.url || "",
    category: item.category?.name || "",       // ✅ badge-এর জন্য (আগে সবসময় ডিফল্ট দেখাচ্ছিল)
    categorySlug: item.category?.slug || "",    // ✅ নতুন — routing-এর জন্য দরকার
  };
}

export default normalizeNewsForHero;
