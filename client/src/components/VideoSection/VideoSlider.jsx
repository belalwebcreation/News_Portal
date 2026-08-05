import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import { useVideoSlider } from "../../hooks/useVideoSlider";
import VideoGrid from "./VideoGrid";
import PaginationDots from "./PaginationDots";

const VideoSlider = ({ videos = [] }) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    currentPage,
    direction,
    totalPages,
    currentVideos,
    handlePageChange,
    handleMouseEnter,
    handleMouseLeave
  } = useVideoSlider(videos);

  // Subtle slide distance (40px) & reduced motion handling
  const slideOffset = prefersReducedMotion ? 0 : 40;

  return (
    <div className="w-full">
      <div className="overflow-hidden min-h-[260px] md:min-h-[320px] lg:min-h-[360px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={{
              enter: (dir) => ({
                x: dir > 0 ? slideOffset : -slideOffset,
                opacity: 0
              }),
              center: { x: 0, opacity: 1 },
              exit: (dir) => ({
                x: dir > 0 ? -slideOffset : slideOffset,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.8
            }}
          >
            <VideoGrid
              videos={currentVideos}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <PaginationDots
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default VideoSlider;