import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

// ==========================================================
// FILE SIZE FORMATTER
// ==========================================================

function formatBytes(bytes = 0) {
  if (!bytes) {
    return "0 KB";
  }

  const mb = bytes / 1024 / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ==========================================================
// IMAGE UPLOADER
// ==========================================================

export function ImageUploader({
  onUpload,
  onClose,
  isUploading = false,
  progress = 0,
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");

  // ========================================================
  // CHOOSE / VALIDATE IMAGE
  // ========================================================

  const choose = (nextFile) => {
    if (!nextFile) {
      return;
    }

    setError("");

    // ------------------------------------------------------
    // Image type validation
    // ------------------------------------------------------

    if (!nextFile.type?.startsWith("image/")) {
      setError(
        "Please choose a JPG, PNG, GIF, SVG, or WebP image."
      );
      return;
    }

    // ------------------------------------------------------
    // 10 MB maximum
    // ------------------------------------------------------

    if (nextFile.size > 10 * 1024 * 1024) {
      setError(
        "Image size must be 10 MB or smaller."
      );
      return;
    }

    console.log("🟢 IMAGE SELECTED:", nextFile);

    setFile(nextFile);
  };

  // ========================================================
  // FILE INPUT CHANGE
  // ========================================================

  const handleFileChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedFile =
      event.target.files?.[0];

    console.log(
      "📁 FILE PICKED:",
      selectedFile
    );

    choose(selectedFile);

    // Same file আবার select করার সুযোগ
    event.target.value = "";
  };

  // ========================================================
  // DRAG ENTER
  // ========================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isUploading) {
      return;
    }

    setDragging(true);
  };

  // ========================================================
  // DRAG OVER
  // ========================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isUploading) {
      return;
    }

    setDragging(true);
  };

  // ========================================================
  // DRAG LEAVE
  // ========================================================

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
  };

  // ========================================================
  // DROP
  // ========================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    if (isUploading) {
      return;
    }

    const droppedFile =
      event.dataTransfer?.files?.[0];

    console.log(
      "📦 IMAGE DROPPED:",
      droppedFile
    );

    choose(droppedFile);
  };

  // ========================================================
  // SUBMIT IMAGE
  // ========================================================

  const submit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(
      "🟢 IMAGE SUBMIT FIRED"
    );

    if (isUploading) {
      return;
    }

    if (!file) {
      setError(
        "Choose an image first."
      );
      return;
    }

    setError("");

    try {
      console.log(
        "⬆️ STARTING IMAGE UPLOAD:",
        file.name
      );

      await onUpload(file, {
        alt: alt.trim(),
      });

      console.log(
        "🟢 IMAGE UPLOAD SUCCESS"
      );

      onClose?.();
    } catch (uploadError) {
      console.error(
        "🔴 IMAGE UPLOAD FAILED:",
        uploadError
      );

      setError(
        uploadError?.message ||
          "Image upload failed. Please try again."
      );
    }
  };

  // ========================================================
  // CLOSE
  // ========================================================

  const closeModal = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (isUploading) {
      return;
    }

    console.log(
      "🔴 IMAGE MODAL CLOSED"
    );

    onClose?.();
  };

  // ========================================================
  // MODAL UI
  // ========================================================

  const modal = (
    <div
      className="modal__backdrop"
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "auto",
      }}
      onMouseDown={(event) => {
        /*
         * শুধু backdrop-এ click করলে close হবে।
         * Modal-এর ভেতরে click করলে close হবে না।
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          closeModal(event);
        }
      }}
    >
      <form
        className="modal modal--small"
        onSubmit={submit}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        style={{
          position: "relative",
          zIndex: 1000000,
          pointerEvents: "auto",
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="modal__header">
          <div>
            <p className="eyebrow">
              Media
            </p>

            <h2>
              Add an image
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={closeModal}
            disabled={isUploading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ==================================================
            IMAGE DROPZONE
        ================================================== */}

        <label
          htmlFor="article-image-file"
          className={[
            "upload-dropzone",
            dragging
              ? "is-dragging"
              : "",
            file
              ? "has-file"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <>
              <span className="upload-dropzone__icon">
                ✓
              </span>

              <strong>
                {file.name}
              </strong>

              <small>
                {formatBytes(file.size)}
                {" · "}
                Click to replace
              </small>
            </>
          ) : (
            <>
              <span className="upload-dropzone__icon">
                ↑
              </span>

              <strong>
                Drop an image here
              </strong>

              <small>
                or click to browse · up to 10 MB
              </small>
            </>
          )}

          {/* ==================================================
              NATIVE FILE INPUT

              label htmlFor এই input-টাকে directly trigger করবে।
              React ref click করার দরকার নেই।
          ================================================== */}

          <input
            id="article-image-file"
            ref={inputRef}
            type="file"
            accept="
              image/jpeg,
              image/png,
              image/gif,
              image/svg+xml,
              image/webp
            "
            hidden
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>

        {/* ==================================================
            ALT TEXT
        ================================================== */}

        <label
          className="field-label"
          htmlFor="image-alt"
        >
          Alt text{" "}
          <span>
            (recommended)
          </span>
        </label>

        <input
          id="image-alt"
          className="field"
          type="text"
          value={alt}
          disabled={isUploading}
          onChange={(event) => {
            setAlt(event.target.value);
            setError("");
          }}
          placeholder="Describe the image for accessibility"
        />

        {/* ==================================================
            UPLOAD PROGRESS
        ================================================== */}

        {isUploading && (
          <div
            className="progress-bar"
            aria-label="Upload progress"
          >
            <span
              style={{
                width: `${Math.min(
                  Math.max(progress, 0),
                  100
                )}%`,
              }}
            />
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <p className="field-error">
            {error}
          </p>
        )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="modal__footer">
          <button
            type="button"
            className="button button--ghost"
            onClick={closeModal}
            disabled={isUploading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button--primary"
            disabled={
              isUploading || !file
            }
          >
            {isUploading
              ? "Uploading…"
              : "Add image"}
          </button>
        </div>
      </form>
    </div>
  );

  // ========================================================
  // PORTAL
  // ========================================================

  return createPortal(
    modal,
    document.body
  );
}

export default ImageUploader;