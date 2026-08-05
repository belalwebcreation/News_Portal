export const I18N = {
  title: "Hero Section Manager",
  subtitle: "হোম পেজের প্রধান ব্যানার এবং ট্রিপল-কলাম লেআউট নিয়ন্ত্রণ করুন।",
  editBannerBtn: "Edit Hero Banner",
  addNewsToListBtn: "+ Add News to List",
  badges: {
    single: "Single News",
    featured: "Featured News",
    list: "List View",
  },
  slots: {
    left: "Left Column (National Slot)",
    center: "Center Column (Main Feature)",
    right: (count, max) => `Right Column List (${count}/${max})`,
  },
  emptyState: {
    left: {
      title: "কোনো সংবাদ সেট করা নেই!",
      description: "বাম কলামের ন্যাশনাল স্লটের জন্য একটি নতুন সংবাদ নির্বাচন অথবা তৈরি করুন।",
      buttonLabel: "সংবাদ যুক্ত করুন",
    },
    center: {
      title: "কোনো ফিচার্ড সংবাদ সেট করা নেই!",
      description: "মাঝের কলামের মেইন ফিচারের জন্য একটি প্রধান সংবাদ সিলেক্ট করুন।",
      buttonLabel: "ফিচার্ড সংবাদ যুক্ত করুন",
    },
    right: {
      title: "লিস্টে কোনো সংবাদ নেই!",
      description: "ডান কলামের তালিকার জন্য সংবাদ যোগ করুন (সর্বোচ্চ ৪টি সংবাদ রাখা যাবে)।",
      buttonLabel: "লিস্টে সংবাদ যোগ করুন",
    },
  }
};