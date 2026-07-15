const LeftNewsItem = ({ index, title }) => {

    return (

        <div className="flex gap-4 py-5 border-b">

            <span className="text-4xl text-gray-400 font-bold">
                {index}
            </span>

            <h3 className="font-medium">
                {title}
            </h3>

        </div>

    );

};

export default LeftNewsItem;