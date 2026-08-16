import React, {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  NodeSelection,
} from "@tiptap/pm/state";

// ==========================================================
// URL VALIDATION
// ==========================================================

const URL_PATTERN =
  /^(https?:\/\/|mailto:|tel:)/iu;

// ==========================================================
// NORMALIZE URL
// ==========================================================

const normalizeUrl = (value = "") => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  // Already has a supported protocol
  if (URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  // Email
  if (
    trimmed.includes("@") &&
    !trimmed.includes("/")
  ) {
    return `mailto:${trimmed}`;
  }

  // Normal domain
  return `https://${trimmed}`;
};

// ==========================================================
// LINK MODAL
// ==========================================================

export function LinkModal({
  editor,
  onClose,
}) {
  // ========================================================
  // SAFETY
  // ========================================================

  if (!editor) {
    return null;
  }

  // ========================================================
  // CURRENT SELECTION
  // ========================================================

  const selection =
    editor.state.selection;

  // ========================================================
  // IMAGE SELECTION
  // ========================================================

  const isImageSelection =
    selection instanceof NodeSelection &&
    selection.node?.type?.name === "image";

  // ========================================================
  // EXISTING LINK
  // ========================================================

  const existingHref =
    isImageSelection
      ? selection.node?.attrs?.href || ""
      : editor.getAttributes("link")?.href || "";

  const existingTarget =
    isImageSelection
      ? selection.node?.attrs?.linkTarget || null
      : editor.getAttributes("link")?.target || null;

  // ========================================================
  // SELECTED TEXT
  // ========================================================

  const selectedText =
    !isImageSelection
      ? editor.state.doc.textBetween(
          selection.from,
          selection.to,
          " "
        )
      : "";

  // ========================================================
  // STATE
  // ========================================================

  const [url, setUrl] =
    useState(existingHref);

  const [text, setText] =
    useState(selectedText);

  const [newTab, setNewTab] =
    useState(
      existingTarget === "_blank"
    );

  const [error, setError] =
    useState("");

  // ========================================================
  // SYNC WITH EDITOR
  // ========================================================

  useEffect(() => {
    setUrl(existingHref);

    setNewTab(
      existingTarget === "_blank"
    );

    if (!isImageSelection) {
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          " "
        ) || ""
      );
    }
  }, [
    editor,
    existingHref,
    existingTarget,
    isImageSelection,
  ]);

  // ========================================================
  // SUBMIT
  // ========================================================

  const submit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(
      "🟢 LINK SUBMIT FIRED"
    );

    // ======================================================
    // EMPTY URL
    // ======================================================

    if (!url.trim()) {
      console.log(
        "🟡 EMPTY URL → REMOVING LINK"
      );

      if (isImageSelection) {
        editor
          .chain()
          .focus()
          .updateAttributes(
            "image",
            {
              href: null,
              linkTarget: null,
            }
          )
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .unsetLink()
          .run();
      }

      onClose?.();

      return;
    }

    // ======================================================
    // NORMALIZE URL
    // ======================================================

    const normalized =
      normalizeUrl(url);

    // ======================================================
    // VALIDATE
    // ======================================================

    if (
      !URL_PATTERN.test(
        normalized
      )
    ) {
      setError(
        "সঠিক একটা লিংক দাও (যেমন example.com অথবা https://example.com)"
      );

      return;
    }

    // ======================================================
    // IMAGE LINK
    // ======================================================

    if (isImageSelection) {
      console.log(
        "🖼️ SETTING IMAGE LINK:",
        normalized
      );

      const success =
        editor
          .chain()
          .focus()
          .updateAttributes(
            "image",
            {
              href: normalized,
              linkTarget:
                newTab
                  ? "_blank"
                  : null,
            }
          )
          .run();

      if (!success) {
        setError(
          "Image link could not be saved."
        );

        return;
      }

      onClose?.();

      return;
    }

    // ======================================================
    // TEXT LINK
    // ======================================================

    const linkAttrs = {
      href: normalized,
      target:
        newTab
          ? "_blank"
          : null,
    };

    // ======================================================
    // INSERT NEW LINK TEXT
    // ======================================================

    if (
      text.trim() &&
      selection.empty
    ) {
      console.log(
        "🔗 INSERTING NEW TEXT LINK"
      );

      const success =
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text: text.trim(),
            marks: [
              {
                type: "link",
                attrs: linkAttrs,
              },
            ],
          })
          .run();

      if (!success) {
        setError(
          "Link could not be inserted."
        );

        return;
      }
    }

    // ======================================================
    // APPLY TO SELECTED TEXT
    // ======================================================

    else {
      console.log(
        "🔗 APPLYING LINK TO SELECTION"
      );

      const success =
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink(linkAttrs)
          .run();

      if (!success) {
        setError(
          "Link could not be applied."
        );

        return;
      }
    }

    onClose?.();
  };

  // ========================================================
  // CLOSE
  // ========================================================

  const closeModal = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    console.log(
      "🔴 LINK MODAL CLOSED"
    );

    onClose?.();
  };

  // ========================================================
  // MODAL
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
        // Only backdrop click closes modal
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
              {isImageSelection
                ? "Image link"
                : "Inline link"}
            </p>

            <h2>
              {existingHref
                ? "Edit link"
                : "Add link"}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ==================================================
            IMAGE INFO
        ================================================== */}

        {isImageSelection && (
          <p className="selection-preview">
            নির্বাচিত ছবিতে লিংক যুক্ত হবে
          </p>
        )}

        {/* ==================================================
            SELECTED TEXT
        ================================================== */}

        {!isImageSelection &&
          !selection.empty && (
            <p className="selection-preview">
              Selected: "{selectedText}"
            </p>
          )}

        {/* ==================================================
            URL
        ================================================== */}

        <label
          className="field-label"
          htmlFor="link-url"
        >
          URL
        </label>

        <input
          id="link-url"
          className="field"
          type="text"
          value={url}
          onChange={(event) => {
            setUrl(
              event.target.value
            );

            setError("");
          }}
          placeholder="https://example.com"
          autoFocus
        />

        {/* ==================================================
            LINK TEXT
        ================================================== */}

        {!isImageSelection &&
          selection.empty && (
            <>
              <label
                className="field-label"
                htmlFor="link-text"
              >
                Link text
              </label>

              <input
                id="link-text"
                className="field"
                type="text"
                value={text}
                onChange={(event) => {
                  setText(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Read more"
              />
            </>
          )}

        {/* ==================================================
            NEW TAB
        ================================================== */}

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={newTab}
            onChange={(event) => {
              setNewTab(
                event.target.checked
              );
            }}
          />

          <span>
            Open in a new tab
          </span>
        </label>

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
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button--primary"
          >
            Save link
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

export default LinkModal;