import React from 'react';

export const CODE_LANGUAGES = [
  { value: 'text', label: 'Plain text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
];

export function CodeBlockToolbar({ editor }) {
  if (!editor) return null;
  const activeLanguage = editor.getAttributes('codeBlock').language || 'text';
  return (
    <div className="code-block-toolbar" role="toolbar" aria-label="Code block options">
      <label htmlFor="code-language">Language</label>
      <select
        id="code-language"
        value={activeLanguage}
        onChange={(event) => editor.chain().focus().updateAttributes('codeBlock', { language: event.target.value }).run()}
      >
        {CODE_LANGUAGES.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
      </select>
    </div>
  );
}

export default CodeBlockToolbar;
