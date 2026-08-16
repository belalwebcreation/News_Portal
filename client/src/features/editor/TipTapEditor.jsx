import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { EditorContent } from "@tiptap/react";

import useArticleEditor from "../hooks/useArticleEditor";
import useImageUpload from "../hooks/useImageUpload";

import MenuBar from "./MenuBar";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";
import ImageUploader from "./ImageUploader";
import LinkModal from "./LinkModal";
import TableToolbar from "./TableToolbar";
import YoutubeEmbed from "./YoutubeEmbed";
import MentionPicker from "./Mention";

import "./styles.css";


export function TipTapEditor({

  value = "",

  onChange,

  editable = true,

  placeholder =
    "Start writing your article…",

  uploadImage,

  onWordCount,

  onReady,

  autofocus = false,

  className = "",

}) {


  const [
    modal,
    setModal,
  ] = useState(null);

  useEffect(() => {
  console.log('🟣 TipTapEditor MOUNTED');
  return () => console.log('🔴 TipTapEditor UNMOUNTED');
}, []);

useEffect(() => {
  console.trace('🔵 MODAL STATE CHANGED TO:', modal);
}, [modal]);


  const {
    editor,
    getMetrics,
  } = useArticleEditor({

    content:
      value,

    editable,

    placeholder,

    autofocus,

    onReady,

    onChange:
      (html, changedEditor) => {

        console.log(changedEditor.getHTML());

        onChange?.(
          html,
          changedEditor
        );

        onWordCount?.(
          getMetrics()
        );

      },

  });


  const imageUpload =
    useImageUpload({

      upload:
        uploadImage,

    });


  // ==========================================================
  // IMAGE LINK MODAL EVENT BRIDGE
  // ==========================================================

  useEffect(() => {

    if (!editor) {

      return undefined;

    }
    


    const openLinkModal =
      () => {

        setModal(
          "link"
        );

      };


    editor.on(

      "openLinkModal",

      openLinkModal

    );


    return () => {

      editor.off(

        "openLinkModal",

        openLinkModal

      );

    };

  }, [editor]);


  // ==========================================================
  // INSERT IMAGE
  // ==========================================================

  const insertImage = useCallback(

    async (
      file,
      attributes = {}
    ) => {

      const asset =
        await imageUpload.upload(
          file
        );
        console.log(asset);
        console.log("IMAGE URL =", asset.url);


      editor
        ?.chain()
        .focus()
        .setImage({

          src:
            asset.url,

          alt:
            attributes.alt ||
            asset.name,

          title:
            attributes.alt ||
            asset.name,

          mediaId:
            asset.public_id ||
            null,

        })
        .run();
        console.log(editor.getHTML());


      return asset;

    },

    [
      editor,
      imageUpload,
    ]

  );


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (!editor) {

    return (

      <div className="article-editor article-editor--loading">

        <div className="editor-skeleton" />

        <div className="editor-skeleton editor-skeleton--short" />

      </div>

    );

  }


  return (

    <div

      className={

        `article-editor${
          editable
            ? ""
            : " article-editor--readonly"
        } ${className}`.trim()

      }

    >


      {/* =====================================================
          MAIN MENU
          ===================================================== */}

      {editable && (
  <div className="article-editor__toolbar-group">
    <MenuBar
      editor={editor}
      onOpenLink={() => setModal("link")}
      onInsertImage={() => setModal("image")}
      onInsertYoutube={() => setModal("youtube")}
      onOpenMention={() => setModal("mention")}
    />
    <TableToolbar editor={editor} />
  </div>
)}

{/* EDITOR SURFACE */}
<div className="article-editor__surface">

        <BubbleMenu
          editor={editor}
          onOpenLink={() => setModal("link")}
          onInsertImage={() => setModal("image")}
          onInsertYoutube={() => setModal("youtube")}
        />


        {editable && (

          <FloatingMenu

            editor={
              editor
            }

            onInsertImage={() =>
              setModal(
                "image"
              )
            }

            onInsertYoutube={() =>
              setModal(
                "youtube"
              )
            }

          />

        )}


        <EditorContent

          editor={
            editor
          }

        />

      </div>


      {/* =====================================================
          IMAGE UPLOAD MODAL
          ===================================================== */}

      {modal === "image" && (

        <ImageUploader

          editor={
            editor
          }

          onUpload={
            insertImage
          }

          onClose={() =>
            setModal(
              null
            )
          }

          isUploading={
            imageUpload.isUploading
          }

          progress={
            imageUpload.progress
          }

        />

      )}


      {/* =====================================================
          LINK MODAL
          ===================================================== */}

      {modal === "link" && (

        <LinkModal

          editor={
            editor
          }

          onClose={() =>
            setModal(
              null
            )
          }

        />

      )}


      {/* =====================================================
          YOUTUBE MODAL
          ===================================================== */}

      {modal === "youtube" && (

        <YoutubeEmbed

          editor={
            editor
          }

          onClose={() =>
            setModal(
              null
            )
          }

        />

      )}


      {/* =====================================================
          MENTION MODAL
          ===================================================== */}

      {modal === "mention" && (

        <div

          className="modal__backdrop"

          role="presentation"

          onMouseDown={

            (event) => {

              if (

                event.target ===
                event.currentTarget

              ) {

                setModal(
                  null
                );

              }

            }

          }

        >

          <MentionPicker

            editor={
              editor
            }

            onClose={() =>
              setModal(
                null
              )
            }

          />

        </div>

      )}

    </div>

  );

}


export default TipTapEditor;