// src/features/pages/components/ReadingProgress.jsx
import '../../../editor/styles.css';
import { useEffect, useState } from "react";
import "../../pages/style.css";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
    };
  }, []);

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