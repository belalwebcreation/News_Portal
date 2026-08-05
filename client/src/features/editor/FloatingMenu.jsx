import React, { useState } from 'react';
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus";
import { SLASH_COMMANDS } from './SlashCommand';

export function FloatingMenu({ editor, onInsertImage, onInsertYoutube }) {
  const [open, setOpen] = useState(false);
  if (!editor) return null;
  return (
    <TiptapFloatingMenu editor={editor} tippyOptions={{ duration: 100, placement: 'bottom-start' }} shouldShow={({ state }) => {
      const { $from } = state.selection;
      return $from.parent.isTextblock && $from.parent.content.size === 0;
    }}>
      <div className="floating-menu">
        <button type="button" className="floating-menu__trigger" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span>＋</span> Add block</button>
        {open && (
          <div className="floating-menu__panel" role="menu">
            {SLASH_COMMANDS.map((item) => <button type="button" key={item.id} role="menuitem" onClick={() => { item.command(editor); setOpen(false); }}><span className="floating-menu__icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}
            <button type="button" role="menuitem" onClick={() => { onInsertImage?.(); setOpen(false); }}><span className="floating-menu__icon">▧</span><span><strong>Image</strong><small>Upload a visual</small></span></button>
            <button type="button" role="menuitem" onClick={() => { onInsertYoutube?.(); setOpen(false); }}><span className="floating-menu__icon">▶</span><span><strong>Video</strong><small>Embed a YouTube video</small></span></button>
          </div>
        )}
      </div>
    </TiptapFloatingMenu>
  );
}

export default FloatingMenu;
