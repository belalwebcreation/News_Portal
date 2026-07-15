import { useState } from "react";
import VideoGrid from "./VideoGrid";
import PaginationDots from "./PaginationDots";
import { AnimatePresence, motion } from "framer-motion";

const VideoSlider = ({ videos }) => {
  const cardsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalPages = Math.ceil(videos.length / cardsPerPage);

  const startIndex = currentPage * cardsPerPage;

  const currentVideos = videos.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div>
      <AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentPage}
    custom={direction}
    variants={{
      enter: (direction) => ({
        x: direction > 0 ? 120 : -120,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction) => ({
        x: direction > 0 ? -120 : 120,
        opacity: 0,
      }),
    }}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{
      duration: 0.45,
      ease: "easeInOut",
    }}
  >
    <VideoGrid videos={currentVideos} />
  </motion.div>
</AnimatePresence>

      <PaginationDots
  totalPages={totalPages}
  currentPage={currentPage}
  onPageChange={(page) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  }}
/>
    </div>
  );
};

export default VideoSlider;