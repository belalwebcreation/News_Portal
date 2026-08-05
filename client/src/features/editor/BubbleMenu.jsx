import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ---------------------------------------------------------------------------
// Icons — কোনো external icon library লাগছে না, plain inline SVG
// ---------------------------------------------------------------------------
const BoldIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
    <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const HighlightIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4h4l5 5-9 9H6v-5z" />
    <path d="M4 20h16" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" />
    <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
  </svg>
);

const TableIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="3" y1="16" x2="21" y2="16" />
    <line x1="9.5" y1="4" x2="9.5" y2="20" />
    <line x1="15.5" y1="4" x2="15.5" y2="20" />
  </svg>
);

const TextColorIcon = ({ color }) => (
  <span className="bubble-menu__color-icon">
    <svg viewBox="0 0 24 24" width="15" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16 10 4h2l5 12" />
      <path d="M7.5 11h7" />
    </svg>
    <span className="bubble-menu__color-bar" style={{ background: color || '#7c8b81' }} />
  </span>
);

// ---------------------------------------------------------------------------
// Reusable icon button (hover-এ tooltip)
// ---------------------------------------------------------------------------
function IconButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`bubble-menu__icon-btn${active ? ' is-active' : ''}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
      <span className="bubble-menu__tooltip" role="tooltip">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Font size control — MS Word-এর মতো: − / + বাটন আর মাঝে সরাসরি সংখ্যা লিখে
// বদলানোর input। কাজ করে নতুন `fontSize` কমান্ডের উপর ভর করে, যেটা
// FontSize extension থেকে আসে (নিচের নোট দ্রষ্টব্য)।
// ---------------------------------------------------------------------------
const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 96;
const DEFAULT_FONT_SIZE = 16; // article body-র base font-size অনুযায়ী দরকার হলে বদলে নিও
const FONT_SIZE_STEP = 1;

function FontSizeControl({ editor }) {
  const activeSize = Number(editor.getAttributes('textStyle').fontSize) || DEFAULT_FONT_SIZE;
  const [inputValue, setInputValue] = useState(String(activeSize));

  useEffect(() => {
    setInputValue(String(activeSize));
  }, [activeSize]);

  const applySize = (size) => {
    const clamped = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size));
    editor.chain().focus().setFontSize(clamped).run();
    setInputValue(String(clamped));
  };

  const step = (delta) => applySize(activeSize + delta);

  const commitInput = () => {
    const parsed = parseInt(inputValue, 10);
    if (Number.isNaN(parsed)) {
      setInputValue(String(activeSize));
      return;
    }
    applySize(parsed);
  };

  return (
    <div className="bubble-menu__font-size">
      <button
        type="button"
        className="bubble-menu__font-size-btn"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => step(-FONT_SIZE_STEP)}
        aria-label="Decrease font size"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        className="bubble-menu__font-size-input"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value.replace(/[^0-9]/g, ''))}
        onBlur={commitInput}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitInput();
            event.currentTarget.blur();
          }
        }}
        onMouseDown={(event) => event.stopPropagation()}
        aria-label="Font size"
      />
      <button
        type="button"
        className="bubble-menu__font-size-btn"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => step(FONT_SIZE_STEP)}
        aria-label="Increase font size"
      >
        +
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text color popover
// ---------------------------------------------------------------------------
const TEXT_COLORS = [
  { label: 'Ink', value: '#17211b' },
  { label: 'Forest', value: '#276b55' },
  { label: 'Amber', value: '#a46b16' },
  { label: 'Crimson', value: '#b34444' },
  { label: 'Ocean', value: '#2563eb' },
  { label: 'Plum', value: '#7c3aed' },
  { label: 'Slate', value: '#64748b' },
];

function ColorButton({ editor }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const currentColor = editor.getAttributes('textStyle').color;

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const applyColor = (color) => {
    if (color) editor.chain().focus().setColor(color).run();
    else editor.chain().focus().unsetColor().run();
    setOpen(false);
  };

  return (
    <div className="bubble-menu__popover-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`bubble-menu__icon-btn${currentColor ? ' is-active' : ''}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
        aria-label="Text color"
        aria-expanded={open}
      >
        <TextColorIcon color={currentColor} />
        <span className="bubble-menu__tooltip" role="tooltip">Text color</span>
      </button>
      {open && (
        <div className="bubble-menu__popover bubble-menu__popover--colors" role="menu">
          {TEXT_COLORS.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              className="bubble-menu__swatch"
              style={{ background: swatch.value }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyColor(swatch.value)}
              aria-label={swatch.label}
              title={swatch.label}
            />
          ))}
          <button
            type="button"
            className="bubble-menu__swatch bubble-menu__swatch--clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyColor(null)}
            aria-label="Remove color"
            title="Remove color"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Highlight / text-background popover — solid রং আর gradient স্টাইল
