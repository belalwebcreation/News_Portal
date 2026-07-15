import { Play } from "lucide-react";

const PlayButton = () => {
  return (
    <div
      className="
        absolute
        bottom-4
        left-4
        w-14
        h-14
        rounded-full
        bg-red-600
        flex
        items-center
        justify-center
        shadow-lg
        cursor-pointer
        transition-all
        duration-300
        hover:bg-red-700
        hover:scale-110
      "
    >
      <Play
        size={24}
        fill="white"
        className="text-white ml-1"
      />
    </div>
  );
};

export default PlayButton;