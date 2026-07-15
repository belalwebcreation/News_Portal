import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopicBar = ({ topics }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      {/* Left Side */}
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <h3 className="font-semibold text-lg whitespace-nowrap">
          আলোচিত বিষয়:
        </h3>

        {/* Topics */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {topics.map((topic) => (
            <button
              key={topic.id}
              className="whitespace-nowrap px-5 py-2 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={scrollLeft}
          className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black cursor-pointer hover:text-white transition"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={scrollRight}
          className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black cursor-pointer hover:text-white transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopicBar;