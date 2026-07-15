const SmallNewsCard = ({ news }) => {
    return (
        <div className="flex gap-3 pb-4 mb-4 border-b group cursor-pointer">

            <img
                src={news.image}
                alt={news.title}
                className="w-28 h-20 object-cover rounded-md transition duration-500 group-hover:scale-105"
            />

            <div className="flex-1">

                <h3 className="font-semibold leading-6 transition group-hover:text-red-600">
                    {news.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                    {news.time}
                </p>

            </div>

        </div>
    );
};

export default SmallNewsCard;