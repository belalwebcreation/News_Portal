import Placeholder from "@tiptap/extension-placeholder";

export const CustomPlaceholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return "Write headline...";
    }

    return "Start writing your article...";
  },

  emptyEditorClass: "is-editor-empty",
});