'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import { createEditorExtensions } from '../editor/extensions';

const STORAGE_KEY = 'news_portal_article_draft';
const AUTOSAVE_DEBOUNCE_MS = 800;

const isBrowser = typeof window !== 'undefined';

function readDraftFromStorage() {
  if (!isBrowser) return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const looksLikeTiptapDoc =
      parsed && typeof parsed === 'object' && parsed.type === 'doc' && Array.isArray(parsed.content);

    if (!looksLikeTiptapDoc) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn('[useArticleEditor] Corrupted draft in localStorage, clearing it.', e);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
}

// হেল্পার ফাংশন: ওয়ার্ড ও রিডিং টাইম হিসাব করার জন্য
const getStats = (ed) => {
  if (!ed) return { words: 0, characters: 0, readingTime: 0 };
  const words = ed.storage.characterCount?.words?.() ?? 0;
  const characters = ed.storage.characterCount?.characters?.() ?? 0;
  const readingTime = Math.ceil(words / 200); // গড়ে প্রতি মিনিটে ২০০ শব্দ
  return { words, characters, readingTime: readingTime || 0 };
};

export const useArticleEditor = ({
  content = '',
  onChange,
  editable = true,
  placeholder = '',
  autofocus = false,
  onReady,
} = {}) => {
  const saveTimeoutRef = useRef(null);
  const [restoreError, setRestoreError] = useState(null);
  const [editorStats, setEditorStats] = useState({ words: 0, characters: 0, readingTime: 0 });

  // ১. আসল createEditorExtensions() ব্যবহার — FontSize, TextBackground, Color,
  // Mention, CustomImage সব এখানেই সঠিকভাবে extend করা আছে
  const extensions = useMemo(
    () => [...createEditorExtensions(), CharacterCount],
    []
  );

  const debouncedSave = useCallback((json) => {
    if (!isBrowser) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
      } catch (e) {
        console.warn('[useArticleEditor] Autosave failed.', e);
      }
    }, AUTOSAVE_DEBOUNCE_MS);
  }, []);

  // ২. টিপট্যাপের মূল useEditor ইনস্ট্যান্স
  const editor = useEditor(
    {
      extensions,
      content,
      editable,
      immediatelyRender: false,
      autofocus,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none w-full break-words',
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const json = currentEditor.getJSON();
        debouncedSave(json);
        onChange?.(currentEditor.getHTML(), currentEditor);
        setEditorStats(getStats(currentEditor));
      },
    },
    [extensions]
  );

  // editable prop রানটাইমে বদলালে editor-কে সিঙ্ক করা (useEditor শুধু mount-এ ধরে নেয়)
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  // editor তৈরি হওয়ার পর parent-কে জানানো
  useEffect(() => {
    if (editor) onReady?.(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // ৩. ড্রাফট লোড করা এবং স্ট্যাটস ইনিশিয়ালাইজ করা
  useEffect(() => {
    if (!editor) return;
    const draft = readDraftFromStorage();
    if (draft) {
      try {
        editor.commands.setContent(draft, false);
      } catch (e) {
        console.warn('[useArticleEditor] Saved draft did not match current schema, ignoring it.', e);
        if (isBrowser) window.localStorage.removeItem(STORAGE_KEY);
        setRestoreError('আপনার আগের ড্রাফটটি রিস্টোর করা যায়নি, তাই একটি খালি/নতুন কন্টেন্ট দিয়ে শুরু করা হয়েছে।');
      }
    }

    setEditorStats(getStats(editor));
    onChange?.(editor.getHTML(), editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // ৬. পেজ বন্ধ/রিফ্রেশ হওয়ার ঠিক আগে pending debounce force-flush করা —
// নাহলে ৮০০ms পার হওয়ার আগেই refresh করলে save হারিয়ে যায়
useEffect(() => {
  if (!editor) return undefined;

  const flushSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
    } catch (e) {
      console.warn('[useArticleEditor] Flush save failed.', e);
    }
  };

  window.addEventListener('beforeunload', flushSave);
  window.addEventListener('pagehide', flushSave); // মোবাইল ব্রাউজার / bfcache-এর জন্য দরকার
  return () => {
    window.removeEventListener('beforeunload', flushSave);
    window.removeEventListener('pagehide', flushSave);
  };
}, [editor]);

  // ৪. সফল পাবলিশের পর এডিটর রিসেট করার ফাংশন
  const resetEditor = useCallback(
    (newContent = '') => {
      if (!editor) return;
      editor.commands.setContent(newContent, false);
      if (isBrowser) window.localStorage.removeItem(STORAGE_KEY);
      setEditorStats(getStats(editor));
      onChange?.(editor.getHTML(), editor);
    },
    [editor, onChange]
  );

  // ৫. TipTapEditor.jsx থেকে getMetrics() কল হয় — আগে এটাই রিটার্ন হতো না
  const getMetrics = useCallback(() => getStats(editor), [editor]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return {
    editor,
    isReady: Boolean(editor),
    error: restoreError,
    editorStats,
    getMetrics,
    resetEditor,
  };
};

export default useArticleEditor;