// src/features/pages/components/ReadingProgress.jsx
import '../../../editor/styles.css';
import { useEffect, useRef, useState } from "react";
import "../../pages/style.css";

// পাথটা আপনার আসল ফোল্ডার স্ট্রাকচার অনুযায়ী মিলিয়ে নিন —
// newsService যেভাবে "features/news/services/newsService" থেকে
// আসে, profileService-ও সেরকম "features/.../services/profile.service"
// থেকে আসার কথা।
import profileService from "../../../../services/profileService";

const SAVE_INTERVAL_MS = 5000; // প্রতি ৫ সেকেন্ডের মধ্যে বারবার সেভ কল যাবে না
const SAVE_THRESHOLD = 5; // অন্তত ৫% না বাড়লে সেভ কল হবে না

// newsId prop হিসেবে পাস করতে হবে (ArticleDetails.jsx থেকে article._id)।
// এটা ছাড়া কোন আর্টিকেলের জন্য progress সেভ হচ্ছে সেটা backend জানতে
// পারবে না, তাই newsId না থাকলে এই কম্পোনেন্ট আগের মতোই শুধু bar দেখাবে,
// কোনো API কল করবে না।
const ReadingProgress = ({ newsId }) => {
  const [progress, setProgress] = useState(0);

  const lastSavedProgressRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const latestProgressRef = useRef(0);

  useEffect(() => {
    // আর্টিকেল পাল্টালে (নতুন slug-এ নেভিগেট করলে) কাউন্টার রিসেট
    lastSavedProgressRef.current = 0;
    lastSavedAtRef.current = 0;
    latestProgressRef.current = 0;
  }, [newsId]);

  useEffect(() => {
    const saveProgress = (value, { immediate = false } = {}) => {
      if (!newsId) return;
      if (value <= 0) return; // ০% অবস্থায় entry তৈরি করার দরকার নেই

      const now = Date.now();
      const enoughChange =
        Math.abs(value - lastSavedProgressRef.current) >= SAVE_THRESHOLD;
      const enoughTimePassed =
        now - lastSavedAtRef.current >= SAVE_INTERVAL_MS;

      if (!immediate && !enoughChange && !enoughTimePassed) return;

      lastSavedProgressRef.current = value;
      lastSavedAtRef.current = now;

      profileService
        .recordReadingHistory(newsId, Math.round(value))
        .catch((err) => {
          console.error('Failed to save reading progress:', err);
        });
    };

    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;

      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }

      const percentage = Math.min(
        100,
        Math.max(0, (scrollTop / scrollHeight) * 100)
      );

      setProgress(percentage);
      latestProgressRef.current = percentage;
      saveProgress(percentage);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
      // পেজ ছাড়ার আগে (বা আর্টিকেল পাল্টানোর আগে) শেষ progress-টা
      // জোর করে সেভ করা হচ্ছে — না হলে অল্প স্ক্রল করেই সরে গেলে
      // Continue Reading-এ entry-ই তৈরি হবে না
      saveProgress(latestProgressRef.current, { immediate: true });
    };
  }, [newsId]);

  return (
    <div className="reading-progress">
      <div
        className="reading-progress__bar"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
};

export default ReadingProgress;