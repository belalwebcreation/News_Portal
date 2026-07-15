const CategoryTabs = ({ active, setActive }) => {

    return (

        <div className="flex border-b">

            <button
                onClick={() => setActive("popular")}
                className={`px-5 py-3 ${
                    active === "popular"
                        ? "border-b-2 border-red-600 text-red-600"
                        : ""
                }`}
            >
                পঠিত
            </button>

            <button
                onClick={() => setActive("discussed")}
                className={`px-5 py-3 ${
                    active === "discussed"
                        ? "border-b-2 border-red-600 text-red-600"
                        : ""
                }`}
            >
                আলোচিত
            </button>

            <button
                onClick={() => setActive("editor")}
                className={`px-5 py-3 ${
                    active === "editor"
                        ? "border-b-2 border-red-600 text-red-600"
                        : ""
                }`}
            >
                সুন্দর
            </button>

        </div>

    );

};

export default CategoryTabs;