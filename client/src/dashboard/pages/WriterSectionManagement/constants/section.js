// =========================================================
// ১. Hero সেকশনের নির্দিষ্ট কনফিগারেশন (max items, ইত্যাদি)
// =========================================================
export const HERO_CONFIG = {
  maxRightItems: 4,
};

// =========================================================
// ২. সাইটের লেআউট কনফিগারেশন (শুধুমাত্র News IDs এর ম্যাপিং)
// =========================================================
export const SECTION_LAYOUTS = {
  hero: {
    left: "news_1",        // reference to news id
    center: "news_2",      // reference to news id
    right: ["news_3", "news_4", "news_5", "news_6"], // references list
    banner: {
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1400&q=80",
      link: "#",
    },
  },
  sports: {
    main: "news_4",
    list: ["news_3", "news_5"],
  },
  // ভবিষ্যৎ অন্যান্য সেকশন...
};

// =========================================================
// ৩. সেন্ট্রালাইজড নিউজ ডাটা কালেকশন (সব নিউজ এখানে এক জায়গায় থাকবে)
// =========================================================
export const INITIAL_NEWS_POOL = {
  news_1: {
    id: "news_1",
    title: "রাজশাহী কলেজে নতুন শিক্ষাবর্ষের ওরিয়েন্টেশন অনুষ্ঠিত",
    description: "রাজশাহী কলেজে নবীন শিক্ষার্থীদের বরণ উপলক্ষে বর্ণাঢ্য অনুষ্ঠানের আয়োজন করা হয়েছে।",
    time: "৩০ মিনিট আগে",
    image: "https://picsum.photos/600/500?1",
    categorySlug: "national",
    isHidden: false,
  },
  news_2: {
    id: "news_2",
    title: "রাজশাহী কলেজে জাতীয় বিজ্ঞান মেলা শুরু হয়েছে",
    description: "শিক্ষার্থীদের উদ্ভাবনী প্রকল্প নিয়ে দুই দিনব্যাপী বিজ্ঞান মেলার উদ্বোধন করা হয়েছে।",
    time: "১ ঘণ্টা আগে",
    image: "https://picsum.photos/800/600?2",
    categorySlug: "education",
    isHidden: false,
  },
  news_3: {
    id: "news_3",
    title: "এইচএসসি পরীক্ষার রুটিন প্রকাশ",
    time: "২ ঘণ্টা আগে",
    image: "https://picsum.photos/300/200?3",
    categorySlug: "education",
    isHidden: false,
  },
  news_4: {
    id: "news_4",
    title: "রাজশাহী কলেজ আন্তঃবিভাগ ক্রিকেট টুর্নামেন্ট শুরু",
    time: "৩ ঘণ্টা আগে",
    image: "https://picsum.photos/300/200?4",
    categorySlug: "sports",
    isHidden: false,
  },
  news_5: {
    id: "news_5",
    title: "শিক্ষাবৃত্তির আবেদন শুরু",
    time: "৪ ঘণ্টা আগে",
    image: "https://picsum.photos/300/200?5",
    categorySlug: "education",
    isHidden: false,
  },
  news_6: {
    id: "news_6",
    title: "নতুন নোটিশ প্রকাশ করেছে কলেজ প্রশাসন",
    time: "৫ ঘণ্টা আগে",
    image: "https://picsum.photos/300/200?6",
    categorySlug: "national",
    isHidden: false,
  },
};