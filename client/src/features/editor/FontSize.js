import { Extension } from '@tiptap/core';

// ---------------------------------------------------------------------------
// FontSize — TipTap-এ built-in কোনো font-size extension নেই, তাই এটা
// আগে থেকে থাকা `textStyle` mark-এর উপর নতুন attribute হিসেবে বসানো হয়েছে।
// এর মানে: তোমার editor-এ TextStyle extension (যেটা Color-ও ব্যবহার করে,
// setColor/unsetColor থেকে বোঝা যায়) আগে থেকেই লোড থাকতে হবে।
// ---------------------------------------------------------------------------
export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const value = element.style.fontSize;
              return value ? parseInt(value, 10) : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
  (size) =>
  ({ chain }) =>
    chain()
      .setMark("textStyle", { fontSize: size })   // শুধু number, unit ছাড়া
      .run(),

      unsetFontSize:
        () =>
        ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

export default FontSize;
