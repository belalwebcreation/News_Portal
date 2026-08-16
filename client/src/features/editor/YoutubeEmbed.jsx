import React, { useState } from "react";
import { createPortal } from "react-dom";

export function getYoutubeId(url = "") {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      return (
        parsed.pathname
          .slice(1)
          .split("/")
          .filter(Boolean)[0] || null
      );
    }

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const watchId = parsed.searchParams.get("v");

      if (watchId) {
        return watchId;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return (
          parsed.pathname
            .split("/embed/")[1]
            ?.split("/")[0] || null
        );
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return (
          parsed.pathname
            .split("/shorts/")[1]
            ?.split("/")[0] || null
        );
      }

      if (parsed.pathname.startsWith("/live/")) {
        return (
          parsed.pathname
            .split("/live/")[1]
            ?.split("/")[0] || null
        );
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function YoutubeEmbed({ editor, onClose }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🟢 YOUTUBE SUBMIT FIRED");
    console.log("URL:", url);

    const videoId = getYoutubeId(url);

    if (!videoId) {
      setError("Paste a valid YouTube URL.");
      return;
    }

    if (!editor) {
      setError("Editor is not ready.");
      return;
    }

    const success = editor
      .chain()
      .focus()
      .setYoutubeVideo({
        src: `https://www.youtube-nocookie.com/embed/${videoId}`,
        width: 840,
        height: 473,
      })
      .run();

    console.log("🟢 YOUTUBE EMBED RESULT:", success);

    if (!success) {
      setError("Could not embed this video.");
      return;
    }

    onClose?.();
  };

  const closeModal = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🔴 YOUTUBE MODAL CLOSE");

    onClose?.();
  };

  return createPortal(
    <div
      className="modal__backdrop"
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "auto",
      }}
    >
      <form
        className="modal modal--small"
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1000000,
          pointerEvents: "auto",
        }}
      >
        <div className="modal__header">
          <div>
            <p className="eyebrow">Media</p>
            <h2>Embed a video</h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        <label
          className="field-label"
          htmlFor="youtube-url"
        >
          YouTube URL
        </label>

        <input
          id="youtube-url"
          className="field"
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setError("");
          }}
          placeholder="https://youtube.com/watch?v=..."
          autoFocus
        />

        {error && (
          <p className="field-error">
            {error}
          </p>
        )}

        <div className="modal__footer">
          <button
            type="button"
            className="button button--ghost"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button--primary"
          >
            Embed video
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}

export default YoutubeEmbed;