// (screenshot-এ দেওয়া brush-stroke sample অনুযায়ী) দুটোই এখানে আছে।
// নতুন জিনিস চাইলে শুধু নিচের দুটো array-তে entry যোগ করলেই হবে।
// ---------------------------------------------------------------------------
const HIGHLIGHT_SOLIDS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Lime', value: '#d9f99d' },
  { label: 'Mint', value: '#bbf7d0' },
  { label: 'Sky', value: '#bfdbfe' },
  { label: 'Lilac', value: '#e9d5ff' },
  { label: 'Rose', value: '#fbcfe8' },
  { label: 'Peach', value: '#fed7aa' },
  { label: 'Sand', value: '#e5e7eb' },
];

const HIGHLIGHT_GRADIENTS = [
  { label: 'Sunset', value: 'linear-gradient(90deg, #ff6a3d, #ff2f6b)' },
  { label: 'Ocean', value: 'linear-gradient(90deg, #14b8a6, #2b4bdb)' },
  { label: 'Gold', value: 'linear-gradient(90deg, #f4c94c, #a9660f)' },
  { label: 'Blossom', value: 'linear-gradient(90deg, #ec4899, #fb8a2e)' },
  { label: 'Berry', value: 'linear-gradient(90deg, #a855f7, #ec4899)' },
  { label: 'Meadow', value: 'linear-gradient(90deg, #34d399, #0ea5e9)' },
  { label: 'Dusk', value: 'linear-gradient(90deg, #818cf8, #c084fc)' },
  { label: 'Flame', value: 'linear-gradient(90deg, #fbbf24, #ef4444)' },
];

