import ImageManager from "./ImageManager";
import { useSiteSettings } from "../../../../context/SiteSettingsContext";

const LogoManager = () => {
  const { settings, refreshSettings } = useSiteSettings();

  return (
    <ImageManager
      title="Website Logo"
      uploadText="Upload Logo"
      currentImage={settings?.logo || ""}
      currentVisibility={settings?.logoVisible ?? true}
      uploadUrl="/api/site-settings/logo"
      fieldName="logo"
      recommendedSize="300 × 80 px"
      maxFileSize={2}
      allowHide={true}
      allowDelete={true}
      onSaveSuccess={refreshSettings}
    />
  );
};

export default LogoManager;