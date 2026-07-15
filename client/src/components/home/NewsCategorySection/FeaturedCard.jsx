const FeaturedCard = ({ news }) => {
    return (
        <div className="relative overflow-hidden rounded-lg group cursor-pointer">

            <img
                src={news.image}
                alt={news.title}
                className="w-full h-[420px] object-cover transition duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 text-white">

                <h2 className="text-3xl font-bold leading-snug group-hover:text-yellow-400 transition">
                    {news.title}
                </h2>

                <p className="mt-2 text-sm text-gray-300">
                    {news.time}
                </p>

            </div>

        </div>
    );
};

export default FeaturedCard;