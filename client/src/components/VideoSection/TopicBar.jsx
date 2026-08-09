import { memo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopicBar = memo(({ topics = [], activeTopic, onTopicChange }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center mb-6 group/topic border-b border-slate-100 dark:border-gray-800 pb-3">
      
      {/* Left Arrow Button */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 z-10 bg-gradient-to-r from-slate-50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent p-1.5 pr-4 text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 cursor-pointer md:block hidden opacity-0 group-hover/topic:opacity-100 transition-opacity duration-300"
      >
        <ChevronLeft size={20} className="bg-white dark:bg-gray-800 rounded-full shadow-xs border border-slate-200 dark:border-gray-700" />
      </button>

      {/* 📜 ৩ ও ৪ নম্বর ভুল সংশোধন: স্ক্রলবল কন্টেইনার এবং ফ্লেক্স-shrink হ্যান্ডেল */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none w-full px-1"
      >
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicChange?.(topic.id)}
            className={`
              flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full 
              transition-all duration-300 cursor-pointer
              ${
                activeTopic === topic.id
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700"
              }
            `}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Right Arrow Button */}
      <button 
        onClick={scrollRight}
        className="absolute right-0 z-10 bg-gradient-to-l from-slate-50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent p-1.5 pl-4 text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 cursor-pointer md:block hidden opacity-0 group-hover/topic:opacity-100 transition-opacity duration-300"
      >
        <ChevronRight size={20} className="bg-white dark:bg-gray-800 rounded-full shadow-xs border border-slate-200 dark:border-gray-700" />
      </button>
    </div>
  );
});

TopicBar.displayName = "TopicBar";
export default TopicBar;