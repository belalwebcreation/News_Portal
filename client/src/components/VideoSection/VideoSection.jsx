import { videoSectionData } from "../../data/videoSectionData";

import TopicBar from "./TopicBar";
import SectionTitle from "./SectionTitle";
import VideoSlider from "./VideoSlider";

const VideoSection = () => {
  return (
    <section className="max-w-7xl mx-auto py-12">
      {/* Topic Bar */}
      <TopicBar topics={videoSectionData.topics} />

      {/* Section Title */}
      <SectionTitle title="ভিডিও" />

      {/* Video Slider */}
      <VideoSlider videos={videoSectionData.videos} />
    </section>
  );
};

export default VideoSection;