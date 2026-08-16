'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import { createEditorExtensions } from '../editor/extensions';

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
  const [editorStats, setEditorStats] = useState({ words: 0, characters: 0, readingTime: 0 });

  // ১. আসল createEditorExtensions() ব্যবহার — FontSize, TextBackground, Color,
  // Mention, CustomImage সব এখানেই সঠিকভাবে extend করা আছে
  const extensions = useMemo(
    () => [...createEditorExtensions(), CharacterCount],
    []
  );

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
        // ❌ localStorage-এ global auto-save সরানো হলো — এটা ArticleManagement.jsx-এর
        // নিজস্ব per-user/per-article draft system-এর (article-draft-${currentUserId}-${id})
        // সাথে conflict করছিল এবং ভিন্ন article/user-এর মধ্যে content ভুলভাবে
        // leak/overwrite করছিল।
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

  // ৩. editor তৈরি হওয়ার পর স্ট্যাটস ইনিশিয়ালাইজ করা
  // ❌ আগে এখানে localStorage থেকে draft পড়ে editor.commands.setContent() দিয়ে
  // parent-এর পাঠানো আসল `content` prop-কে silently overwrite করা হতো — এটাই
  // মূল বাগ ছিল। এখন শুধু stats init হচ্ছে, content touch করা হচ্ছে না।
  // `content` prop-ই একমাত্র সত্যিকারের source of truth (useEditor-এর
  // initial config-এর মাধ্যমে আসে)।
  useEffect(() => {
    if (!editor) return;
    setEditorStats(getStats(editor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // ❌ beforeunload/pagehide flush effect সম্পূর্ণ সরানো হলো — এটাও একই
  // global localStorage key ব্যবহার করত, এখন আর কোনো localStorage draft
  // নেই যা flush করতে হবে।

  // ৪. সফল পাবলিশের পর এডিটর রিসেট করার ফাংশন
  const resetEditor = useCallback(
    (newContent = '') => {
      if (!editor) return;
      editor.commands.setContent(newContent, false);
      setEditorStats(getStats(editor));
      onChange?.(editor.getHTML(), editor);
    },
    [editor, onChange]
  );

  // ৫. TipTapEditor.jsx থেকে getMetrics() কল হয়
  const getMetrics = useCallback(() => getStats(editor), [editor]);

  return {
    editor,
    isReady: Boolean(editor),
    editorStats,
    getMetrics,
    resetEditor,
  };
};

export default useArticleEditor;