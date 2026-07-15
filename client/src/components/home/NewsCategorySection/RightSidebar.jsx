import SmallNewsCard from "./SmallNewsCard";

const sidebarNews = [
    {
        title: "আর্জেন্টিনার দাপুটে জয়",
        image:
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600",
        time: "১ ঘণ্টা আগে",
    },
    {
        title: "মেসির নতুন রেকর্ড",
        image:
            "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=600",
        time: "২ ঘণ্টা আগে",
    },
    {
        title: "বিশ্বকাপ প্রস্তুতিতে ব্যস্ত দল",
        image:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600",
        time: "৩ ঘণ্টা আগে",
    },
    {
        title: "সেমিফাইনালের আগে বড় ধাক্কা",
        image:
            "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600",
        time: "৫ ঘণ্টা আগে",
    },
];

const RightSidebar = () => {
    return (
        <div>

            {sidebarNews.map((news, index) => (
                <SmallNewsCard
                    key={index}
                    news={news}
                />
            ))}

        </div>
    );
};

export default RightSidebar;