import { newsSectionData } from "../../data/newsSectionData";

import LeftSidebar from "./LeftSidebar";
import MainGrid from "./MainGrid";
import RightSidebar from "./RightSidebar";

const NewsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-0 py-12">
  <div className="grid grid-cols-12 gap-8">
    <div className="col-span-12 lg:col-span-3 lg:border-r lg:pr-6 border-gray-200">
      <LeftSidebar news={newsSectionData.left} />
    </div>

    <div className="col-span-12 lg:col-span-6">
      <MainGrid
        featured={newsSectionData.featured}
        news={newsSectionData.center}
      />
    </div>

    <div className="col-span-12 lg:col-span-3 lg:border-l lg:pl-6 border-gray-200">
      <RightSidebar news={newsSectionData.right} />
    </div>
  </div>
</section>
  );
};

export default NewsSection;