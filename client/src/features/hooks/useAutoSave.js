import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Debounced persistence hook.
 *
 * Important guarantees:
 *
 * 1. Only the latest scheduled save is executed.
 * 2. cancel() invalidates pending/in-flight save cycles.
 * 3. A stale save cannot update the UI state after a newer save cycle.
 * 4. saveNow() can still be used for manual save.
 */
export function useAutoSave(
  value,
  onSave,
  {
    delay = 1400,
    enabled = true,
  } = {}
) {
  const latestValue = useRef(value);
  const latestSave = useRef(onSave);

  const firstRender = useRef(true);
  const timer = useRef(null);

  // Every new save cycle gets a new generation.
  const generationRef = useRef(0);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  latestValue.current = value;
  latestSave.current = onSave;

  /**
   * Cancel the currently scheduled save and invalidate
   * any older save cycle.
   */
  const cancel = useCallback(() => {
    generationRef.current += 1;

    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }

    setStatus("idle");
    setError(null);
  }, []);

  /**
   * Execute save immediately.
   */
  const save = useCallback(
    async (nextValue = latestValue.current) => {
      if (!latestSave.current) {
        return;
      }

      const generation = ++generationRef.current;

      setStatus("saving");
      setError(null);

      try {
        const result = await latestSave.current(nextValue);

        /*
         * If another save/cancel happened while this request
         * was running, this request is stale.
         */
        if (generation !== generationRef.current) {
          return result;
        }

        setStatus("saved");
        setLastSavedAt(new Date());

        return result;
      } catch (saveError) {
        /*
         * Ignore errors from stale requests.
         */
        if (generation !== generationRef.current) {
          return;
        }

        setStatus("error");

        const nextError =
          saveError instanceof Error
            ? saveError
            : new Error("Unable to save changes");

        setError(nextError);

        throw nextError;
      }
    },
    []
  );

  /**
   * Debounced autosave.
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    if (!enabled) {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }

      return undefined;
    }

    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    setStatus("pending");

    timer.current = window.setTimeout(() => {
      timer.current = null;

      save(value).catch(() => {});
    }, delay);

    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [
    value,
    delay,
    enabled,
    save,
  ]);

  /**
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      generationRef.current += 1;

      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return {
    status,
    error,
    lastSavedAt,

    saveNow: save,

    cancel,
  };
}

export default useAutoSave;