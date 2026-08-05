import { Extension } from '@tiptap/core';

/** Commands used by the quick-insert menu. Rendering stays in React so it can be themed. */
export const SlashCommand = Extension.create({
  name: 'slashCommand',
  addCommands() {
    return {
      insertSlashCommand:
        ({ type, attrs, content } = {}) => ({ chain }) => {
          if (type === 'text') return chain().insertContent(content || '').run();
          return chain().insertContent({ type, attrs, content }).run();
        },
    };
  },
});

export const SLASH_COMMANDS = [
  { id: 'heading', label: 'Heading', hint: 'Give your section a clear title', icon: 'H', command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'quote', label: 'Quote', hint: 'Highlight a memorable line', icon: '“', command: (editor) => editor.chain().focus().toggleBlockquote().run() },
  { id: 'bullet-list', label: 'Bullet list', hint: 'Organize ideas at a glance', icon: '•', command: (editor) => editor.chain().focus().toggleBulletList().run() },
  { id: 'numbered-list', label: 'Numbered list', hint: 'Show a sequence of steps', icon: '1', command: (editor) => editor.chain().focus().toggleOrderedList().run() },
  { id: 'code', label: 'Code block', hint: 'Share formatted code', icon: '</>', command: (editor) => editor.chain().focus().toggleCodeBlock().run() },
  { id: 'divider', label: 'Divider', hint: 'Create a visual pause', icon: '—', command: (editor) => editor.chain().focus().setHorizontalRule().run() },
];

export default SlashCommand;
