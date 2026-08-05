export const I18N = {
  title: "সর্বশেষ সংবাদ বিন্যাস (Latest News Layout)",
  subtitle: "হোমপেজের 'সর্বশেষ সংবাদ' গ্রিডের বাম, কেন্দ্র এবং ডান পাশের স্লটগুলো নিয়ন্ত্রণ করুন।",
  
  zones: {
    left: "বাম পার্শ্বদণ্ড (Left Sidebar)",
    center: "মূল কেন্দ্রস্থল (Center Content)",
    right: "ডান পার্শ্বদণ্ড (Right Sidebar)"
  },
  
  slots: {
    // Left Sidebar
    leftFeatured: "বাম ফিচার্ড সংবাদ (১টি)",
    leftImageNews: (count, max) => `বাম চিত্র সংবাদ (${count}/${max})`,
    leftTextNews: (count, max) => `বাম টেক্সট সংবাদ (${count}/${max})`,
    
    // Center Content
    centerFeatured: "কেন্দ্রীয় প্রধান ফিচার্ড (১টি)",
    centerCardNews: (count, max) => `কেন্দ্রীয় কার্ড সংবাদ (${count}/${max})`,
    centerTextNews: (count, max) => `কেন্দ্রীয় টেক্সট তালিকা (${count}/${max})`,
    
    // Right Sidebar
    rightNews: (count, max) => `ডানপার্শ্বস্থ চিত্র সংবাদ (${count}/${max})`
  },
  
  buttons: {
    addNews: "সংবাদ যুক্ত করুন"
  },
  
  emptyStates: {
    leftFeatured: {
      title: "বাম ফিচার্ড সংবাদ খালি",
      description: "বাম কলামের শীর্ষে একটি বড় ইমেজসহ মূল সংবাদ প্রদর্শন করতে এখানে সংবাদ যুক্ত করুন।"
    },
    leftImageNews: {
      title: "বাম চিত্র সংবাদ তালিকা খালি",
      description: "বাম কলামের মাঝে ছবিসহ ছোট নিউজগুলো দেখানোর জন্য সংবাদ যুক্ত করুন।"
    },
    leftTextNews: {
      title: "বাম টেক্সট সংবাদ তালিকা খালি",
      description: "বাম কলামের নিচের অংশে কেবল শিরোনামের টেক্সট লিংকগুলো দেখানোর জন্য সংবাদ যুক্ত করুন।"
    },
    centerFeatured: {
      title: "কেন্দ্রীয় প্রধান ফিচার্ড সংবাদ খালি",
      description: "হোমপেজের মূল আকর্ষণে বড় ব্যানার স্টাইলের প্রধান সংবাদটি দিতে এখানে সংবাদ যুক্ত করুন।"
    },
    centerCardNews: {
      title: "কেন্দ্রীয় কার্ড গ্রিড খালি",
      description: "কেন্দ্রীয় ফিডের চার কোণার গ্রিড লেআউটে দেখানোর জন্য সংবাদ যুক্ত করুন।"
    },
    centerTextNews: {
      title: "কেন্দ্রীয় টেক্সট গ্রিড খালি",
      description: "কেন্দ্রীয় ফিডের নিচের অংশের ছোট টেক্সট তালিকাগুলোর জন্য সংবাদ যুক্ত করুন।"
    },
    rightNews: {
      title: "ডান চিত্র সংবাদ তালিকা খালি",
      description: "ডান কলামে ছবিসহ নিউজ কার্ডগুলো দেখানোর জন্য এখানে সংবাদ যুক্ত করুন।"
    }
  }
};