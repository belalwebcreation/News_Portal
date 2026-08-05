import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Shared drag-to-reposition gesture for any image whose crop is driven by
 * CSS `object-position` (percentage-based, 0–100 on each axis).
 *
 * Attach the returned handler to the image's `onPointerDown` as
 * `(event) => dragStart(event, isActive)`, where `isActive` gates whether
 * the gesture should run (e.g. only while in "reposition" mode).
 *
 * Listens on `window` rather than the element itself so the drag keeps
 * tracking even if the pointer leaves the image mid-gesture.
 *
 * @param {Object} params
 * @param {React.RefObject<HTMLElement>} params.containerRef - element whose
 *   bounding box defines the 0–100% drag range.
 * @param {{x:number,y:number}} params.position - position at drag-start,
 *   used as a stable anchor for the whole gesture.
 * @param {(pos:{x:number,y:number}) => void} params.setDraftPosition -
 *   called with the next clamped {x,y} on every pointer move.
 */
export const usePositionDrag = ({ containerRef, position, setDraftPosition }) => {
  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (event, active) => {
    if (!active || !containerRef.current) return;
    event.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const startPosition = position;
    const startX = event.clientX;
    const startY = event.clientY;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setDraftPosition({
        x: clamp(startPosition.x - (dx / rect.width) * 100, 0, 100),
        y: clamp(startPosition.y - (dy / rect.height) * 100, 0, 100),
      });
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      cleanupRef.current = null;
    };

    cleanupRef.current = handleUp;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
};