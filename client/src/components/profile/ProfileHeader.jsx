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
  UserCheck,
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

  const articlesCount = publishedArticlesCount ?? stats.postsCount ?? stats.articlesCount ?? profile?.articlesCount ?? profile?.postsCount ?? 0;
  const rawTotalViews = stats.totalViews ?? stats.views ?? stats.viewsCount ?? profile?.totalViews ?? profile?.views ?? profile?.viewsCount ?? 0;
  const displayTotalViews = formatViews(rawTotalViews);
  const savedCount = stats.savedCount ?? profile?.savedCount ?? profile?.bookmarksCount ?? 0;

  return (
    <section className="relative bg-base-200/30 dark:bg-base-300/10 pb-12 transition-colors">
      {/* Dynamic Toast Notification */}
      {status && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            role="alert"
            className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold shadow-2xl border ${
              status.type === "success"
                ? "bg-base-100 text-emerald-600 border-emerald-500/30 dark:bg-slate-900 dark:text-emerald-400"
                : "bg-base-100 text-rose-600 border-rose-500/30 dark:bg-slate-900 dark:text-rose-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-rose-500 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        </div>
      )}

      {/* Cover Banner Area */}
      <div className="relative">
        <div
          ref={coverContainerRef}
          className="relative h-72 sm:h-96 lg:h-[420px] w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950"
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
                isRepositioningCover ? "cursor-grab active:cursor-grabbing opacity-85" : "opacity-95"
              }`}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-900/40 to-slate-950" />
          )}

          {/* Semi-transparent Overlay to boost readability without hiding dashboard */}
          <div className="pointer-events-none absolute inset-0 bg-black/25 backdrop-brightness-95" />

          {coverUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3 rounded-2xl bg-base-100/90 dark:bg-slate-900 px-5 py-3 shadow-2xl">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-sm font-semibold">Updating cover...</span>
              </div>
            </div>
          )}

          {/* Reposition Hint */}
          {isRepositioningCover && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-full bg-slate-900/90 border border-white/20 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
              ✨ Drag image to adjust frame
            </div>
          )}
        </div>

        {/* Floating Top Actions */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
          <Link
            to="/"
            aria-label="Go to homepage"
            title="Home"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-white/25 bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm font-medium backdrop-blur-md shadow-md transition-all active:scale-95"
          >
            <Home size={15} />
            <span className="font-medium hidden sm:inline">Portal Home</span>
          </Link>
        </div>

        {isOwnProfile && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
            {isRepositioningCover ? (
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-xl">
                <button
                  type="button"
                  onClick={handleCancelCoverReposition}
                  disabled={savingCoverPosition}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCoverPosition}
                  disabled={savingCoverPosition}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-content text-xs font-semibold shadow-md hover:bg-primary-focus transition-all"
                >
                  {savingCoverPosition ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div ref={coverMenuWrapperRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCoverMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-white/25 bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm font-medium backdrop-blur-md shadow-md transition-all active:scale-95"
                  disabled={coverUploading}
                >
                  <Camera size={15} />
                  <span>Edit Cover</span>
                </button>

                {isCoverMenuOpen && (
                  <PhotoEditMenu items={coverMenuItems} onClose={() => setIsCoverMenuOpen(false)} />
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

      {/* Profile Header Floating Overlay with Glassmorphism */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-28 sm:-mt-32 lg:-mt-36">
        <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            
            {/* Left Column: Avatar and User Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-5 sm:gap-6">
              
              {/* Profile Avatar */}
              <div className="shrink-0 relative z-10">
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

              {/* Author Title & Username */}
              <div className="pt-2 sm:pb-1 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                    {name || "Unnamed Journalist"}
                  </h1>
                  
                  {isVerified && (
                    <span
                      className="inline-flex items-center justify-center p-1 rounded-full bg-primary/20 text-primary-content"
                      title="Verified Author"
                    >
                      <ShieldCheck size={20} className="fill-primary" />
                    </span>
                  )}

                  {role && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/20 text-white border border-white/20 uppercase tracking-wider backdrop-blur-sm">
                      {role}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-medium text-white/80 drop-shadow-sm">
                  @{username || "username"}
                </p>
              </div>
            </div>

            {/* Right Column: Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0">
              {isOwnProfile && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-content font-medium text-sm shadow-lg hover:bg-primary-focus transition-all whitespace-nowrap active:scale-95"
                  >
                    <LayoutDashboard size={17} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/dashboard/account-settings"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-10 px-4 sm:px-5 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md font-medium text-sm transition-all whitespace-nowrap active:scale-95"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleShareProfile}
                aria-label="Share profile"
                title="Share Profile"
                className="inline-flex items-center justify-center h-10 w-10 shrink-0 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                <Share2 size={17} />
              </button>
            </div>
          </div>

          {/* Bio & Details Section */}
          <div className="mt-5 border-t border-white/15 pt-4">
            {bio && (
              <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-normal drop-shadow-sm">
                {bio}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-white/80">
              {isOwnProfile && email && (
                <div className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
                  <UserCheck size={15} />
                  <span>{email}</span>
                </div>
              )}

              {joined && (
                <div className="inline-flex items-center gap-1.5 text-white/70">
                  <CalendarDays size={15} />
                  <span>Joined {joined}</span>
                </div>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-content hover:underline font-medium max-w-[220px] truncate"
                >
                  <Globe size={15} className="shrink-0" />
                  <span className="truncate">{formatWebsiteUrl(website)}</span>
                </a>
              )}
            </div>
          </div>

          {/* Author News Portal Metrics */}
          <div className={`mt-6 pt-6 border-t border-white/15 grid grid-cols-2 gap-3 sm:gap-4 ${isOwnProfile ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
            
            {/* Articles Published */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-2.5 rounded-xl bg-primary/20 text-white shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white leading-tight">
                  {articlesLoading ? (
                    <Loader2 size={16} className="animate-spin text-white my-1" />
                  ) : (
                    articlesCount
                  )}
                </div>
                <div className="text-xs font-medium text-white/70 truncate">Articles Published</div>
              </div>
            </div>

            {/* Total Reads / Views */}
            <div
              className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all"
              title={typeof rawTotalViews === "number" ? `${rawTotalViews.toLocaleString()} total reads` : `${displayTotalViews} total reads`}
            >
              <div className="p-2.5 rounded-xl bg-secondary/20 text-white shrink-0">
                <Eye size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white leading-tight">
                  {displayTotalViews}
                </div>
                <div className="text-xs font-medium text-white/70 truncate">Total Reads</div>
              </div>
            </div>

            {/* Saved Articles */}
            {isOwnProfile && (
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
                <div className="p-2.5 rounded-xl bg-accent/20 text-white shrink-0">
                  <Bookmark size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    {savedCount}
                  </div>
                  <div className="text-xs font-medium text-white/70 truncate">Bookmarks</div>
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                <CalendarDays size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white leading-tight truncate">
                  {joined || "2026"}
                </div>
                <div className="text-xs font-medium text-white/70 truncate">Member Since</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;