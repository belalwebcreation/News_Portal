import { Link } from "react-router-dom";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import fallbackLogo from "../../../assets/logo.png";

const Logo = () => {
 

  
  const { settings, loading } = useSiteSettings();
   
 

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // যদি database-এ logo না থাকে তাহলে assets/logo.png দেখাবে

  
 const logoSrc =
  settings?.logo?.trim()
    ? settings.logo
    : fallbackLogo;


  // Default Visible
  const logoVisible = settings?.logoVisible ?? true;

  return (
    <Link
      to="/"
      className="flex items-center gap-4 select-none"
    >
      {logoVisible && (
        <img
          src={logoSrc}
          alt="Website Logo"
          className="w-16 h-16 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackLogo;
          }}
        />
      )}

      <div className="leading-tight">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-gray-900">
          {settings?.siteName || "রাজশাহী কলেজ"}
        </h1>

        <p className="text-sm lg:text-base font-semibold tracking-[4px] uppercase text-red-700">
          {settings?.siteTagline || "NEWS PORTAL"}
        </p>

        <span className="text-xs text-gray-500">
          সত্য • শিক্ষা • ক্যাম্পাস
        </span>
      </div>
    </Link>
  );
};

export default Logo;