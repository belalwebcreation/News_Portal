import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { NodeViewWrapper } from "@tiptap/react";


const MIN_WIDTH_PERCENT = 15;
const MAX_WIDTH_PERCENT = 100;


const CORNERS = [
  "nw",
  "ne",
  "sw",
  "se",
];


const ImageResize = ({
  node,
  updateAttributes,
  selected,
  editor,
}) => {

  const align =
    node.attrs.align || "center";


  const wrapperRef =
    useRef(null);


  const rafRef =
    useRef(null);


  const [
    liveWidthPercent,
    setLiveWidthPercent,
  ] = useState(null);


  const [
    isResizing,
    setIsResizing,
  ] = useState(false);


  const currentWidth =
    liveWidthPercent != null
      ? `${liveWidthPercent}%`
      : node.attrs.width || "50%";


  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {

    return () => {

      if (rafRef.current) {

        cancelAnimationFrame(
          rafRef.current
        );

      }

    };

  }, []);


  // ==========================================================
  // IMAGE RESIZE
  // ==========================================================

  const startResize = useCallback(

    (event, corner) => {

      event.preventDefault();

      event.stopPropagation();


      const wrapperEl =
        wrapperRef.current;


      if (!wrapperEl) {
        return;
      }


      const container =
        wrapperEl.closest(".ProseMirror") ||
        wrapperEl.closest(".article-editor__content") ||
        wrapperEl.parentElement;


      const containerWidth =
        container
          ? container.clientWidth
          : wrapperEl.clientWidth;


      const startWidthPx =
        wrapperEl.getBoundingClientRect().width;


      const startX =
        event.clientX;


      const growsWithPositiveDelta =
        corner === "ne" ||
        corner === "se";


      setIsResizing(true);


      const handlePointerMove =
        (moveEvent) => {

          if (rafRef.current) {

            cancelAnimationFrame(
              rafRef.current
            );

          }


          rafRef.current =
            requestAnimationFrame(() => {

              const deltaX =
                moveEvent.clientX -
                startX;


              const signedDelta =
                growsWithPositiveDelta
                  ? deltaX
                  : -deltaX;


              const newWidthPx =
                startWidthPx +
                signedDelta;


              let newPercent =
                (newWidthPx /
                  containerWidth) *
                100;


              newPercent =
                Math.min(
                  Math.max(
                    newPercent,
                    MIN_WIDTH_PERCENT
                  ),
                  MAX_WIDTH_PERCENT
                );


              setLiveWidthPercent(
                Math.round(newPercent)
              );

            });

        };


      const handlePointerUp =
        () => {

          document.removeEventListener(
            "pointermove",
            handlePointerMove
          );


          document.removeEventListener(
            "pointerup",
            handlePointerUp
          );


          setIsResizing(false);


          setLiveWidthPercent(
            (finalPercent) => {

              if (
                finalPercent != null
              ) {

                updateAttributes({

                  width:
                    `${finalPercent}%`,

                });

              }


              return null;

            }
          );

        };


      document.addEventListener(
        "pointermove",
        handlePointerMove
      );


      document.addEventListener(
        "pointerup",
        handlePointerUp
      );

    },

    [
      updateAttributes,
    ]

  );


  return (

    <NodeViewWrapper

      ref={wrapperRef}

      className={`image-wrapper image-${align}`}

      data-drag-handle

      contentEditable={false}

      style={{

        position:
          "relative",

        width:
          currentWidth,

        float:
          align === "left"
            ? "left"
            : align === "right"
            ? "right"
            : "none",

        margin:
          align === "left"
            ? "4px 20px 10px 0"
            : align === "right"
            ? "4px 0 10px 20px"
            : "10px auto",

        display:
          align === "center"
            ? "block"
            : "inline-block",

      }}

    >

      {/* =====================================================
          IMAGE
          ===================================================== */}

     {node.attrs.href ? (
  <a
    href={node.attrs.href}
    target={node.attrs.linkTarget || "_self"}
    rel="noopener noreferrer nofollow"
    contentEditable={false}
  >
    <img
      src={node.attrs.src}
      alt={node.attrs.alt || ""}
      title={node.attrs.title || ""}
      draggable={false}
      contentEditable={false}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        userSelect: "none",
        WebkitUserDrag: "none",
        pointerEvents: isResizing ? "none" : "auto",
      }}
    />
  </a>
) : (
  <img
    src={node.attrs.src}
    alt={node.attrs.alt || ""}
    title={node.attrs.title || ""}
    draggable={false}
    contentEditable={false}
    style={{
      width: "100%",
      height: "auto",
      display: "block",
      userSelect: "none",
      WebkitUserDrag: "none",
      pointerEvents: isResizing ? "none" : "auto",
    }}
  />
)}


      {/* =====================================================
          IMAGE TOOLBAR
          ===================================================== */}

      {selected && (

        <div

          className="image-toolbar"

          contentEditable={false}

        >

          <button

            type="button"

            onClick={() =>
              updateAttributes({
                align: "left",
              })
            }

          >

            Left

          </button>


          <button

            type="button"

            onClick={() =>
              updateAttributes({
                align: "center",
              })
            }

          >

            Center

          </button>


          <button

            type="button"

            onClick={() =>
              updateAttributes({
                align: "right",
              })
            }

          >

            Right

          </button>


          {/* =================================================
              IMAGE LINK BUTTON
              ================================================= */}

          <button

            type="button"

            className={
              node.attrs.href
                ? "is-active"
                : ""
            }

            onClick={() =>
              editor?.emit(
                "openLinkModal"
              )
            }

          >

            {node.attrs.href
              ? "Edit link"
              : "Link"}

          </button>


          {/* =================================================
              REMOVE IMAGE LINK
              ================================================= */}

          {node.attrs.href && (

            <button

              type="button"

              onClick={() =>
                updateAttributes({

                  href:
                    null,

                  linkTarget:
                    null,

                })

              }

            >

              Remove link

            </button>

          )}

        </div>

      )}


      {/* =====================================================
          RESIZE HANDLES
          ===================================================== */}

      {selected &&

        CORNERS.map(

          (corner) => (

            <div

              key={corner}

              className={
                `resize-handle resize-handle--${corner}`
              }

              draggable={false}

              onDragStart={(event) =>
                event.preventDefault()
              }

              onPointerDown={(event) =>
                startResize(
                  event,
                  corner
                )
              }

            />

          )

        )

      }


      {/* =====================================================
          RESIZE WIDTH BADGE
          ===================================================== */}

      {isResizing &&
        liveWidthPercent != null && (

          <div className="image-resize-badge">

            {liveWidthPercent}%

          </div>

        )

      }


      {/* =====================================================
          LINK BADGE
          ===================================================== */}

      {node.attrs.href &&
        !selected && (

          <div

            className="image-link-badge"

            contentEditable={false}

            title={
              node.attrs.href
            }

          >

            🔗

          </div>

        )

      }

    </NodeViewWrapper>

  );

};


export default ImageResize;