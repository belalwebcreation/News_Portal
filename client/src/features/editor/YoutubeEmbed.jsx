import React, { useState } from 'react';

export function getYoutubeId(url = '') {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('/')[0];
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
  } catch { return null; }
  return null;
}

export function YoutubeEmbed({ editor, onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const videoId = getYoutubeId(url);
    if (!videoId) { setError('Paste a valid YouTube URL.'); return; }
    editor.chain().focus().setYoutubeVideo({ src: `https://www.youtube-nocookie.com/watch?v=${videoId}`, width: 840, height: 473 }).run();
    onClose?.();
  };
  return (
    <div className="modal__backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <form className="modal modal--small" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal__header"><div><p className="eyebrow">Media</p><h2>Embed a video</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button></div>
        <label className="field-label" htmlFor="youtube-url">YouTube URL</label>
        <input id="youtube-url" className="field" value={url} onChange={(event) => { setUrl(event.target.value); setError(''); }} placeholder="https://youtube.com/watch?v=…" autoFocus />
        {error && <p className="field-error">{error}</p>}
        <div className="modal__footer"><button type="button" className="button button--ghost" onClick={onClose}>Cancel</button><button type="submit" className="button button--primary">Embed video</button></div>
      </form>
    </div>
  );
}

export default YoutubeEmbed;
