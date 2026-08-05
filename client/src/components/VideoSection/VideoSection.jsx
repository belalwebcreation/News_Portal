import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import useVideoSectionData from "../../hooks/useVideoSectionData";
import TopicBar from "./TopicBar";
import FeaturedVideoCard from "./FeaturedVideoCard";
import VideoSlider from "./VideoSlider";

const VideoSection = () => {
  const { videos, topics, loading, error } = useVideoSectionData();
  const [activeTopic, setActiveTopic] = useState("all");

  const filteredVideos = useMemo(() => {
    if (activeTopic === "all") return videos;
    return videos.filter((video) => video.category === activeTopic);
  }, [videos, activeTopic]);

  const featuredVideo = filteredVideos[0];
  const sliderVideos = useMemo(
    () => filteredVideos.slice(1),
    [filteredVideos]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 shadow-sm p-4 sm:p-5 xl:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-7 w-52 rounded bg-neutral-200" />

            <div className="h-10 w-full rounded-xl bg-neutral-100" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="h-[420px] rounded-2xl bg-neutral-100" />
              <div className="lg:col-span-3 h-[420px] rounded-2xl bg-neutral-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || videos.length === 0) {
    return null;
  }

  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">

      <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 shadow-sm p-4 sm:p-5 xl:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 mb-8">

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full bg-red-600" />

            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                ভিডিও গ্যালারি
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                সর্বশেষ ভিডিও সংবাদ ও প্রতিবেদন
              </p>
            </div>
          </div>

          <TopicBar
            topics={topics}
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
          />

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-6 lg:gap-8"
        >
          {/* Featured */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-3 lg:pr-6 lg:border-r lg:border-neutral-100"
          >
            {featuredVideo ? (
              <FeaturedVideoCard video={featuredVideo} />
            ) : (
              <div className="h-full min-h-[420px] flex items-center justify-center border border-dashed border-neutral-200 rounded-2xl">
                <p className="text-sm font-medium text-neutral-400">
                  এই ক্যাটাগরিতে কোনো প্রধান ভিডিও নেই।
                </p>
              </div>
            )}
          </motion.div>

          {/* Slider */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-9 flex flex-col justify-between"
          >
            {sliderVideos.length > 0 ? (
              <VideoSlider
                key={activeTopic}
                videos={sliderVideos}
              />
            ) : (
              <div className="min-h-[420px] flex items-center justify-center border border-dashed border-neutral-200 rounded-2xl">
                <p className="text-sm font-medium text-neutral-400">
                  কোনো অতিরিক্ত ভিডিও পাওয়া যায়নি।
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default VideoSection;