import { Play } from "lucide-react";

const PlayButton = () => {
  return (
    <div
      className="
        absolute
        inset-0
        m-auto
        w-14
        h-14
        rounded-full
        bg-red-600/90
        backdrop-blur-sm
        flex
        items-center
        justify-center
        shadow-2xl
        cursor-pointer
        transition-all
        duration-300
        group-hover:bg-red-600
        group-hover:scale-125
        group-hover:rotate-12
        shadow-red-950/40
      "
      role="button"
      aria-label="ভিডিও প্লে করুন"
    >
      <Play
        size={22}
        fill="white"
        className="text-white translate-x-0.5"
      />
      {/* Outer Pulse ring animation on card hover */}
      <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default PlayButton;