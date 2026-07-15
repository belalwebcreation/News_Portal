const BottomNewsCard = ({ news }) => {

    return (

        <div className="group cursor-pointer">

            <img
                src={news.image}
                alt={news.title}
                className="w-full h-52 object-cover rounded-md transition duration-500 group-hover:scale-105"
            />

            <h3 className="mt-3 text-lg font-semibold leading-7 group-hover:text-red-600 transition">
                {news.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
                {news.time}
            </p>

        </div>

    );
};

export default BottomNewsCard;