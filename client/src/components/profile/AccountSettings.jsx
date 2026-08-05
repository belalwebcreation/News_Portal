import { useEffect, useRef, useState, useCallback } from "react";
import {
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  User,
  AtSign,
  UserRound,
  FileText,
  Share2,
  ExternalLink,
  Info,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import profileService from "../../services/profileService";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";

const mapProfileToFormData = (profile) => ({
  name: profile?.name || "",
  username: profile?.username || "",
  email: profile?.email || "",
  phone: profile?.phone || "",
  address: profile?.address || "",
  bio: profile?.bio || "",
  website: profile?.website || "",
  occupation: profile?.occupation || "",
  college: profile?.college || "",
  socialLinks: {
    facebook: profile?.socialLinks?.facebook || "",
    twitter: profile?.socialLinks?.twitter || "",
    linkedin: profile?.socialLinks?.linkedin || "",
    github: profile?.socialLinks?.github || "",
  },
});

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;

// `profile`/`onRefresh` চাইলে বাইরে থেকে props হিসেবে দেওয়া যায় (embed করার জন্য),
// না দিলে কম্পোনেন্ট নিজে profileService.getProfile() দিয়ে ডেটা আনবে —
// তাই এটাকে সরাসরি route-এ বসানো যায়, আলাদা wrapper page লাগে না।
const AccountSettings = ({ profile: profileProp, onRefresh: onRefreshProp }) => {
  const [profile, setProfile] = useState(profileProp || null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(!profileProp);
  const [formData, setFormData] = useState(() => mapProfileToFormData(profileProp));
  const [initialData, setInitialData] = useState(() => mapProfileToFormData(profileProp));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const statusTimeoutRef = useRef(null);

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      showStatus("error", "Failed to load account settings. Please refresh.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // profile prop দেওয়া থাকলে সেটাই ব্যবহার হবে, না থাকলে নিজে fetch করবে
  useEffect(() => {
    if (profileProp) {
      setProfile(profileProp);
      setIsLoadingProfile(false);
      return;
    }
    loadProfile();
  }, [profileProp, loadProfile]);

  // caller নিজের onRefresh দিলে সেটাই, না দিলে internal loadProfile-ই refresh হিসেবে কাজ করবে
  const onRefresh = onRefreshProp || loadProfile;

  // Keep form synced whenever profile changes (from prop or self-fetch)
  useEffect(() => {
    if (!profile) return;
    const mapped = mapProfileToFormData(profile);
    setFormData(mapped);
    setInitialData(mapped);
  }, [profile]);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  if (isLoadingProfile && !profile) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="card border border-base-300 bg-base-100 shadow-sm rounded-2xl p-8">
          <div className="h-8 w-60 bg-base-300 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-base-200 rounded-md mb-8" />
          <div className="space-y-6">
            <div className="h-64 bg-base-200 rounded-2xl" />
            <div className="h-48 bg-base-200 rounded-2xl" />
            <div className="h-48 bg-base-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const showStatus = (type, message) => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    setStatus({ type, message });
    statusTimeoutRef.current = setTimeout(() => setStatus(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!formData.name.trim()) {
      next.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      next.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username.trim())) {
      next.username = "3-30 characters, letters, numbers and underscore only";
    }

    if (formData.website && !URL_REGEX.test(formData.website)) {
      next.website = "Enter a valid website URL";
    }

    if (formData.bio.length > 500) {
      next.bio = "Bio must be under 500 characters";
    }

    // Social Links URL Validation
    if (formData.socialLinks.facebook && !URL_REGEX.test(formData.socialLinks.facebook)) {
      next.facebook = "Enter a valid Facebook profile URL";
    }
    if (formData.socialLinks.twitter && !URL_REGEX.test(formData.socialLinks.twitter)) {
      next.twitter = "Enter a valid X (Twitter) profile URL";
    }
    if (formData.socialLinks.linkedin && !URL_REGEX.test(formData.socialLinks.linkedin)) {
      next.linkedin = "Enter a valid LinkedIn profile URL";
    }
    if (formData.socialLinks.github && !URL_REGEX.test(formData.socialLinks.github)) {
      next.github = "Enter a valid GitHub profile URL";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showStatus("error", "Please fix the highlighted fields above.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { email, ...payload } = formData;
      await profileService.updateProfile(payload);
      setInitialData(formData);
      showStatus("success", "Profile preferences saved successfully.");
      onRefresh?.();
    } catch (error) {
      showStatus("error", error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto transition-all duration-300 ease-in-out">
      <div className="card border border-base-300 bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="card-body p-6 sm:p-8 md:p-10">
          
          {/* Header */}
          <div className="mb-8 border-b border-base-300/80 pb-6">
            <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-base-content/60 leading-relaxed">
              Changes to your profile will be reflected across your published articles and author profile after saving.
            </p>
          </div>

          {/* Status Alert */}
          {status && (
            <div
              role="alert"
              className={`alert ${
                status.type === "success" ? "alert-success" : "alert-error"
              } mb-8 shadow-sm rounded-xl transition-all duration-200`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={20} className="shrink-0" />
              ) : (
                <AlertCircle size={20} className="shrink-0" />
              )}
              <span className="font-medium text-sm sm:text-base">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            
            {/* SECTION 1: Personal Information */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserRound size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-base-content">
                    Personal Information
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60">
                    Your core account identity and public contact details.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="name">
                    <span className="label-text font-medium text-xs sm:text-sm">
                      Full Name <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative flex items-center group">
                    <User size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.name ? "input-error" : ""
                      }`}
                      aria-invalid={!!errors.name}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.name}</p>
                  )}
                </div>

                {/* Username */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="username">
                    <span className="label-text font-medium text-xs sm:text-sm">
                      Username <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative flex items-center group">
                    <AtSign size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      aria-describedby="username-helper"
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.username ? "input-error" : ""
                      }`}
                      aria-invalid={!!errors.username}
                    />
                  </div>
                  {errors.username ? (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.username}</p>
                  ) : (
                    <p id="username-helper" className="text-xs text-base-content/50 mt-1.5 flex items-center gap-1">
                      <Info size={12} /> Unique handle for profile URL & mentions.
                    </p>
                  )}
                </div>

                {/* Email (Read Only + Dynamic Status) */}
                <div className="form-control w-full">
                  <div className="flex items-center justify-between pb-2">
                    <label className="label p-0" htmlFor="email">
                      <span className="label-text font-medium text-xs sm:text-sm flex items-center gap-1.5">
                        Email Address <Lock size={12} className="text-base-content/50" />
                      </span>
                    </label>
                    {profile?.isVerified ? (
                      <span className="badge badge-success badge-sm gap-1 font-medium text-xs text-success-content">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning badge-sm gap-1 font-medium text-xs text-warning-content">
                        Unverified
                      </span>
                    )}
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="input input-bordered h-12 w-full opacity-60 bg-base-200/60 cursor-not-allowed font-mono text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="phone">
                    <span className="label-text font-medium text-xs sm:text-sm">Phone Number</span>
                  </label>
                  <div className="relative flex items-center group">
                    <Phone size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                {/* Occupation */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="occupation">
                    <span className="label-text font-medium text-xs sm:text-sm">Occupation / Role</span>
                  </label>
                  <div className="relative flex items-center group">
                    <Briefcase size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="occupation"
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Senior Editor / Journalist"
                      className="input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                {/* College / Institution */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="college">
                    <span className="label-text font-medium text-xs sm:text-sm">
                      College / Institution
                    </span>
                  </label>
                  <div className="relative flex items-center group">
                    <GraduationCap
                      size={18}
                      className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none"
                    />
                    <input
                      id="college"
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="University of Dhaka"
                      className="input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="form-control w-full">
                  <div className="flex items-center justify-between pb-2">
                    <label className="label p-0" htmlFor="website">
                      <span className="label-text font-medium text-xs sm:text-sm">Personal Website</span>
                    </label>
                    {formData.website && !errors.website && (
                      <a
                        href={formData.website.startsWith("http") ? formData.website : `https://${formData.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <div className="relative flex items-center group">
                    <Globe size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.website ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.website && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Bio & Location */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-base-content">
                    About & Bio
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60">
                    Location details and public summary shown on your author card.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="address">
                    <span className="label-text font-medium text-xs sm:text-sm">Location / City</span>
                  </label>
                  <div className="relative flex items-center group">
                    <MapPin size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Dhaka, Bangladesh"
                      className="input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-control w-full">
                  <div className="flex items-center justify-between pb-2">
                    <label className="label p-0" htmlFor="bio">
                      <span className="label-text font-medium text-xs sm:text-sm">Biography</span>
                    </label>
                    <span
                      className={`badge font-mono text-xs ${
                        formData.bio.length > 500
                          ? "badge-error text-error-content"
                          : "badge-neutral badge-outline"
                      }`}
                    >
                      {formData.bio.length} / 500
                    </span>
                  </div>
                  <p id="bio-helper" className="text-xs text-base-content/50 mb-2">
                    Tell readers about yourself, your experience, and your area of journalistic focus.
                  </p>
                  <textarea
                    id="bio"
                    rows={4}
                    name="bio"
                    maxLength={500}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a brief overview..."
                    aria-describedby="bio-helper"
                    className={`textarea textarea-bordered min-h-36 w-full p-4 leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                      errors.bio ? "textarea-error" : ""
                    }`}
                  />
                  {errors.bio && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: Social Profiles */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Share2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-base-content">
                    Social Links
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60">
                    Connect your professional social channels for cross-platform engagement.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Facebook */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="facebook">
                    <span className="label-text font-medium text-xs sm:text-sm">Facebook Profile</span>
                  </label>
                  <div className="relative flex items-center group">
                    <FaFacebook size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="facebook"
                      type="url"
                      name="facebook"
                      placeholder="https://facebook.com/username"
                      value={formData.socialLinks.facebook}
                      onChange={handleSocialChange}
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.facebook ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.facebook && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.facebook}</p>
                  )}
                </div>

                {/* X / Twitter */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="twitter">
                    <span className="label-text font-medium text-xs sm:text-sm">X (Twitter) Profile</span>
                  </label>
                  <div className="relative flex items-center group">
                    <FaXTwitter size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="twitter"
                      type="url"
                      name="twitter"
                      placeholder="https://x.com/username"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialChange}
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.twitter ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.twitter && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.twitter}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="linkedin">
                    <span className="label-text font-medium text-xs sm:text-sm">LinkedIn Profile</span>
                  </label>
                  <div className="relative flex items-center group">
                    <FaLinkedin size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="linkedin"
                      type="url"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.socialLinks.linkedin}
                      onChange={handleSocialChange}
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.linkedin ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.linkedin && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.linkedin}</p>
                  )}
                </div>

                {/* GitHub */}
                <div className="form-control w-full">
                  <label className="label pb-2" htmlFor="github">
                    <span className="label-text font-medium text-xs sm:text-sm">GitHub Profile</span>
                  </label>
                  <div className="relative flex items-center group">
                    <FaGithub size={18} className="absolute left-3.5 text-base-content/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      id="github"
                      type="url"
                      name="github"
                      placeholder="https://github.com/username"
                      value={formData.socialLinks.github}
                      onChange={handleSocialChange}
                      className={`input input-bordered h-12 w-full pl-11 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none ${
                        errors.github ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.github && (
                    <p className="text-error text-xs font-medium mt-1.5">{errors.github}</p>
                  )}
                </div>
              </div>
            </div>

            {/* STICKY ACTION BAR */}
            <div className="sticky bottom-0 z-30 -mx-6 -mb-6 md:-mx-10 md:-mb-10 mt-10 p-4 sm:p-5 bg-base-100/80 backdrop-blur-md border-t border-base-300/80 flex items-center justify-between gap-4 rounded-b-2xl shadow-2xl transition-all">
              <div className="text-xs sm:text-sm text-base-content/70 hidden sm:flex items-center gap-2">
                {isDirty ? (
                  <span className="text-warning font-semibold flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20">
                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                    Unsaved changes pending
                  </span>
                ) : (
                  <span className="text-base-content/50 flex items-center gap-1.5 px-3 py-1">
                    <Sparkles size={14} className="text-primary" /> All changes synced
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-ghost hover:bg-base-200 font-medium"
                  disabled={isSubmitting || !isDirty}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="submit"
                  className="btn btn-primary px-6 min-w-[170px] shadow-md hover:shadow-lg transition-all font-semibold"
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;