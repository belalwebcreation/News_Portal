import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import ScrollTop from "../../features/article/pages/components/ScrollTop";
import { useSiteSettings } from "../../context/SiteSettingsContext"; // 🔻 path verify koro — ContentManagement.jsx-e ei-i depth chilo

// ==========================================================
// Custom SVG Social Icons (Matches Lucide stroke aesthetic)
// ==========================================================
function SocialIconBase({ size = 18, className = "", children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const FacebookIcon = (props) => (
  <SocialIconBase {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </SocialIconBase>
);

const XIcon = (props) => (
  <SocialIconBase {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </SocialIconBase>
);

const YoutubeIcon = (props) => (
  <SocialIconBase {...props}>
    <rect x="2" y="4" width="20" height="16" rx="4" />
    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
  </SocialIconBase>
);

const InstagramIcon = (props) => (
  <SocialIconBase {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </SocialIconBase>
);

// ==========================================================
// Default Data Configurations
// ==========================================================
const DEFAULT_CATEGORIES = [
  { name: "জাতীয়", slug: "national" },
  { name: "রাজনীতি", slug: "politics" },
  { name: "অর্থনীতি", slug: "economy" },
  { name: "আন্তর্জাতিক", slug: "international" },
  { name: "খেলাধুলা", slug: "sports" },
  { name: "বিনোদন", slug: "entertainment" },
  { name: "প্রযুক্তি", slug: "technology" },
  { name: "জীবনযাপন", slug: "lifestyle" },
];

const COMPANY_LINKS = [
  { name: "আমাদের সম্পর্কে", href: "/about" },
  { name: "সাংবাদিকতার নীতিমালা", href: "/editorial-standards" },
  { name: "ক্যারিয়ার", href: "/careers" },
  { name: "বিজ্ঞাপন দিন", href: "/advertise" },
];

const POLICY_LINKS = [
  { name: "গোপনীয়তা নীতি", href: "/privacy" },
  { name: "ব্যবহারের শর্তাবলী", href: "/terms" },
  { name: "সংশোধনী নীতি", href: "/corrections" },
  { name: "কুকি নীতি", href: "/cookies" },
];

// 🔻 Backend theke kono value na ashle (ba load hote hote) fallback hisebe eigula dekhabe —
// blank UI dekha jabe na. CMS-e actual value set korle eigula automatically override hoye jabe.
const FALLBACK = {
  siteName: "সংবাদ প্রবাহ",
  tagline: "নির্ভরযোগ্য খবর, প্রতিটি মুহূর্তে",
  aboutText:
    "স্বাধীন সাংবাদিকতা ও নির্ভুল তথ্য দিয়ে পাঠকের পাশে আছি ২৪ ঘণ্টা। পেশাদারিত্ব ও সততাই আমাদের মূল চালিকাশক্তি।",
  address: "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
  phone: "+৮৮০ ১৭০০-০০০০০০",
  email: "news@example.com",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

function Footer({
  editorName = "বেলাল হোসেন", // 🔻 CMS scope-e nai ekhono, tai prop hisebei thakche
  categories = DEFAULT_CATEGORIES,
}) {
  const [now, setNow] = useState(() => new Date());
  const { settings } = useSiteSettings();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const formattedNow = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(now);

  const siteName = settings?.siteName || FALLBACK.siteName;
  const tagline = settings?.tagline || FALLBACK.tagline;
  const aboutText = settings?.aboutText || FALLBACK.aboutText;
  const address = settings?.contactAddress || FALLBACK.address;
  const phone = settings?.contactPhone || FALLBACK.phone;
  const email = settings?.contactEmail || FALLBACK.email;

  const showFooterInfo = settings?.footerVisible ?? true;
  const showSocialLinks = settings?.socialLinksVisible ?? true;
  const showContact = settings?.contactVisible ?? true;

  const socialLinks = [
    { name: "Facebook", href: settings?.socialFacebook, Icon: FacebookIcon },
    { name: "X", href: settings?.socialX, Icon: XIcon },
    { name: "YouTube", href: settings?.socialYoutube, Icon: YoutubeIcon },
    { name: "Instagram", href: settings?.socialInstagram, Icon: InstagramIcon },
  ].filter((social) => social.href); // 🔻 URL set na thakle icon dekhabe na

  return (
    <footer style={bodyFont} className="relative bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
      <style>{FONT_IMPORT}</style>

      {/* Brand Top Red Accent Line */}
      <div className="h-1 w-full bg-red-600" />

      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] px-4 pt-12 pb-8 sm:px-6 lg:px-8">

        {/* ===================================================
            1. Main Footer Grid
            =================================================== */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-slate-200 dark:border-slate-800">

          {/* Col 1: Brand Info & Socials */}
          {showFooterInfo && (
            <div className="sm:col-span-2 lg:col-span-4">
              <Link to="/" className="inline-block">
                <span style={displayFont} className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                  {siteName}
                </span>
              </Link>
              <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wide">
                {tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
                {aboutText}
              </p>

              {/* Social Icons */}
              {showSocialLinks && socialLinks.length > 0 && (
                <div className="mt-6 flex items-center gap-2">
                  {socialLinks.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-600 hover:text-white dark:hover:border-red-500"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Col 2: Category Chips/Links */}
          <nav aria-label="বিভাগসমূহ" className="lg:col-span-3">
            <h4
              style={displayFont}
              className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 inline-block"
            >
              বিভাগসমূহ
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-500 hover:shadow-sm"
                >
                  <ChevronRight size={12} className="text-slate-400 dark:text-slate-500" />
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Col 3: Navigation Links */}
          <nav aria-label="প্রতিষ্ঠান ও নীতি" className="lg:col-span-2">
            <h4
              style={displayFont}
              className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 inline-block"
            >
              তথ্য ও নীতি
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-slate-600 dark:text-slate-400 transition-colors hover:text-red-600 dark:hover:text-red-500 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-600 dark:text-slate-400 transition-colors hover:text-red-600 dark:hover:text-red-500 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4: Contact Card */}
          {showContact && (
            <div className="lg:col-span-3">
              <h4
                style={displayFont}
                className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 inline-block"
              >
                যোগাযোগ
              </h4>
              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-xs space-y-3 text-slate-600 dark:text-slate-400 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-red-600 dark:text-red-500" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0 text-red-600 dark:text-red-500" />
                  <a href={`tel:${phone}`} className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0 text-red-600 dark:text-red-500" />
                  <a href={`mailto:${email}`} className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ===================================================
            2. Bottom Bar / Colophon (Newspaper Masthead Style)
            =================================================== */}
        <div className="pt-6 flex flex-col gap-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {now.getFullYear()} {siteName}। সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span>প্রকাশক ও সম্পাদক: <strong className="text-slate-800 dark:text-slate-200">{editorName}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2 py-1 rounded">
              {formattedNow}
            </span>
          </div>
        </div>

      </div>

      <ScrollTop/>
    </footer>
  );
}

export default Footer;