import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Mention from "@tiptap/extension-mention";
import Image from "@tiptap/extension-image";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";




import { mergeAttributes } from "@tiptap/core";

// Color extension removed: not used in this file

import {
  ReactRenderer,
  ReactNodeViewRenderer
} from "@tiptap/react";

import tippy from "tippy.js";

import { Plugin } from "prosemirror-state";


import { CustomPlaceholder } from "./Placeholder";
import { MentionList } from "./Mention";
import ImageResize from "./ImageResize";
import FontSize from "./FontSize";
import TextBackground from "./TextBackground";


import { searchMentionUsers } from "../../services/mentionService";



// =================================
// Custom Image Extension
// =================================

const CustomImage = Image.extend({

  draggable: true,

  selectable: true,


  addAttributes() {

    return {

      ...this.parent?.(),


      mediaId: {
        default: null,

        parseHTML: (element) =>
          element.getAttribute("data-media-id"),

        renderHTML: (attributes) => {

          if (!attributes.mediaId) {
            return {};
          }

          return {
            "data-media-id": attributes.mediaId
          };

        }

      },


      width: {

        default: "50%",

        parseHTML: (element) =>
          element.getAttribute("width"),

        renderHTML: (attributes) => {

          if (!attributes.width) {
            return {};
          }

          return {
            width: attributes.width
          };

        }

      },


      height: {
        default: null
      },


      alt: {
        default: null
      },


      title: {
        default: null
      },


      align: {

        default: "center",

        parseHTML: (element) =>
          element.getAttribute("data-align"),

        renderHTML: (attributes) => {

          return {
            "data-align": attributes.align
          };

        }

      },


      href: {

        default: null,

        parseHTML: (element) =>
          element.closest("a")?.getAttribute("href") || null,

        renderHTML: () => ({}),

      },


      linkTarget: {

        default: null,

        parseHTML: (element) =>
          element.closest("a")?.getAttribute("target") || null,

        renderHTML: () => ({}),

      },

    };

  },


  // ==========================================================
  // IMAGE LINK RENDERING
  // ==========================================================

  renderHTML({ node, HTMLAttributes }) {

    const img = [
      "img",

      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes
      ),

    ];


    if (!node.attrs.href) {

      return img;

    }


    return [

      "a",

      {

        href: node.attrs.href,

        target:
          node.attrs.linkTarget || null,

        rel:
          "noopener noreferrer nofollow",

      },

      img,

    ];

  },


  // ==========================================================
  // REACT IMAGE RESIZE NODE VIEW
  // ==========================================================

  addNodeView() {

    return ReactNodeViewRenderer(
      ImageResize
    );

  },


  // ==========================================================
  // SPACE PRESS PROTECTION
  // ==========================================================

  addProseMirrorPlugins() {

    return [

      new Plugin({

        props: {

          handleKeyDown: (view, event) => {

            const { selection } =
              view.state;


            if (

              selection.node &&

              selection.node.type.name === "image" &&

              event.code === "Space"

            ) {

              event.preventDefault();

              return true;

            }


            return false;

          }

        }

      })

    ];

  }

});




// =================================
// Safe Link
// =================================

const SafeLink = Link.configure({
  openOnClick: true,
  autolink: true,
  linkOnPaste: true,
  HTMLAttributes: {
    rel: "noopener noreferrer nofollow",
  },
});




// =================================
// Main Extensions
// =================================


export const createEditorExtensions = ()=>[



  StarterKit.configure({
  codeBlock: false,
  link: false,
  underline: false,
  heading: {
    levels: [1, 2, 3],
  },
}),

Underline,

TextStyle,

Color,

FontSize,

TextBackground,

SafeLink,

CustomPlaceholder,

CustomImage.configure({
  allowBase64: true,
}),




  Table.configure({

    resizable:true

  }),



  TableRow,

  TableHeader,

  TableCell,




  Youtube.configure({

    controls:true,

    nocookie:true,

    modestBranding:true

  }),




  TextAlign.configure({

    types:[

      "heading",

      "paragraph"

    ]

  }),




  Highlight.configure({

    multicolor:true

  }),




  Typography,





  Mention.configure({


    HTMLAttributes:{


      class:

      "mention-tag text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded"


    },



    suggestion:{


      char:"@",




      items:async({query})=>{


        if(!query)

          return [];



        const users =
          await searchMentionUsers(query);




        return users.map(user=>({


          id:user._id,


          username:user.username,


          name:user.name,


          role:user.role,


          avatar:user.avatar


        }));


      },





      render:()=>{


        let component;

        let popup;





        return {





          onStart(props){



            component =

            new ReactRenderer(

              MentionList,

              {

                props,

                editor:
                props.editor

              }

            );





            popup =

            tippy(

              document.body,

              {


                getReferenceClientRect:

                props.clientRect,



                appendTo:

                ()=>document.body,



                content:

                component.element,



                showOnCreate:true,



                interactive:true,



                trigger:"manual",



                placement:

                "bottom-start"


              }

            );



          },







          onUpdate(props){



            component?.updateProps(
              props
            );



            popup?.setProps({

              getReferenceClientRect:

              props.clientRect


            });


          },







          onKeyDown(props){



            if(
              props.event.key==="Escape"
            ){


              popup?.hide();


              return true;


            }




            return component?.ref?.onKeyDown(
              props
            );


          },







          onExit(){


            popup?.destroy();


            component?.destroy();


          }




        };



      }



    }



  })



];




export default createEditorExtensions;
