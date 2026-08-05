import { Mark, mergeAttributes } from '@tiptap/core';

// ---------------------------------------------------------------------------
// TextBackground — এটা আলাদা একটা mark, পুরোনো `Highlight` extension-এর
// পরিবর্তে ব্যবহারের জন্য। কারণ পুরোনো Highlight শুধু background-color
// সাপোর্ট করে, gradient না — আর আমাদের bubble menu-তে solid রং-এর পাশাপাশি
// gradient স্টাইলের background (ছবির sample অনুযায়ী) দুটোই লাগবে।
// ---------------------------------------------------------------------------
export const TextBackground = Mark.create({
  name: 'textBackground',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      background: {
        default: null,
        parseHTML: (element) => element.style.backgroundImage !== 'none' && element.style.backgroundImage
          ? element.style.backgroundImage
          : element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.background) return {};
          const isGradient = attributes.background.includes('gradient');

          // box-decoration-break: clone — লাইন wrap করলেও প্রতিটা লাইনে
          // gradient/background পুরোপুরি রেন্ডার হয়, একটানা লাইনের মাঝে
          // কেটে যায় না।
          return {
            style: isGradient
              ? `background-image: ${attributes.background}; -webkit-box-decoration-break: clone; box-decoration-break: clone; border-radius: 3px; padding: 0.05em 0.15em;`
              : `background-color: ${attributes.background}; -webkit-box-decoration-break: clone; box-decoration-break: clone; border-radius: 3px; padding: 0.05em 0.15em;`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*="background"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTextBackground:
        (background) =>
        ({ chain }) => chain().setMark(this.name, { background }).run(),

      unsetTextBackground:
        () =>
        ({ chain }) => chain().unsetMark(this.name).run(),
    };
  },
});

export default TextBackground;
