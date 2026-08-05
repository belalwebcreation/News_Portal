import { useEffect, useRef } from "react";

/**
 * Shared behavior every modal in this dashboard should have:
 *  - Escape key closes it (but not while a save/delete is in-flight —
 *    closing mid-request would orphan any error message the request
 *    later sets, since the modal that would show it is already gone)
 *  - Background scroll is locked while the modal is open
 *  - Tab / Shift+Tab cycles within the modal instead of escaping to the
 *    page behind it
 *  - Focus moves into the modal on open and returns to whatever was
 *    focused before, on close
 *
 * Usage:
 *   const containerRef = useModalA11y({ onClose, loading, autoFocusRef });
 *   <div ref={containerRef} className="fixed inset-0 z-50 ...">
 */
export function useModalA11y({ onClose, loading, autoFocusRef }) {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  // loading/onClose সরাসরি effect-এর dependency করা হয়নি ইচ্ছাকৃতভাবে —
  // তাহলে loading টগল হওয়ার সময় scroll-lock/focus পুরো রিসেট হয়ে
  // flicker করবে। বদলে ref-এ latest value রাখা হচ্ছে, effect শুধু
  // mount/unmount-এ একবারই চলে।
  const loadingRef = useRef(loading);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      (autoFocusRef?.current || containerRef.current)?.focus?.();
    }, 0);

    const getFocusable = () => {
      if (!containerRef.current) return [];
      const nodes = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(nodes).filter((el) => !el.disabled);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (!loadingRef.current) onCloseRef.current?.();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
