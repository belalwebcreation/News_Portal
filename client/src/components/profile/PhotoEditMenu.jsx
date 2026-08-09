import { useEffect } from "react";

/**
 * Dropdown menu used by both the cover-photo and avatar "edit" triggers
 * (Facebook-style: one button → Choose / Upload / Reposition / Remove).
 *
 * Purely presentational — no state of its own. The parent owns open/close
 * state and click-outside handling via `useClickOutside` on a wrapper that
 * contains both the trigger button and this menu.
 *
 * items: {
 *   icon: LucideIcon,
 *   label: string,
 *   onClick: () => void,
 *   disabled?: boolean,   // greyed out, not clickable
 *   danger?: boolean,     // styled red (destructive action, e.g. Remove)
 *   divider?: boolean,    // draws a separator line above this item
 * }[]
 */
const PhotoEditMenu = ({ items, onClose, className = "" }) => {
  // Close on Escape — standard menu behaviour.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      // daisyUI's `base-100` is a solid, opaque theme token (not translucent),
      // so it stays safely readable over photos of any colour while still
      // tracking light/dark mode via `data-theme` — no fixed hex needed.
      className={`absolute right-0 top-full z-[100] mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-base-300 bg-base-100 py-1.5 text-base-content shadow-xl ring-1 ring-base-content/5 animate-[menu-in_0.12s_ease-out] ${className}`}
    >
      <style>{`
        @keyframes menu-in {
          from { opacity: 0; transform: scale(0.96) translateY(-2px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {items.map((item) => (
        <div key={item.label}>
          {item.divider && <div className="my-1 border-t border-base-200" />}
          <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            title={item.disabled ? "Coming soon" : undefined}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.();
              onClose?.();
            }}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium outline-none transition-colors ${
              item.disabled
                ? "cursor-not-allowed opacity-40"
                : item.danger
                ? "text-error hover:bg-error/10 focus-visible:bg-error/10"
                : "hover:bg-base-200 focus-visible:bg-base-200"
            }`}
          >
            <item.icon size={18} className="shrink-0" />
            <span className="flex-1">{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default PhotoEditMenu;