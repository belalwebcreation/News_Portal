import { useSiteSettings } from "../../../../context/SiteSettingsContext";

const HeroBanner = () => {
  const { settings, loading } = useSiteSettings();

  const bannerImage = settings?.heroBannerImage || "";
  const bannerLink = settings?.heroBannerLink || "";
  const bannerVisible = settings?.heroBannerVisible ?? true;

  if (loading) {
    return (
      <div className="w-full h-[90px] md:h-[110px] lg:h-[120px] rounded-md bg-neutral-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  if (!bannerVisible || !bannerImage) {
    return null;
  }

 const image = (
  <img
    src={bannerImage}
    alt="Hero Banner"
    className="
      w-full
      h-full
      object-fill
      object-center
      rounded-md
    "
  />
);

  return (
    <div
      className="
        w-full
        h-[90px]
        md:h-[110px]
        lg:h-[120px]
        overflow-hidden
        rounded-lg
        bg-neutral-50
        dark:bg-gray-800
      "
    >
      {bannerLink ? (
        <a href={bannerLink} target="_blank" rel="noreferrer" className="block w-full h-full">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
};

export default HeroBanner;