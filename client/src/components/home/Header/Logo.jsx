import { Link } from "react-router-dom";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import fallbackLogo from "../../../assets/logo.png";

const Logo = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="w-64 h-20 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  const logoSrc =
    settings?.logo?.trim()
      ? settings.logo
      : fallbackLogo;

  const logoVisible =
    settings?.logoVisible ?? true;

  return (
    <Link
      to="/"
      className="inline-flex items-center"
    >
      {logoVisible && (
        <img
          src={logoSrc}
          alt="Website Logo"
          className="
            h-32
            w-auto
            lg:h-42
            object-contain
            select-none
          "
          draggable={false}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackLogo;
          }}
        />
      )}
    </Link>
  );
};

export default Logo;