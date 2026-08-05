import React from 'react';

const actions = [
  ['Add column', 'addColumnAfter', '+ Col'], ['Add row', 'addRowAfter', '+ Row'],
  ['Delete column', 'deleteColumn', '− Col'], ['Delete row', 'deleteRow', '− Row'],
  ['Delete table', 'deleteTable', 'Delete table'],
];

export function TableToolbar({ editor }) {
  if (!editor?.isActive('table')) return null;
  return (
    <div className="table-toolbar" role="toolbar" aria-label="Table controls">
      {actions.map(([label, method, text]) => <button key={method} type="button" onClick={() => editor.chain().focus()[method]().run()}>{text}</button>)}
      <button type="button" onClick={() => editor.chain().focus().mergeCells().run()}>Merge</button>
      <button type="button" onClick={() => editor.chain().focus().splitCell().run()}>Split</button>
    </div>
  );
}

export default TableToolbar;
