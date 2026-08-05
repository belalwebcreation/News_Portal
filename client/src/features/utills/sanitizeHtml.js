const ALLOWED_TAGS = new Set([
  'a', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'hr',
  'img', 'li', 'ol', 'p', 'pre', 's', 'strong', 'table', 'tbody', 'td', 'th',
  'thead', 'tr', 'u', 'ul', 'figure', 'figcaption', 'mark', 'span', 'iframe', // এখানে 'div' যোগ করা হয়েছে
]);

const ALLOWED_ATTRIBUTES = new Set([
  'alt', 'class', 'colspan', 'data-align', 'data-language', 'data-media-id',
  'data-mention-id', 'data-mention-label', 'data-youtube-video', 'height', 'href', 'rel', 'src',
  'target', 'title', 'width', 'style', 'frameborder', 'allow',
  'allowfullscreen', 'loading', 'referrerpolicy', // এখানে 'data-youtube-video' যোগ করা হয়েছে
]);

// style attribute-এর জন্য allowed CSS property-গুলো।
// border-radius/padding/box-decoration-break যোগ করা হয়েছে কারণ
// TextBackground extension এই properties-গুলোও একই style string-এ বসায়
// (highlight-এর rounded corner আর line-wrap ঠিক রাখার জন্য)।
// font-size যোগ করা হয়েছে কারণ FontSize extension টেক্সট-স্টাইলে
// শুধু এই একটা property-ই বসায় — আগে allow-list-এ না থাকায় পুরো
// style attribute-ই বাদ পড়ে যাচ্ছিল।
const ALLOWED_STYLE_PROPERTIES = new Set([
  'text-align',
  'width',
  'height',
  'color',
  'font-size',
  'background',
  'background-color',
  'background-image',
  'border-radius',
  'padding',
  'box-decoration-break',
  '-webkit-box-decoration-break',
]);

// আগে এই ফাংশন পুরো style attribute-কে "সব declaration allowed হলে pass,
// নাহলে পুরোটাই reject" — এই all-or-nothing নিয়মে validate করত।
// সমস্যা: TextBackground একটা style-এ background-color-এর পাশাপাশি
// border-radius/padding-ও বসায়; ওই দুটো allow-list-এ না থাকায় পুরো
// attribute-ই (background-color সহ) বাদ পড়ে যাচ্ছিল।
// এখন এটা filter করে — শুধু non-allowed/unsafe declaration-গুলো বাদ দেয়,
// allowed অংশটা রেখে দেয়।
function sanitizeStyleValue(value) {
  const declarations = String(value)
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  const safeDeclarations = declarations.reduce((acc, declaration) => {
    const separatorIndex = declaration.indexOf(':');
    if (separatorIndex === -1) return acc;

    const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
    const propValue = declaration.slice(separatorIndex + 1).trim();

    if (!ALLOWED_STYLE_PROPERTIES.has(property)) return acc;
    if (!propValue) return acc;
    // url()/expression()/javascript: দিয়ে CSS-injection ঠেকানো
    if (/url\s*\(|expression\s*\(|javascript:/iu.test(propValue)) return acc;

    acc.push(`${property}: ${propValue}`);
    return acc;
  }, []);

  return safeDeclarations.length > 0 ? `${safeDeclarations.join('; ')};` : null;
}

function isSafeUrl(value, { allowDataImage = true } = {}) {
  if (!value) return false;
  const trimmed = String(value).trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./')) return true;
  try {
    const url = new URL(trimmed, 'https://example.invalid');
    if (url.protocol === 'https:' || url.protocol === 'http:') return true;
    return allowDataImage && url.protocol === 'data:' && /^data:image\/(png|jpe?g|gif|webp);/iu.test(trimmed);
  } catch {
    return false;
  }
}

function sanitizeNode(node, options) {
  if (node.nodeType === 3) return node.cloneNode(true);
  if (node.nodeType !== 1) return null;

  const tagName = node.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tagName)) {
    const fragment = node.ownerDocument.createDocumentFragment();
    [...node.childNodes].forEach((child) => {
      const safeChild = sanitizeNode(child, options);
      if (safeChild) fragment.appendChild(safeChild);
    });
    return fragment;
  }

  const clean = node.ownerDocument.createElement(tagName);
  [...node.attributes].forEach(({ name, value }) => {
    const lowerName = name.toLowerCase();
    if (!ALLOWED_ATTRIBUTES.has(lowerName) || lowerName.startsWith('on')) return;

    if (lowerName === 'style') {
      const safeStyle = sanitizeStyleValue(value);
      if (safeStyle) clean.setAttribute('style', safeStyle);
      return;
    }

    if (['href', 'src'].includes(lowerName) && !isSafeUrl(value, options)) return;
    if (lowerName === 'target' && !['_blank', '_self', '_parent', '_top'].includes(value)) return;
    clean.setAttribute(lowerName, value);
  });

  if (tagName === 'a' && clean.getAttribute('target') === '_blank') {
    clean.setAttribute('rel', 'noopener noreferrer nofollow');
  }
  if (tagName === 'iframe') {
    const src = clean.getAttribute('src') || '';
    if (!/^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//iu.test(src)) return null;
    clean.setAttribute('loading', 'lazy');
    clean.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  }

  [...node.childNodes].forEach((child) => {
    const safeChild = sanitizeNode(child, options);
    if (safeChild) clean.appendChild(safeChild);
  });
  return clean;
}

export function sanitizeHtml(html = '', options = {}) {
  if (!html) return '';
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s(?:href|src)\s*=\s*(["'])javascript:[\s\S]*?\1/giu, '')
      .replace(/\s(?:href|src)\s*=\s*javascript:[^\s>]+/giu, '')
      .replace(/javascript:/gi, '');
  }

  const document = new window.DOMParser().parseFromString(String(html), 'text/html');
  const fragment = document.createDocumentFragment();
  [...document.body.childNodes].forEach((node) => {
    const clean = sanitizeNode(node, options);
    if (clean) fragment.appendChild(clean);
  });
  const container = document.createElement('div');
  container.appendChild(fragment);
  return container.innerHTML;
}

export default sanitizeHtml;
