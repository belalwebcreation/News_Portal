import { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  Move,
  Trash2,
  Check,
  X,
  Loader2,
  BadgeCheck,
  UserRound,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { usePositionDrag } from "../../hooks/usePositionDrag";
import { useClickOutside } from "../../hooks/useClickOutside";
import PhotoEditMenu from "./PhotoEditMenu";

const DEFAULT_POSITION = { x: 50, y: 50 };

const SIZE_MAP = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  table: "h-12 w-12", // 👈 Added for Table & Card list view
  md: "h-20 w-20",
  lg: "h-36 w-36 md:h-40 md:w-40",
  xl: "h-48 w-48",
};

const ICON_SIZE_MAP = {
  xs: 14,
  sm: 18,
  table: 22, // 👈 Added corresponding fallback icon size
  md: 28,
  lg: 48,
  xl: 64,
};

/**
 * Circular user avatar.
 *
 * Read-only by default — safe to drop anywhere (comment lists, nav bar,
 * mention chips): `<ProfileAvatar src={user.avatar?.url} size="sm" />`.
 *
 * Pass `editable` for the Facebook-style single camera button that opens
 * a Choose / Upload / Reposition / Remove menu. All actual network calls
 * stay in the parent — this component only renders state and reports
 * gestures via callbacks.
 */
const ProfileAvatar = ({
  src,
  alt = "Avatar",
  size = "lg",
  verified = false,
  editable = false,
  uploading = false,
  position = DEFAULT_POSITION,
  repositioning = false,
  savingPosition = false,
  onFileSelect,
  onRemove,
  onStartReposition,
  onCancelReposition,
  onSavePosition,
  onDraftPositionChange,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const menuWrapperRef = useRef(null);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  useClickOutside(menuWrapperRef, () => setMenuOpen(false), menuOpen);

  const dragStart = usePositionDrag({
    containerRef,
    position,
    setDraftPosition: onDraftPositionChange || (() => {}),
  });

  const handlePick = useCallback(() => {
    if (!repositioning) fileInputRef.current?.click();
  }, [repositioning]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFileSelect?.(file);
  };

  // Keyboard fallback while repositioning: arrow keys nudge 2%, shift+arrow 10%.
  const handleKeyDown = (e) => {
    if (!repositioning || !onDraftPositionChange) return;
    const step = e.shiftKey ? 10 : 2;
    const deltas = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const delta = deltas[e.key];
    if (!delta) return;
    e.preventDefault();
    onDraftPositionChange({
      x: Math.min(Math.max(position.x + delta.x, 0), 100),
      y: Math.min(Math.max(position.y + delta.y, 0), 100),
    });
  };

  const showImage = Boolean(src) && !imgError;
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.lg;
  const iconSize = ICON_SIZE_MAP[size] || ICON_SIZE_MAP.lg;

  const menuItems = [
    {
      icon: ImageIcon,
      label: "Choose profile picture",
      disabled: true,
      onClick: () => {},
    },
    onFileSelect && {
      icon: Upload,
      label: "Upload photo",
      onClick: () => {
        setMenuOpen(false);
        handlePick();
      },
    },
    onStartReposition && {
      icon: Move,
      label: "Reposition",
      disabled: !showImage,
      onClick: () => {
        setMenuOpen(false);
        onStartReposition();
      },
    },
    onRemove && {
      icon: Trash2,
      label: "Remove",
      disabled: !showImage,
      danger: true,
      divider: true,
      onClick: () => {
        setMenuOpen(false);
        onRemove();
      },
    },
  ].filter(Boolean);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative inline-block">
        {/* Main Avatar Container */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-full bg-base-200 transition-all duration-300 ${sizeClass} ${
            repositioning
              ? "ring-4 ring-primary shadow-2xl shadow-primary/25"
              : "ring-4 ring-base-100 shadow-xl"
          }`}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt}
              draggable={false}
              onError={() => setImgError(true)}
              onPointerDown={(e) => editable && dragStart(e, repositioning)}
              onClick={editable && !repositioning ? handlePick : undefined}
              tabIndex={editable && repositioning ? 0 : undefined}
              onKeyDown={handleKeyDown}
              aria-label={
                editable && repositioning
                  ? "Drag, or use arrow keys, to reposition the avatar"
                  : undefined
              }
              style={{
                objectPosition: `${position.x}% ${position.y}%`,
                touchAction: repositioning ? "none" : "auto",
              }}
              className={`h-full w-full select-none object-cover transition-opacity duration-200 ${
                editable
                  ? repositioning
                    ? "cursor-grab active:cursor-grabbing opacity-90"
                    : "cursor-pointer"
                  : ""
              }`}
            />
          ) : editable ? (
            <button
              type="button"
              onClick={handlePick}
              className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30 hover:text-base-content/50 transition-colors"
              aria-label="Upload avatar"
            >
              <UserRound size={iconSize} />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
              <UserRound size={iconSize} />
            </div>
          )}

          {verified && (
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-content ring-2 ring-base-100 shadow-md">
              <BadgeCheck size={14} />
            </span>
          )}

          {uploading && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center bg-base-100/60 backdrop-blur-sm"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <Loader2
                size={Math.round(iconSize * 0.55)}
                className="animate-spin text-primary"
              />
              <span className="sr-only">Uploading avatar…</span>
            </div>
          )}

          {/* Reposition Mode Tooltip Badge */}
          {editable && repositioning && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/20 shadow-md whitespace-nowrap">
              ✨ Drag or use arrows
            </div>
          )}
        </div>

        {/* Camera Edit Button Floating Badge */}
        {editable && !repositioning && !uploading && (
          <div ref={menuWrapperRef} className="absolute bottom-1 right-1 z-30">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-base-100 text-base-content/80 shadow-lg border border-base-300 transition-all hover:bg-base-200 hover:text-base-content hover:scale-105 active:scale-95"
              aria-label="Edit profile picture"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Camera size={16} />
            </button>

            {menuOpen && (
              <PhotoEditMenu items={menuItems} onClose={() => setMenuOpen(false)} />
            )}
          </div>
        )}

        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>

      {/* Modern Floating Glass Action Bar for Reposition Mode */}
      {editable && repositioning && (
        <div
          className="mt-3.5 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-xl border border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          role="group"
          aria-label="Avatar reposition controls"
        >
          <button
            type="button"
            onClick={onCancelReposition}
            disabled={savingPosition}
            className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <X size={13} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={onSavePosition}
            disabled={savingPosition}
            className="inline-flex items-center justify-center gap-1 h-8 px-3.5 rounded-xl bg-primary text-primary-content text-xs font-semibold shadow-md shadow-primary/30 hover:bg-primary-focus active:scale-95 transition-all"
          >
            {savingPosition ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            <span>Save</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;