function HighlightButton({ editor }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const currentBg = editor.getAttributes('textBackground').background;

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const apply = (background) => {
    if (background) editor.chain().focus().setTextBackground(background).run();
    else editor.chain().focus().unsetTextBackground().run();
    setOpen(false);
  };

  return (
    <div className="bubble-menu__popover-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`bubble-menu__icon-btn${currentBg ? ' is-active' : ''}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
        aria-label="Highlight"
        aria-expanded={open}
      >
        <HighlightIcon />
        <span className="bubble-menu__tooltip" role="tooltip">Highlight</span>
      </button>
      {open && (
        <div className="bubble-menu__popover bubble-menu__popover--highlights" role="menu">
          <div className="bubble-menu__popover-section-label">Solid</div>
          <div className="bubble-menu__swatch-row">
            {HIGHLIGHT_SOLIDS.map((swatch) => (
              <button
                key={swatch.value}
                type="button"
                className="bubble-menu__swatch"
                style={{ background: swatch.value }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => apply(swatch.value)}
                aria-label={swatch.label}
                title={swatch.label}
              />
            ))}
          </div>
          <div className="bubble-menu__popover-section-label">Gradient</div>
          <div className="bubble-menu__swatch-row">
            {HIGHLIGHT_GRADIENTS.map((swatch) => (
              <button
                key={swatch.value}
                type="button"
                className="bubble-menu__swatch"
                style={{ backgroundImage: swatch.value }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => apply(swatch.value)}
                aria-label={swatch.label}
                title={swatch.label}
              />
            ))}
          </div>
          <button
            type="button"
            className="bubble-menu__swatch bubble-menu__swatch--clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => apply(null)}
            aria-label="Remove highlight"
            title="Remove highlight"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table grid picker — MS Word-এর মতো hover করে row × column বাছাই করে
// table বসানো। কতটা বাছা হয়েছে সেটা উপরে label-এ দেখায়।
// ---------------------------------------------------------------------------
const GRID_MAX_ROWS = 8;
const GRID_MAX_COLS = 10;

function TableGridPicker({ onSelect }) {
  const [hover, setHover] = useState({ row: 0, col: 0 });

  const cells = [];
  for (let row = 1; row <= GRID_MAX_ROWS; row += 1) {
    for (let col = 1; col <= GRID_MAX_COLS; col += 1) {
      const active = row <= hover.row && col <= hover.col;
      cells.push(
        <button
          key={`${row}-${col}`}
          type="button"
          className={`table-grid__cell${active ? ' is-active' : ''}`}
          onMouseEnter={() => setHover({ row, col })}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(row, col)}
          aria-label={`${row} x ${col}`}
        />
      );
    }
  }

  return (
    <div className="table-grid" onMouseLeave={() => setHover({ row: 0, col: 0 })}>
      <div className="table-grid__label">
        {hover.row > 0 ? `${hover.row} × ${hover.col} table` : 'Select table size'}
      </div>
      <div className="table-grid__cells" style={{ gridTemplateColumns: `repeat(${GRID_MAX_COLS}, 1fr)` }}>
        {cells}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table button — table-এর ভিতরে selection থাকলে row/column options,
// না থাকলে grid picker দিয়ে নতুন table বসানো
// ---------------------------------------------------------------------------
function TableButton({ editor }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inTable = editor.isActive('table');

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const run = (fn) => {
    fn();
    setOpen(false);
  };

  const insertTable = (rows, cols) => {
    run(() => editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run());
  };

  return (
    <div className="bubble-menu__popover-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`bubble-menu__icon-btn${inTable ? ' is-active' : ''}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
        aria-label="Table"
        aria-expanded={open}
      >
        <TableIcon />
        <span className="bubble-menu__tooltip" role="tooltip">Table</span>
      </button>
      {open && !inTable && (
        <div className="bubble-menu__popover bubble-menu__popover--table" role="menu">
          <TableGridPicker onSelect={insertTable} />
        </div>
      )}
      {open && inTable && (
        <div className="bubble-menu__popover bubble-menu__popover--menu" role="menu">
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().addRowBefore().run())}>Add row above</button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().addRowAfter().run())}>Add row below</button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}>Add column left</button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}>Add column right</button>
          <div className="bubble-menu__popover-divider" />
          <button type="button" className="is-danger" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().deleteRow().run())}>Delete row</button>
          <button type="button" className="is-danger" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().deleteColumn().run())}>Delete column</button>
          <button type="button" className="is-danger" onMouseDown={(event) => event.preventDefault()} onClick={() => run(() => editor.chain().focus().deleteTable().run())}>Delete table</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BubbleMenu
