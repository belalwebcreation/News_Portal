import { useState } from "react";
import CategoryTabs from "./CategoryTabs";
import LeftNewsItem from "./LeftNewsItem";

const data = {
    popular: [
        "প্রথম খবর",
        "দ্বিতীয় খবর",
        "তৃতীয় খবর",
        "চতুর্থ খবর",
        "পঞ্চম খবর"
    ],

    discussed: [
        "আলোচিত ১",
        "আলোচিত ২",
        "আলোচিত ৩",
        "আলোচিত ৪",
        "আলোচিত ৫"
    ],

    editor: [
        "সুন্দর ১",
        "সুন্দর ২",
        "সুন্দর ৩",
        "সুন্দর ৪",
        "সুন্দর ৫"
    ]
};

const LeftSidebar = () => {

    const [active, setActive] = useState("popular");

    return (

        <div>

            <CategoryTabs
                active={active}
                setActive={setActive}
            />

            {
                data[active].map((news, index) => (

                    <LeftNewsItem
                        key={index}
                        index={index + 1}
                        title={news}
                    />

                ))
            }

        </div>

    );

};

export default LeftSidebar;