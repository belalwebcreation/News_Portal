import VideoCard from "./VideoCard";

const VideoGrid = ({ videos, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </div>
  );
};

export default VideoGrid;