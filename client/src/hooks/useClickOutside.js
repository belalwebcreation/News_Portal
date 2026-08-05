import { useEffect } from "react";

/**
 * Closes a menu/popover when the user clicks (or taps) outside `ref`'s
 * subtree, or presses Escape. Only attaches listeners while `active` is
 * true, so closed menus cost nothing.
 *
 * IMPORTANT: `ref` should wrap BOTH the trigger button and the menu
 * itself. That way clicking the trigger to toggle the menu never counts
 * as an "outside" click, so open/close doesn't race with itself.
 */
export const useClickOutside = (ref, onOutside, active = true) => {
  useEffect(() => {
    if (!active) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onOutside();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, onOutside, active]);
};