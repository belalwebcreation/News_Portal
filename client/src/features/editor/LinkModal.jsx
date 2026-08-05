import React, {
  useEffect,
  useState,
} from "react";

import {
  NodeSelection,
} from "@tiptap/pm/state";


const URL_PATTERN =
  /^(https?:\/\/|mailto:|tel:)/iu;


// ==========================================================
// NORMALIZE URL
// ==========================================================

const normalizeUrl = (value) => {

  const trimmed =
    value.trim();


  if (!trimmed) {

    return "";

  }


  if (
    URL_PATTERN.test(
      trimmed
    )
  ) {

    return trimmed;

  }


  if (
    trimmed.includes("@") &&
    !trimmed.includes("/")
  ) {

    return `mailto:${trimmed}`;

  }


  return `https://${trimmed}`;

};


// ==========================================================
// LINK MODAL
// ==========================================================

export function LinkModal({
  editor,
  onClose,
}) {


  const selection =
    editor?.state.selection;


  const isImageSelection =

    selection instanceof NodeSelection &&

    selection.node?.type.name ===
      "image";


  const existingHref =

    isImageSelection

      ? selection.node.attrs.href || ""

      : editor?.getAttributes(
          "link"
        ).href || "";


  const existingTarget =

    isImageSelection

      ? selection.node.attrs.linkTarget

      : editor?.getAttributes(
          "link"
        ).target;


  const [
    url,
    setUrl,
  ] = useState(
    existingHref
  );


  const [
    text,
    setText,
  ] = useState(

    !isImageSelection

      ? editor?.state.doc.textBetween(

          selection?.from ?? 0,

          selection?.to ?? 0,

          " "

        ) || ""

      : ""

  );


  const [
    newTab,
    setNewTab,
  ] = useState(

    existingTarget ===
      "_blank"

  );


  const [
    error,
    setError,
  ] = useState("");


  // ========================================================
  // UPDATE WHEN EDITOR / SELECTION CHANGES
  // ========================================================

  useEffect(() => {

    setUrl(
      existingHref
    );

    setNewTab(
      existingTarget ===
        "_blank"
    );

  }, [
    editor,
    existingHref,
    existingTarget,
  ]);


  // ========================================================
  // SUBMIT
  // ========================================================

  const submit = (
    event
  ) => {

    event.preventDefault();


    // ======================================================
    // EMPTY URL
    // ======================================================

    if (
      !url.trim()
    ) {


      if (
        isImageSelection
      ) {

        editor
          .chain()
          .focus()
          .updateAttributes(
            "image",
            {

              href:
                null,

              linkTarget:
                null,

            }

          )
          .run();

      } else {

        editor
          .chain()
          .focus()
          .extendMarkRange(
            "link"
          )
          .unsetLink()
          .run();

      }


      onClose?.();

      return;

    }


    // ======================================================
    // NORMALIZE + VALIDATE URL
    // ======================================================

    const normalized =
      normalizeUrl(
        url
      );


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

    if (
      isImageSelection
    ) {

      editor
        .chain()
        .focus()
        .updateAttributes(
          "image",
          {

            href:
              normalized,

            linkTarget:
              newTab
                ? "_blank"
                : null,

          }

        )
        .run();


      onClose?.();

      return;

    }


    // ======================================================
    // TEXT LINK
    // ======================================================

    const linkAttrs = {

      href:
        normalized,

      target:
        newTab
          ? "_blank"
          : null,

    };

    


    if (
      text &&
      selection.empty
    ) {

      editor
        .chain()
        .focus()
        .insertContent({

          type:
            "text",

          text,

          marks: [

            {

              type:
                "link",

              attrs:
                linkAttrs,

            },

          ],

        })

        .run();

    } else {

      editor
        .chain()
        .focus()
        .extendMarkRange(
          "link"
        )
        .setLink(
          linkAttrs
        )
        .run();

    }


    onClose?.();

  };


  return (

    <div

      className="modal__backdrop"

      role="presentation"

      onMouseDown={

        (event) => {

          if (

            event.target ===
            event.currentTarget

          ) {

            onClose?.();

          }

        }

      }

    >

      <form

        className="modal modal--small"

        onSubmit={
          submit
        }

        onMouseDown={

          (event) =>
            event.stopPropagation()

        }

      >


        {/* =================================================
            HEADER
            ================================================= */}

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

            onClick={
              onClose
            }

            aria-label="Close"

          >

            ×

          </button>

        </div>


        {/* =================================================
            IMAGE PREVIEW
            ================================================= */}

        {isImageSelection && (

          <p className="selection-preview">

            নির্বাচিত ছবিতে লিংক যুক্ত হবে

          </p>

        )}


        {/* =================================================
            TEXT SELECTION PREVIEW
            ================================================= */}

        {!isImageSelection &&
          !selection?.empty && (

            <p className="selection-preview">

              Selected: "{text}"

            </p>

          )}


        {/* =================================================
            URL
            ================================================= */}

        <label

          className="field-label"

          htmlFor="link-url"

        >

          URL

        </label>


        <input

          id="link-url"

          className="field"

          value={
            url
          }

          onChange={

            (event) => {

              setUrl(
                event.target.value
              );

              setError(
                ""
              );

            }

          }

          placeholder="https://example.com"

          autoFocus

        />


        {/* =================================================
            LINK TEXT
            ================================================= */}

        {!isImageSelection &&
          selection?.empty && (

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

                value={
                  text
                }

                onChange={

                  (event) =>
                    setText(
                      event.target.value
                    )

                }

                placeholder="Read more"

              />

            </>

          )}


        {/* =================================================
            NEW TAB
            ================================================= */}

        <label className="checkbox-field">

          <input

            type="checkbox"

            checked={
              newTab
            }

            onChange={

              (event) =>
                setNewTab(
                  event.target.checked
                )

            }

          />

          Open in a new tab

        </label>


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <p className="field-error">

            {error}

          </p>

        )}


        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="modal__footer">

          <button

            type="button"

            className="button button--ghost"

            onClick={
              onClose
            }

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

}


export default LinkModal;