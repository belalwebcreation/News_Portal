import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounced autosave hook.
 *
 * Important behavior:
 * - Typing করলে debounce করে save করবে
 * - Manual Save Draft করলে pending autosave timer cancel করবে
 * - একই সময়ে একাধিক save request চলতে দেবে না
 * - Latest value ধরে রাখবে
 * - Save successful হলে status = saved
 */
export function useAutoSave(
  value,
  onSave,
  { delay = 1400, enabled = true } = {}
) {
  const latestValue = useRef(value);
  const latestSave = useRef(onSave);

  const firstRender = useRef(true);
  const timer = useRef(null);

  // একটি save request চলছে কিনা
  const savingRef = useRef(false);

  // Save চলাকালীন নতুন value এলে সেটা পরে save করার জন্য
  const queuedValueRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Always keep latest references
  latestValue.current = value;
  latestSave.current = onSave;

  /**
   * Clear scheduled debounce timer
   */
  const clearTimer = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  /**
   * Actual save
   */
  const save = useCallback(
    async (nextValue = latestValue.current) => {
      if (!latestSave.current) {
        return null;
      }

      // যদি already save চলছে,
      // latest value queue করে রাখি।
      if (savingRef.current) {
        queuedValueRef.current = nextValue;
        return null;
      }

      savingRef.current = true;
      setStatus("saving");
      setError(null);

      try {
        const result = await latestSave.current(nextValue);

        setStatus("saved");
        setLastSavedAt(new Date());

        return result;
      } catch (saveError) {
        setStatus("error");

        const nextError =
          saveError instanceof Error
            ? saveError
            : new Error("Unable to save changes");

        setError(nextError);

        throw nextError;
      } finally {
        savingRef.current = false;

        // Save চলাকালীন নতুন change হলে
        // সর্বশেষ value আবার save করব।
        if (queuedValueRef.current !== null) {
          const queuedValue = queuedValueRef.current;

          queuedValueRef.current = null;

          // ছোট delay দিয়ে latest value save
          timer.current = window.setTimeout(() => {
            timer.current = null;

            save(queuedValue).catch(() => {});
          }, 300);
        }
      }
    },
    []
  );

  /**
   * Automatic debounced save
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    if (!enabled) {
      clearTimer();
      return undefined;
    }

    clearTimer();

    setStatus("pending");

    timer.current = window.setTimeout(() => {
      timer.current = null;

      save(value).catch(() => {});
    }, delay);

    return clearTimer;
  }, [value, delay, enabled, save, clearTimer]);

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      clearTimer();
      queuedValueRef.current = null;
    };
  }, [clearTimer]);

  /**
   * Manual Save Draft
   *
   * আগে pending autosave cancel হবে।
   */
  const saveNow = useCallback(
    async (nextValue = latestValue.current) => {
      clearTimer();

      queuedValueRef.current = null;

      return save(nextValue);
    },
    [clearTimer, save]
  );

  /**
   * Cancel pending autosave
   */
  const cancel = useCallback(() => {
    clearTimer();
    queuedValueRef.current = null;

    if (!savingRef.current) {
      setStatus("idle");
    }
  }, [clearTimer]);

  return {
    status,
    error,
    lastSavedAt,
    saveNow,
    cancel,
  };
}

export default useAutoSave;