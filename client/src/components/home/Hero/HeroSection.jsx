import HeroBanner from "./components/HeroBanner";
import HeroLeft from "./components/HeroLeft";
import HeroCenter from "./components/HeroCenter";
import HeroRight from "./components/HeroRight";

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">

      {/* Advertisement Banner */}
      <HeroBanner />

      {/* Hero News Grid */}
      <div className="grid grid-cols-12 gap-6 mt-6">

        {/* Left News */}
        <div className="col-span-12 lg:col-span-3">
          <HeroLeft />
        </div>

        {/* Center Main News */}
        <div className="col-span-12 lg:col-span-5">
          <HeroCenter />
        </div>

        {/* Right News */}
        <div className="col-span-12 lg:col-span-4">
          <HeroRight />
        </div>

      </div>

    </section>
  );
};

export default HeroSection;