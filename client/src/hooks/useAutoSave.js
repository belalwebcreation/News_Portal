import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for auto-saving article drafts using debouncing.
 * @param {Object} data - The data to save (e.g., { title, content, status }).
 * @param {Function} saveFunction - API call function that returns a Promise.
 * @param {number} delay - Debounce delay in milliseconds (default: 2500ms).
 */
export const useAutoSave = (data, saveFunction, delay = 2500) => {
  // Status can be: 'idle', 'saving', 'saved', 'error'
  const [saveStatus, setSaveStatus] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  
  // Ref to keep track of the initial render so we don't autosave immediately
  const isInitialMount = useRef(true);
  
  // Ref to hold the latest data to prevent closure staleness in setTimeout
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only attempt to save if there's actual content to save
    if (!dataRef.current || !dataRef.current.content) {
      return;
    }

    setSaveStatus('saving');

    const timerId = setTimeout(async () => {
      try {
        await saveFunction(dataRef.current);
        setSaveStatus('saved');
        setLastSavedAt(new Date());
      } catch (error) {
        console.error('AutoSave Error:', error);
        setSaveStatus('error');
      }
    }, delay);

    // Cleanup function (Debounce logic: clears timer if data changes before delay finishes)
    return () => {
      clearTimeout(timerId);
    };
  }, [data, delay, saveFunction]); // Re-run effect when data changes

  // Helper to force save immediately (e.g., when clicking "Save Draft" button manually)
  const triggerManualSave = async () => {
    setSaveStatus('saving');
    try {
      await saveFunction(dataRef.current);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Manual Save Error:', error);
      setSaveStatus('error');
    }
  };

  return { saveStatus, lastSavedAt, triggerManualSave };
};