// ---------------------------------------------------------------------------
export function BubbleMenu({ editor, onOpenLink, onInsertImage, onInsertYoutube }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const computePosition = useCallback(() => {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return null;
    const rect = domSelection.getRangeAt(0).getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) return null;

    const menuWidth = menuRef.current?.offsetWidth || 280;
    const menuHeight = menuRef.current?.offsetHeight || 40;
    const gap = 10;

    let x = rect.right + gap;
    let y = rect.top + rect.height / 2 - menuHeight / 2;

    if (x + menuWidth > window.innerWidth - 8) {
      x = rect.left - menuWidth - gap;
      if (x < 8) x = Math.min(rect.left, window.innerWidth - menuWidth - 8);
    }
    y = Math.min(Math.max(y, 8), window.innerHeight - menuHeight - 8);

    return { x, y };
  }, []);

  // Left-click দিয়ে selection করলে (mouseup) অথবা keyboard দিয়ে (shift+arrow) menu দেখাও
  useEffect(() => {
    if (!editor) return undefined;
    const dom = editor.view.dom;

    const showIfSelected = () => {
      requestAnimationFrame(() => {
        if (editor.state.selection.empty) {
          setVisible(false);
          return;
        }
        const pos = computePosition();
        if (pos) {
          setPosition(pos);
          setVisible(true);
        }
      });
    };

    const handleSelectionUpdate = () => {
      if (editor.state.selection.empty) setVisible(false);
    };

    dom.addEventListener('mouseup', showIfSelected);
    dom.addEventListener('keyup', showIfSelected);
    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      dom.removeEventListener('mouseup', showIfSelected);
      dom.removeEventListener('keyup', showIfSelected);
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, computePosition]);

  // Mount হওয়ার পর real width/height দিয়ে position ঠিক করে নেয় —
  // প্রথমবার show হওয়ার সময় ছোট্ট "jump" চোখে পড়বে না
  useLayoutEffect(() => {
    if (!visible) return;
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;
    const rect = domSelection.getRangeAt(0).getBoundingClientRect();
    const menuEl = menuRef.current;
    if (!rect || !menuEl) return;

    const menuWidth = menuEl.offsetWidth;
    const menuHeight = menuEl.offsetHeight;
    const gap = 10;

    let x = rect.right + gap;
    let y = rect.top + rect.height / 2 - menuHeight / 2;

    if (x + menuWidth > window.innerWidth - 8) {
      x = rect.left - menuWidth - gap;
      if (x < 8) x = Math.min(rect.left, window.innerWidth - menuWidth - 8);
    }
    y = Math.min(Math.max(y, 8), window.innerHeight - menuHeight - 8);

    setPosition({ x, y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Outside click / Esc → hide
  useEffect(() => {
    if (!visible) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setVisible(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  // Drag-to-reposition
  const handleDragStart = useCallback((event) => {
    event.preventDefault();
    const rect = menuRef.current.getBoundingClientRect();
    dragState.current = {
      dragging: true,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    const handleDragMove = (moveEvent) => {
      if (!dragState.current.dragging) return;
      const menuWidth = menuRef.current?.offsetWidth || 280;
      const menuHeight = menuRef.current?.offsetHeight || 40;

      let x = moveEvent.clientX - dragState.current.offsetX;
      let y = moveEvent.clientY - dragState.current.offsetY;

      x = Math.min(Math.max(x, 4), window.innerWidth - menuWidth - 4);
      y = Math.min(Math.max(y, 4), window.innerHeight - menuHeight - 4);

      setPosition({ x, y });
    };

    const handleDragEnd = () => {
      dragState.current.dragging = false;
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }, []);

  if (!editor || !visible) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="bubble-menu bubble-menu--floating"
      role="toolbar"
      aria-label="Selection formatting"
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 1000 }}
    >
      <button
        type="button"
        className="bubble-menu__drag-handle"
        onMouseDown={handleDragStart}
        aria-label="Drag menu"
        title="Drag to move"
      >
        ⠿
      </button>

      <div className="bubble-menu__group">
        <FontSizeControl editor={editor} />
      </div>

      <div className="bubble-menu__divider" />

      <div className="bubble-menu__group">
        <IconButton icon={<BoldIcon />} label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <IconButton icon={<ItalicIcon />} label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <HighlightButton editor={editor} />
        <ColorButton editor={editor} />
      </div>

      <div className="bubble-menu__divider" />

      <div className="bubble-menu__group">
        <IconButton icon={<LinkIcon />} label="Link" active={editor.isActive('link')} onClick={() => onOpenLink?.()} />
        <IconButton icon={<ImageIcon />} label="Image" onClick={() => onInsertImage?.()} />
        <IconButton icon={<YoutubeIcon />} label="Embed video" onClick={() => onInsertYoutube?.()} />
        <TableButton editor={editor} />
      </div>
    </div>,
    document.body
  );
}

export default BubbleMenu;
