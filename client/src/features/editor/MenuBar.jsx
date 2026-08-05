import React from 'react';
import { CodeBlockToolbar } from './CodeBlock';

function ToolbarButton({ label, title, active = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      className={`editor-toolbar__button${active ? ' is-active' : ''}`}
      aria-label={label}
      aria-pressed={active}
      title={title || label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children || label}
    </button>
  );
}

function Divider() {
  return <span className="editor-toolbar__divider" aria-hidden="true" />;
}

export function MenuBar({ editor, onOpenLink, onInsertImage, onInsertYoutube, onOpenMention }) {
  if (!editor) return null;
  const run = (command) => command(editor.chain().focus()).run();
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="editor-toolbar__group">
        <ToolbarButton label="Undo" title="Undo (Ctrl/Cmd + Z)" disabled={!editor.can().undo()} onClick={() => run((chain) => chain.undo())}>↶</ToolbarButton>
        <ToolbarButton label="Redo" title="Redo (Ctrl/Cmd + Shift + Z)" disabled={!editor.can().redo()} onClick={() => run((chain) => chain.redo())}>↷</ToolbarButton>
      </div>
      <Divider />
      <div className="editor-toolbar__group editor-toolbar__group--selects">
        <select
          aria-label="Text style"
          className="editor-toolbar__select"
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
          onChange={(event) => {
            const value = event.target.value;
            if (value === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: Number(value.slice(1)) }).run();
          }}
        >
          <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option>
        </select>
        <select
          aria-label="Text alignment"
          className="editor-toolbar__select editor-toolbar__select--compact"
          value={['left', 'center', 'right', 'justify'].find((align) => editor.isActive({ textAlign: align })) || 'left'}
          onChange={(event) => editor.chain().focus().setTextAlign(event.target.value).run()}
        >
          <option value="left">Align left</option><option value="center">Center</option><option value="right">Align right</option><option value="justify">Justify</option>
        </select>
      </div>
      <Divider />
      <div className="editor-toolbar__group">
        <ToolbarButton label="Bold" title="Bold (Ctrl/Cmd + B)" active={editor.isActive('bold')} onClick={() => run((chain) => chain.toggleBold())}><strong>B</strong></ToolbarButton>
        <ToolbarButton label="Italic" title="Italic (Ctrl/Cmd + I)" active={editor.isActive('italic')} onClick={() => run((chain) => chain.toggleItalic())}><em>I</em></ToolbarButton>
        <ToolbarButton label="Underline" title="Underline (Ctrl/Cmd + U)" active={editor.isActive('underline')} onClick={() => run((chain) => chain.toggleUnderline())}><u>U</u></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => run((chain) => chain.toggleStrike())}><s>S</s></ToolbarButton>
        <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => run((chain) => chain.toggleCode())}><span className="editor-toolbar__mono">&lt;/&gt;</span></ToolbarButton>
        <ToolbarButton label="Highlight" active={editor.isActive('highlight')} onClick={() => run((chain) => chain.toggleHighlight())}>▰</ToolbarButton>
      </div>
      <Divider />
      <div className="editor-toolbar__group">
        <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => run((chain) => chain.toggleBulletList())}>☷</ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => run((chain) => chain.toggleOrderedList())}>1.</ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => run((chain) => chain.toggleBlockquote())}>❝</ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => run((chain) => chain.toggleCodeBlock())}>▤</ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => run((chain) => chain.setHorizontalRule())}>―</ToolbarButton>
      </div>
      <Divider />
      <div className="editor-toolbar__group">
        <ToolbarButton label="Add link" active={editor.isActive('link')} onClick={onOpenLink}>↗</ToolbarButton>
        <ToolbarButton label="Add image" onClick={onInsertImage}>▧</ToolbarButton>
        <ToolbarButton label="Add video" onClick={onInsertYoutube}>▶</ToolbarButton>
        <ToolbarButton label="Mention teammate" onClick={onOpenMention}>@</ToolbarButton>
      </div>
      {editor.isActive('codeBlock') && <CodeBlockToolbar editor={editor} />}
    </div>
  );
}

export default MenuBar;
