import { heroBanner } from "../data";

const HeroBanner = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg">

      <a
        href={heroBanner.link}
        target="_blank"
        rel="noreferrer"
      >
        <img
  src={heroBanner.image}
  alt="Hero Banner"
  className="
    w-full
    h-[90px]
    md:h-[110px]
    lg:h-[120px]
    object-cover
    object-center
    rounded-md
  "
/>
      </a>

    </div>
  );
};

export default HeroBanner;