import ImageManager from "./ImageManager";
import { useSiteSettings } from "../../../../context/SiteSettingsContext";

const BannerManager = ({ onClose }) => {
  const { settings, refreshSettings } = useSiteSettings();

  return (
    <ImageManager
      title="Homepage Banner"
      uploadText="Upload Banner"
      currentImage={settings?.heroBannerImage || ""}
      currentVisibility={settings?.heroBannerVisible ?? true}
      uploadUrl="/api/site-settings/banner"
      fieldName="banner"
      settingsKey="heroBannerImage"
      visibilityKey="heroBannerVisible"
      recommendedSize="1200 × 120 px"
      maxFileSize={2}
      allowHide={true}
      allowDelete={true}
      allowLink={true}
      currentLink={settings?.heroBannerLink || ""}
      linkKey="heroBannerLink"
      linkLabel="Banner Link (Redirect URL)"
      linkPlaceholder="https://example.com"
      onSaveSuccess={refreshSettings}
      onClose={onClose}
    />
  );
};

export default BannerManager;