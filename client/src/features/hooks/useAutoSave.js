import { useCallback, useEffect, useRef, useState } from 'react';

/** Debounced persistence with explicit status so the UI can explain what is happening. */
export function useAutoSave(value, onSave, { delay = 1400, enabled = true } = {}) {
  const latestValue = useRef(value);
  const latestSave = useRef(onSave);
  const firstRender = useRef(true);
  const timer = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  latestValue.current = value;
  latestSave.current = onSave;

  const save = useCallback(async (nextValue = latestValue.current) => {
    if (!latestSave.current) return;
    setStatus('saving');
    setError(null);
    try {
      await latestSave.current(nextValue);
      setStatus('saved');
      setLastSavedAt(new Date());
    } catch (saveError) {
      setStatus('error');
      const nextError = saveError instanceof Error ? saveError : new Error('Unable to save changes');
      setError(nextError);
      throw nextError;
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    if (!enabled) return undefined;
    if (timer.current) window.clearTimeout(timer.current);
    setStatus('pending');
    timer.current = window.setTimeout(() => { save(value).catch(() => {}); }, delay);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, delay, enabled, save]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  return {
    status,
    error,
    lastSavedAt,
    saveNow: save,
    cancel: () => {
      if (timer.current) window.clearTimeout(timer.current);
      setStatus('idle');
    },
  };
}

export default useAutoSave;
