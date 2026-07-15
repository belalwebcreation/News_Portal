import FeaturedCard from "./FeaturedCard";
import BottomNewsCard from "./BottomNewsCard";

const featuredNews = {
    title: "বিশ্বকাপ ফুটবল ২০২৬ • মোমেন্ট অব দ্য ডে",
    image:
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200",
    time: "১০ মিনিট আগে",
};

const relatedNews = [
    {
        title: "মেসির দুর্দান্ত পারফরম্যান্সে জয়",
        image:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=900",
        time: "৩০ মিনিট আগে",
    },
    {
        title: "আর্জেন্টিনা নতুন রেকর্ড গড়লো",
        image:
            "https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=900",
        time: "১ ঘন্টা আগে",
    },
];

const CenterFeatured = () => {

    return (

        <div>

            {/* Category */}

            <div className="flex items-center gap-3 mb-5">

                <div className="w-4 h-4 rounded-full bg-blue-600"></div>

                <h2 className="text-3xl font-bold">
                    খেলা
                </h2>

            </div>

            {/* Featured */}

            <FeaturedCard news={featuredNews} />

            {/* Bottom Cards */}

            <div className="grid grid-cols-2 gap-5 mt-6">

                {relatedNews.map((item, index) => (

                    <BottomNewsCard
                        key={index}
                        news={item}
                    />

                ))}

            </div>

        </div>

    );
};

export default CenterFeatured;