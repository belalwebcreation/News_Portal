import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Mail,
  CalendarDays,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Move,
  Check,
  Image as ImageIcon,
  Upload,
  LayoutDashboard,
  Home,
  Share2,
  Edit3,
  Globe,
  ShieldCheck,
  Eye,
  Bookmark,
  FileText,
} from "lucide-react";
import profileService from "../../services/profileService";
import { newsService } from "../../features/news/services/newsService";
import ProfileAvatar from "./ProfileAvatar";
import PhotoEditMenu from "./PhotoEditMenu";
import { usePositionDrag } from "../../hooks/usePositionDrag";
import { useClickOutside } from "../../hooks/useClickOutside";

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const DEFAULT_POSITION = { x: 50, y: 50 };

const formatJoinDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatWebsiteUrl = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

// ভিউ কাউন্ট সুন্দর করে ফরম্যাট করার হেল্পার (যেমন: 1200 -> 1.2K)
const formatViews = (views) => {
  if (views === undefined || views === null) return "0";
  if (typeof views === "number") {
    if (views >= 1000000) return (views / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (views >= 1000) return (views / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return views.toLocaleString("en-US");
  }
  return views;
};

const validateImageFile = (file) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please select a valid image file (JPG, PNG, WEBP or GIF)";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`;
  }
  return null;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizePosition = (position) => ({
  x: typeof position?.x === "number" ? clamp(position.x, 0, 100) : DEFAULT_POSITION.x,
  y: typeof position?.y === "number" ? clamp(position.y, 0, 100) : DEFAULT_POSITION.y,
});

const ProfileHeader = ({ profile, onRefresh, isOwnProfile = true }) => {
  const {
    name,
    username,
    email,
    role,
    avatar,
    coverPhoto,
    bio,
    isVerified,
    joinedAt,
    website,
    stats = {},
  } = profile || {};

  const authorId = profile?.id || profile?._id;

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);

  const [avatarPosition, setAvatarPosition] = useState(() => normalizePosition(avatar?.position));
  const [avatarDraftPosition, setAvatarDraftPosition] = useState(avatarPosition);
  const [isRepositioningAvatar, setIsRepositioningAvatar] = useState(false);
  const [savingAvatarPosition, setSavingAvatarPosition] = useState(false);

  const [coverPosition, setCoverPosition] = useState(() => normalizePosition(coverPhoto?.position));
  const [coverDraftPosition, setCoverDraftPosition] = useState(coverPosition);
  const [isRepositioningCover, setIsRepositioningCover] = useState(false);
  const [savingCoverPosition, setSavingCoverPosition] = useState(false);

  // 📰 ইউজারের প্রকাশিত আর্টিকেল কাউন্ট সেভ রাখার স্টেট
  const [publishedArticlesCount, setPublishedArticlesCount] = useState(null);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const coverInputRef = useRef(null);
  const statusTimeoutRef = useRef(null);
  const coverContainerRef = useRef(null);
  const coverMenuWrapperRef = useRef(null);

  useClickOutside(coverMenuWrapperRef, () => setIsCoverMenuOpen(false), isCoverMenuOpen);

  useEffect(() => {
    if (isRepositioningAvatar) return;
    const next = normalizePosition(avatar?.position);
    setAvatarPosition(next);
    setAvatarDraftPosition(next);
  }, [avatar?.position, isRepositioningAvatar]);

  useEffect(() => {
    if (isRepositioningCover) return;
    const next = normalizePosition(coverPhoto?.position);
    setCoverPosition(next);
    setCoverDraftPosition(next);
  }, [coverPhoto?.position, isRepositioningCover]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // ইউজারের published আর্টিকেলের সংখ্যা জানার জন্য API কল
  useEffect(() => {
    if (!authorId) {
      setArticlesLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setArticlesLoading(true);
        const res = await newsService.getAllNews({ author: authorId, status: "published" });
        const list = res?.data || res?.news || (Array.isArray(res) ? res : []);
        if (!cancelled) {
          const publishedList = list.filter((a) => !a.status || a.status === "published");
          setPublishedArticlesCount(publishedList.length);
        }
      } catch (err) {
        console.error("Error fetching articles count:", err);
      } finally {
        if (!cancelled) setArticlesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authorId]);

  const showStatus = (type, message) => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    setStatus({ type, message });
    statusTimeoutRef.current = setTimeout(() => setStatus(null), 4000);
  };

  const joined = formatJoinDate(joinedAt);
  const avatarUrl = avatarPreview || avatar?.url;
  const coverUrl = coverPreview || coverPhoto?.url;

  const coverDragStart = usePositionDrag({
    containerRef: coverContainerRef,
    position: coverDraftPosition,
    setDraftPosition: setCoverDraftPosition,
  });

  const handleAvatarChange = async (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      showStatus("error", validationError);
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);

    try {
      const updated = await profileService.uploadAvatar(file);
      setAvatarPosition(DEFAULT_POSITION);
      setAvatarDraftPosition(DEFAULT_POSITION);
      showStatus("success", "Avatar updated successfully");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to upload avatar");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showStatus("error", validationError);
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
    setCoverUploading(true);

    try {
      const updated = await profileService.uploadCoverPhoto(file);
      setCoverPosition(DEFAULT_POSITION);
      setCoverDraftPosition(DEFAULT_POSITION);
      showStatus("success", "Cover photo updated successfully");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to upload cover photo");
      setCoverPreview(null);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUploading(true);
    try {
      const updated = await profileService.removeAvatar();
      setAvatarPreview(null);
      setAvatarPosition(DEFAULT_POSITION);
      setAvatarDraftPosition(DEFAULT_POSITION);
      showStatus("success", "Avatar removed");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to remove avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveCover = async () => {
    setCoverUploading(true);
    try {
      const updated = await profileService.removeCoverPhoto();
      setCoverPreview(null);
      setCoverPosition(DEFAULT_POSITION);
      setCoverDraftPosition(DEFAULT_POSITION);
      showStatus("success", "Cover photo removed");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to remove cover photo");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSaveAvatarPosition = async () => {
    setSavingAvatarPosition(true);
    try {
      const updated = await profileService.updateAvatarPosition(avatarDraftPosition);
      setAvatarPosition(avatarDraftPosition);
      setIsRepositioningAvatar(false);
      showStatus("success", "Avatar position saved");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to save avatar position");
    } finally {
      setSavingAvatarPosition(false);
    }
  };

  const handleCancelAvatarReposition = () => {
    setAvatarDraftPosition(avatarPosition);
    setIsRepositioningAvatar(false);
  };

  const handleSaveCoverPosition = async () => {
    setSavingCoverPosition(true);
    try {
      const updated = await profileService.updateCoverPosition(coverDraftPosition);
      setCoverPosition(coverDraftPosition);
      setIsRepositioningCover(false);
      showStatus("success", "Cover photo position saved");
      onRefresh?.(updated);
    } catch (error) {
      showStatus("error", error.message || "Failed to save cover position");
    } finally {
      setSavingCoverPosition(false);
    }
  };

  const handleCancelCoverReposition = () => {
    setCoverDraftPosition(coverPosition);
    setIsRepositioningCover(false);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showStatus("success", "Profile link copied to clipboard!");
    } else {
      showStatus("error", "Failed to copy link");
    }
  };

  const shownAvatarPosition = isRepositioningAvatar ? avatarDraftPosition : avatarPosition;
  const shownCoverPosition = isRepositioningCover ? coverDraftPosition : coverPosition;

  const coverMenuItems = [
    {
      icon: ImageIcon,
      label: "Choose cover photo",
      disabled: true,
      onClick: () => {},
    },
    {
      icon: Upload,
      label: "Upload photo",
      onClick: () => coverInputRef.current?.click(),
    },
    {
      icon: Move,
      label: "Reposition",
      disabled: !coverUrl,
      onClick: () => setIsCoverMenuOpen(false) || setIsRepositioningCover(true),
    },
    {
      icon: Trash2,
      label: "Remove",
      disabled: !coverUrl,
      danger: true,
      divider: true,
      onClick: handleRemoveCover,
    },
  ];

  // API থেকে আর্টিকেল সংখ্যা পাওয়া গেলে সেটি দেখাবে, না হলে Profile Context/Stats-এর ব্যাকআপ ডাটা দেখাবে
  const articlesCount = publishedArticlesCount ?? stats.postsCount ?? stats.articlesCount ?? profile?.articlesCount ?? profile?.postsCount ?? 0;
  const rawTotalViews = stats.totalViews ?? stats.views ?? stats.viewsCount ?? profile?.totalViews ?? profile?.views ?? profile?.viewsCount ?? 0;
  const displayTotalViews = formatViews(rawTotalViews);
  const savedCount = stats.savedCount ?? profile?.savedCount ?? profile?.bookmarksCount ?? 0;

  return (
    <section className="relative bg-base-200/40 pb-10 transition-colors">
      {/* Toast Notification */}
      {status && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            role="alert"
            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-2xl backdrop-blur-md border ${
              status.type === "success"
                ? "bg-slate-900/90 text-emerald-400 border-emerald-500/30"
                : "bg-slate-900/90 text-rose-400 border-rose-500/30"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        </div>
      )}

      {/* Hero Cover Photo Area */}
      <div className="relative">
        <div
          ref={coverContainerRef}
          className="relative h-56 sm:h-72 lg:h-[340px] w-full overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900"
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Cover"
              draggable={false}
              onPointerDown={(e) => coverDragStart(e, isRepositioningCover)}
              style={{
                objectPosition: `${shownCoverPosition.x}% ${shownCoverPosition.y}%`,
                touchAction: isRepositioningCover ? "none" : "auto",
              }}
              className={`h-full w-full select-none object-cover transition-opacity duration-300 ${
                isRepositioningCover ? "cursor-grab active:cursor-grabbing opacity-90" : ""
              }`}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-base-300/10 to-transparent" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {coverUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3 rounded-xl bg-base-100/90 px-4 py-2.5 shadow-xl">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-sm font-medium">Uploading cover...</span>
              </div>
            </div>
          )}

          {/* Reposition Mode Tooltip Hint */}
          {isRepositioningCover && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-xl">
              ✨ Drag to reposition
            </div>
          )}
        </div>

        {/* Home Navigation */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
          <Link
            to="/"
            aria-label="Go to homepage"
            title="Home"
            className="inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-xl border border-white/20 bg-black/35 hover:bg-black/50 text-white text-xs sm:text-sm font-medium backdrop-blur-xl shadow-xl transition-all duration-200 active:scale-95"
          >
            <Home size={15} className="shrink-0" />
            <span className="inline font-medium">Home</span>
          </Link>
        </div>

        {/* Cover Action Controls — শুধুমাত্র নিজের প্রোফাইলে দেখাবে */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
            {isRepositioningCover ? (
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/15 shadow-2xl">
                <button
                  type="button"
                  onClick={handleCancelCoverReposition}
                  disabled={savingCoverPosition}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCoverPosition}
                  disabled={savingCoverPosition}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-primary text-primary-content text-xs font-semibold shadow-lg shadow-primary/30 hover:bg-primary-focus active:scale-95 transition-all"
                >
                  {savingCoverPosition ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div ref={coverMenuWrapperRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCoverMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-white/20 bg-black/35 hover:bg-black/50 text-white text-xs sm:text-sm font-medium backdrop-blur-xl shadow-xl transition-all duration-200 active:scale-95"
                  disabled={coverUploading}
                  aria-haspopup="menu"
                  aria-expanded={isCoverMenuOpen}
                >
                  <Camera size={15} className="shrink-0" />
                  <span className="inline font-medium">Change Cover</span>
                </button>

                {isCoverMenuOpen && (
                  <PhotoEditMenu
                    items={coverMenuItems}
                    onClose={() => setIsCoverMenuOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {isOwnProfile && (
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        )}
      </div>

      {/* Main Glass Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="rounded-3xl border border-base-100/60 bg-base-100/90 dark:bg-base-100/95 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 sm:gap-6">
            
            {/* Avatar & Main Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
              
              {/* Profile Avatar Component */}
              <div className="-mt-16 sm:-mt-22 shrink-0 relative">
                <ProfileAvatar
                  src={avatarUrl}
                  alt={name || "Avatar"}
                  size="lg"
                  verified={isVerified}
                  editable={isOwnProfile}
                  uploading={avatarUploading}
                  position={shownAvatarPosition}
                  repositioning={isRepositioningAvatar}
                  savingPosition={savingAvatarPosition}
                  onFileSelect={handleAvatarChange}
                  onRemove={handleRemoveAvatar}
                  onStartReposition={() => setIsRepositioningAvatar(true)}
                  onCancelReposition={handleCancelAvatarReposition}
                  onSavePosition={handleSaveAvatarPosition}
                  onDraftPositionChange={setAvatarDraftPosition}
                />
              </div>

              {/* Title & Info */}
              <div className="pt-0 sm:pt-1 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-base-content tracking-tight">
                    {name || "Unnamed User"}
                  </h1>
                  
                  {isVerified && (
                    <span className="inline-flex items-center text-primary" title="Verified Author">
                      <ShieldCheck size={22} className="fill-primary/20" />
                    </span>
                  )}

                  {role && (
                    <span className="badge badge-primary badge-sm font-medium capitalize shadow-sm">
                      {role}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-xs sm:text-sm font-medium text-base-content/60">
                  @{username || "username"}
                </p>

                {bio && (
                  <p className="mt-2.5 max-w-xl text-[15px] sm:text-base leading-relaxed sm:leading-7 text-base-content/80 font-normal">
                    {bio}
                  </p>
                )}

                <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-xs sm:text-sm text-base-content/70">
                  {isOwnProfile && email && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
                      <Mail size={13} className="shrink-0" />
                      <span>Verified Email</span>
                    </div>
                  )}

                  {joined && (
                    <div className="inline-flex items-center gap-1.5 text-base-content/60">
                      <CalendarDays size={14} className="shrink-0" />
                      <span>Joined {joined}</span>
                    </div>
                  )}

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline max-w-[180px] sm:max-w-xs"
                    >
                      <Globe size={14} className="shrink-0" />
                      <span className="truncate">{formatWebsiteUrl(website)}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full lg:w-auto pt-2 lg:pt-0">
              {isOwnProfile && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-content font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary-focus hover:shadow-xl active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <LayoutDashboard size={18} className="shrink-0" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/dashboard/account-settings"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-4 sm:px-5 rounded-xl border border-base-300 bg-base-100 text-base-content font-semibold text-sm hover:border-base-content/20 hover:bg-base-200 active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Edit3 size={17} className="shrink-0" />
                    <span>Edit</span>
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleShareProfile}
                aria-label="Share profile"
                title="Share Profile"
                className="inline-flex items-center justify-center h-11 w-11 shrink-0 rounded-xl border border-base-300 bg-base-100 text-base-content/70 hover:text-base-content hover:bg-base-200 active:scale-[0.98] transition-all"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Author Stats Grid */}
          <div className={`mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-base-200/80 grid grid-cols-2 gap-3 sm:gap-4 ${isOwnProfile ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
            
            {/* Articles Count Block */}
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-base-200/40 border border-base-200/60 hover:bg-base-200/80 hover:border-primary/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-base-content truncate">
                  {articlesLoading ? (
                    <Loader2 size={16} className="animate-spin text-primary my-1" />
                  ) : (
                    articlesCount
                  )}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-base-content/60 truncate">
                  Published Articles
                </div>
              </div>
            </div>

            {/* Total Views Block */}
            <div 
              className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-base-200/40 border border-base-200/60 hover:bg-base-200/80 hover:border-primary/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default"
              title={typeof rawTotalViews === "number" ? `${rawTotalViews.toLocaleString()} total views` : `${displayTotalViews} total views`}
            >
              <div className="p-2 sm:p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Eye size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-base-content truncate">
                  {displayTotalViews}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-base-content/60 truncate">Total Views</div>
              </div>
            </div>

            {/* Saved Posts Block — শুধুমাত্র নিজের প্রোফাইলে (এটা personal preference, public visitor-দের দেখানোর দরকার নেই) */}
            {isOwnProfile && (
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-base-200/40 border border-base-200/60 hover:bg-base-200/80 hover:border-primary/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
                <div className="p-2 sm:p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                  <Bookmark size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-xl font-bold text-base-content truncate">{savedCount}</div>
                  <div className="text-[11px] sm:text-xs font-medium text-base-content/60 truncate">Saved Posts</div>
                </div>
              </div>
            )}

            {/* Member Block */}
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-base-200/40 border border-base-200/60 hover:bg-base-200/80 hover:border-primary/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Home size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-base-content truncate">
                  {joined || "2025"}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-base-content/60 truncate">Member</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;