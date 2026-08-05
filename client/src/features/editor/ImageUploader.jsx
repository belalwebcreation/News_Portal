import React, { useRef, useState } from 'react';

function formatBytes(bytes = 0) {
  if (!bytes) return '0 KB';
  return `${(bytes / 1024 / 1024 >= 1 ? bytes / 1024 / 1024 : bytes / 1024).toFixed(1)} ${bytes / 1024 / 1024 >= 1 ? 'MB' : 'KB'}`;
}

export function ImageUploader({ onUpload, onClose, isUploading = false, progress = 0 }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');

  const choose = (nextFile) => {
    if (!nextFile) return;
    setError('');
    if (!nextFile.type?.startsWith('image/')) { setError('Please choose a JPG, PNG, GIF, SVG, or WebP image.'); return; }
    setFile(nextFile);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!file) { setError('Choose an image first.'); return; }
    try { await onUpload(file, { alt: alt.trim() }); onClose?.(); } catch (uploadError) { setError(uploadError.message); }
  };

  return (
    <div className="modal__backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <form className="modal modal--small" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal__header"><div><p className="eyebrow">Media</p><h2>Add an image</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button></div>
        <div
          className={`upload-dropzone${dragging ? ' is-dragging' : ''}${file ? ' has-file' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files?.[0]); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}
        >
          {file ? <><span className="upload-dropzone__icon">✓</span><strong>{file.name}</strong><small>{formatBytes(file.size)} · Click to replace</small></> : <><span className="upload-dropzone__icon">↑</span><strong>Drop an image here</strong><small>or click to browse · up to 10 MB</small></>}
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => choose(event.target.files?.[0])} />
        </div>
        <label className="field-label" htmlFor="image-alt">Alt text <span>(recommended)</span></label>
        <input id="image-alt" className="field" value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Describe the image for accessibility" />
        {isUploading && <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>}
        {error && <p className="field-error">{error}</p>}
        <div className="modal__footer"><button type="button" className="button button--ghost" onClick={onClose}>Cancel</button><button type="submit" className="button button--primary" disabled={isUploading}>{isUploading ? 'Uploading…' : 'Add image'}</button></div>
      </form>
    </div>
  );
}

export default ImageUploader;
