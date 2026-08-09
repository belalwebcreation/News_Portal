import {
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  User,
  Share2,
  ExternalLink,
} from "lucide-react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";

// ===============================
// SECTION EYEBROW (ProfileHeader Matching)
// ===============================
const SectionEyebrow = ({ label }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-primary to-indigo-500" />
    <span className="text-[11px] font-bold uppercase tracking-widest text-primary/90 dark:text-primary-content/80">
      {label}
    </span>
  </div>
);

// ===============================
// INFO ROW
// ===============================
const InfoRow = ({ icon: Icon, label, value, isLink = false }) => (
  <div className="flex items-start gap-3.5 py-3.5 sm:gap-4 border-b border-base-200 dark:border-base-800/60 last:border-b-0 transition-colors">
    <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary dark:bg-primary/20 dark:text-primary-content">
      <Icon size={18} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
        {label}
      </p>

      {isLink && value ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-primary hover:underline sm:text-base"
        >
          <span>{value}</span>
          <ExternalLink size={14} className="shrink-0" />
        </a>
      ) : (
        <p
          className={`mt-0.5 break-words text-sm font-semibold sm:text-base ${
            value ? "text-base-content" : "italic text-base-content/40 font-normal"
          }`}
        >
          {value || "Not provided"}
        </p>
      )}
    </div>
  </div>
);

// ===============================
// SOCIAL BUTTON
// ===============================
const SocialButton = ({ href, icon: Icon, label, colorClass }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3.5 rounded-2xl border border-base-200/80 dark:border-base-700/60 bg-base-100/60 dark:bg-base-200/30 p-3 sm:p-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-100 hover:shadow-md"
    >
      <div className={`flex-shrink-0 rounded-xl p-2.5 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
          {label}
        </span>
        <span className="block text-[11px] text-base-content/50 truncate font-mono">
          {href.replace(/^https?:\/\/(www\.)?/, "")}
        </span>
      </div>
      <ExternalLink size={14} className="text-base-content/30 group-hover:text-primary shrink-0 transition-colors" />
    </a>
  );
};

// ===============================
// LOADING SKELETON
// ===============================
const ProfileInfoSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-8">
      <div className="space-y-6 sm:space-y-8 lg:col-span-2">
        <div className="h-44 rounded-3xl bg-base-300/60" />
        <div className="h-80 rounded-3xl bg-base-300/60" />
      </div>
      <div className="h-72 rounded-3xl bg-base-300/60 lg:col-span-1" />
    </div>
  </div>
);

// ===============================
// PROFILE INFO
// ===============================
const ProfileInfo = ({ profile }) => {
  if (!profile) return <ProfileInfoSkeleton />;

  const {
    bio,
    phone,
    address,
    website,
    college,
    socialLinks = {},
  } = profile;

  const hasSocialLinks =
    socialLinks.facebook ||
    socialLinks.twitter ||
    socialLinks.linkedin ||
    socialLinks.github;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-8">
        
        {/* =========================
            MAIN COLUMN
        ========================== */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-2">
          
          {/* About Section */}
          <section className="rounded-3xl border border-base-200/80 dark:border-base-700/60 bg-base-100 shadow-xl p-6 sm:p-8 transition-colors">
            <SectionEyebrow label="Overview" />

            <div className="flex items-center gap-2.5">
              <User className="text-primary shrink-0" size={24} />
              <h2 className="font-serif text-2xl font-bold text-base-content sm:text-3xl tracking-tight">
                About Me
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-base-content/80 sm:text-base font-normal">
              {bio || "No biography has been added yet."}
            </p>
          </section>

          {/* Personal Information */}
          <section className="rounded-3xl border border-base-200/80 dark:border-base-700/60 bg-base-100 shadow-xl p-6 sm:p-8 transition-colors">
            <SectionEyebrow label="Details" />

            <h2 className="font-serif text-2xl font-bold text-base-content sm:text-3xl tracking-tight">
              Personal Information
            </h2>

            <div className="mt-4 sm:mt-6 divide-y divide-base-200 dark:divide-base-800/60">
              <InfoRow icon={Phone} label="Phone Number" value={phone} />
              <InfoRow icon={MapPin} label="Location / Address" value={address} />
              <InfoRow
                icon={GraduationCap}
                label="College / Institution"
                value={college}
              />
              <InfoRow icon={Globe} label="Website Portfolio" value={website} isLink />
            </div>
          </section>
        </div>

        {/* =========================
            SIDEBAR COLUMN
        ========================== */}
        <div className="lg:col-span-1">
          <aside className="lg:sticky lg:top-6">
            <section className="rounded-3xl border border-base-200/80 dark:border-base-700/60 bg-base-100 shadow-xl p-6 sm:p-8 transition-colors">
              <SectionEyebrow label="Connect" />

              <div className="flex items-center gap-2.5 mb-5">
                <Share2 className="text-primary shrink-0" size={22} />
                <h2 className="font-serif text-2xl font-bold text-base-content tracking-tight">
                  Social Links
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <SocialButton
                  href={socialLinks.facebook}
                  icon={FaFacebook}
                  label="Facebook"
                  colorClass="bg-blue-600"
                />
                <SocialButton
                  href={socialLinks.twitter}
                  icon={FaXTwitter}
                  label="Twitter / X"
                  colorClass="bg-slate-900 dark:bg-slate-800"
                />
                <SocialButton
                  href={socialLinks.linkedin}
                  icon={FaLinkedin}
                  label="LinkedIn"
                  colorClass="bg-sky-700"
                />
                <SocialButton
                  href={socialLinks.github}
                  icon={FaGithub}
                  label="GitHub"
                  colorClass="bg-slate-800 dark:bg-slate-900"
                />

                {!hasSocialLinks && (
                  <div className="rounded-2xl border border-dashed border-base-300 p-6 text-center text-sm text-base-content/50 sm:col-span-2 lg:col-span-1">
                    No social media profiles linked yet.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default ProfileInfo;