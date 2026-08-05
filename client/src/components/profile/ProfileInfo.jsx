import {
  Phone,
  MapPin,
  Globe,
  GraduationCap,
} from "lucide-react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";

// ===============================
// SECTION EYEBROW (news-portal style section marker)
// ===============================

const SectionEyebrow = ({ label }) => (
  <div className="mb-3">
    <span className="block h-1 w-10 rounded-full bg-primary" />
    <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-base-content/50">
      {label}
    </p>
  </div>
);

// ===============================
// INFO ROW
// ===============================

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 sm:gap-4 sm:py-4 border-b border-base-300/70 last:border-b-0">
    <div className="flex-shrink-0 rounded-md bg-base-200 p-2 text-primary">
      <Icon size={18} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/50 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-0.5 break-words text-sm font-medium sm:text-base ${
          value ? "text-base-content" : "italic text-base-content/40"
        }`}
      >
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

// ===============================
// SOCIAL BUTTON
// ===============================

const SocialButton = ({ href, icon: Icon, label }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-base-300 px-3 py-2.5 transition-colors hover:border-primary hover:bg-base-200 sm:px-4 sm:py-3"
    >
      <span className="flex-shrink-0 rounded-md bg-base-200 p-2 text-primary transition-colors group-hover:bg-base-100">
        <Icon size={16} />
      </span>
      <span className="truncate text-sm font-medium text-base-content">
        {label}
      </span>
    </a>
  );
};

// ===============================
// LOADING SKELETON
// ===============================

const ProfileInfoSkeleton = () => (
  <div className="w-full">
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-8">
      <div className="space-y-6 sm:space-y-8 lg:col-span-2">
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-72 w-full" />
      </div>
      <div className="skeleton h-56 w-full lg:col-span-1" />
    </div>
  </div>
);

// ===============================
// PROFILE INFO
// ===============================
// Note: identity fields (name, username, role, verified badge, avatar,
// cover photo, email, joined date, bio preview) already live in the
// standalone ProfileHeader component rendered above the tabs in
// Profile.jsx. This component only covers what ProfileHeader doesn't:
// the fuller bio and the remaining contact/personal details.

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
          {/* About */}
          <section className="card border border-base-300/70 bg-base-100 shadow-sm">
            <div className="card-body p-5 sm:p-6 lg:p-8">
              <SectionEyebrow label="Profile" />

              <h2 className="font-serif text-2xl font-semibold text-base-content sm:text-3xl">
                About
              </h2>

              <p className="mt-4 max-w-prose text-sm leading-relaxed text-base-content/70 sm:text-base">
                {bio || "No biography has been added yet."}
              </p>
            </div>
          </section>

          {/* Personal Information */}
          <section className="card border border-base-300/70 bg-base-100 shadow-sm">
            <div className="card-body p-5 sm:p-6 lg:p-8">
              <SectionEyebrow label="Details" />

              <h2 className="font-serif text-2xl font-semibold text-base-content sm:text-3xl">
                Personal Information
              </h2>

              <div className="mt-4 sm:mt-6">
                <InfoRow icon={Phone} label="Phone" value={phone} />
                <InfoRow icon={MapPin} label="Address" value={address} />
                <InfoRow
                  icon={GraduationCap}
                  label="College / Institution"
                  value={college}
                />
                <InfoRow icon={Globe} label="Website" value={website} />
              </div>
            </div>
          </section>
        </div>

        {/* =========================
            SIDEBAR COLUMN
        ========================== */}
        <div className="lg:col-span-1">
          <aside className="lg:sticky lg:top-6">
            <section className="card border border-base-300/70 bg-base-100 shadow-sm">
              <div className="card-body p-5 sm:p-6 lg:p-8">
                <SectionEyebrow label="Connect" />

                <h2 className="font-serif text-2xl font-semibold text-base-content sm:text-3xl">
                  Social Links
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1">
                  <SocialButton
                    href={socialLinks.facebook}
                    icon={FaFacebook}
                    label="Facebook"
                  />
                  <SocialButton
                    href={socialLinks.twitter}
                    icon={FaXTwitter}
                    label="Twitter"
                  />
                  <SocialButton
                    href={socialLinks.linkedin}
                    icon={FaLinkedin}
                    label="LinkedIn"
                  />
                  <SocialButton
                    href={socialLinks.github}
                    icon={FaGithub}
                    label="GitHub"
                  />

                  {!hasSocialLinks && (
                    <p className="text-sm text-base-content/60 sm:col-span-2 lg:col-span-1">
                      No social links added.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
