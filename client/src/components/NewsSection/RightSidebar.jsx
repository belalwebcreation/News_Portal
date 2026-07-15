const RightSidebar = ({ news }) => {
  return (
    <aside className="space-y-6">
      {news.map((item) => (
        <article
          key={item.id}
          className="border-b border-gray-200 pb-6 last:border-b-0"
        >
          {/* Image */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover rounded"
          />

          {/* Title */}
          <h3 className="mt-4 text-xl font-bold leading-snug hover:text-red-700 transition-colors cursor-pointer">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="mt-2 text-sm text-gray-600 leading-6">
              {item.description}
            </p>
          )}

          {/* Time */}
          <p className="mt-3 text-xs text-gray-500">
            {item.time}
          </p>
        </article>
      ))}
    </aside>
  );
};

export default RightSidebar;