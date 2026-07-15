import LeftSidebar from "./LeftSidebar";
import CenterFeatured from "./CenterFeatured";
import RightSidebar from "./RightSidebar";

const NewsCategorySection = () => {
    return (
        <section className="container mx-auto py-12">

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-3">
                    <LeftSidebar />
                </div>

                <div className="col-span-6">
                    <CenterFeatured />
                </div>

                <div className="col-span-3">
                    <RightSidebar />
                </div>

            </div>

        </section>
    );
};

export default NewsCategorySection;