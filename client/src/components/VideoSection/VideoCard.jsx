import PlayButton from "./PlayButton";

const VideoCard = ({ video }) => {
  return (
    <article className="group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={video.image}
          alt={video.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <PlayButton />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-bold leading-7 transition-colors group-hover:text-red-700">
        {video.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {video.description}
      </p>

      {/* Time */}
      <p className="mt-3 text-xs text-gray-500">
        {video.time}
      </p>
    </article>
  );
};

export default VideoCard;