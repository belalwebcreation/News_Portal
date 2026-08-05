// src/features/pages/components/ShareButtons.jsx
//
// Article share row for ArticleDetails.jsx — fully self-contained,
// styled with Tailwind only. The old imports of "../../pages/style.css"
// and "../../../editor/styles.css" (unrelated editor CSS) are removed —
// that stray editor-CSS import was the most likely reason buttons felt
// broken: editor stylesheets commonly reset pointer-events/z-index and
// bleed into unrelated components. Nothing outside this file can affect
// its look or behavior any more.
//
// Behavior (unchanged, was already solid):
//  - Facebook/X/LinkedIn/WhatsApp/Email are real <a href> links, not
//    window.open() calls — middle-click, "open in new tab," and popup
//    blockers all behave the way a user expects.
//  - navigator.share is offered as an extra button when available,
//    feature-detected, never assumed.
//  - Copy-link uses the Clipboard API with a hidden-textarea +
//    execCommand fallback for older browsers / non-HTTPS contexts.
//  - Copy result is announced via an aria-live region for screen
//    readers, not just a visual icon swap.
//
// Props:
//  - layout  : "horizontal" (inline row)  | "vertical" (floating rail)
//  - variant : "card" (bordered row + label, default)
//              | "compact" (icon-only glass pill — hero corner badge /
//                floating rail, where space is tight)

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Share2, Copy, Check, Mail, MessageCircle } from "lucide-react";

const COPY_RESET_DELAY = 2000;

// ---------------------------------------------------------------------------
// Brand marks — drawn in this app's own stroke-icon style, not the
// platforms' logo files.
// ---------------------------------------------------------------------------
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="9" x2="6" y2="18" />
    <circle cx="6" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
    <path d="M10.5 18v-5.5a2.5 2.5 0 0 1 5 0V18" />
    <line x1="10.5" y1="9" x2="10.5" y2="18" />
  </svg>
);

function buildShareLinks({ url, title, summary }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");
  const shareText = summary ? `${title} — ${summary}` : title || "";

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText ? `${shareText} ${url}` : url)}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(shareText ? `${shareText}\n\n${url}` : url)}`,
  };
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

// Shared button look — no external CSS class needed.
const btnBase =
  "inline-flex shrink-0 items-center justify-center rounded-full border " +
  "border-slate-200 bg-white text-slate-500 shadow-sm transition-all " +
  "duration-200 ease-out hover:-translate-y-0.5 hover:text-white hover:shadow-md " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 " +
  "focus-visible:ring-offset-2 active:translate-y-0";

const btnSize = {
  card: "h-9 w-9",
  compact: "h-8 w-8 border-white/60 bg-white/85 backdrop-blur-sm",
};

const BRAND_HOVER = {
  native: "hover:bg-teal-600 hover:border-teal-600",
  facebook: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  x: "hover:bg-black hover:border-black",
  linkedin: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
  whatsapp: "hover:bg-[#25D366] hover:border-[#25D366]",
  email: "hover:bg-slate-700 hover:border-slate-700",
  copy: "hover:bg-teal-600 hover:border-teal-600",
};

export function ShareButtons({
  url,
  title,
  summary,
  className = "",
  layout = "horizontal",
  variant = "card",
}) {
  const [copyState, setCopyState] = useState("idle"); // idle | copied | error
  const resetTimerRef = useRef(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
  const links = buildShareLinks({ url: shareUrl, title, summary });

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopyState("idle"), COPY_RESET_DELAY);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: summary, url: shareUrl });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  const isCompact = variant === "compact";
  const isVertical = layout === "vertical";
  const size = isCompact ? btnSize.compact : btnSize.card;
  const iconBtn = (key) => `${btnBase} ${size} ${BRAND_HOVER[key]}`;

  const containerClass = isCompact
    ? `inline-flex ${isVertical ? "flex-col" : "flex-row"} items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-2 py-1.5 shadow-md backdrop-blur-md`
    : isVertical
    ? "inline-flex flex-col items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2 py-3 shadow-lg backdrop-blur"
    : "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:px-5";

  return (
    <div className={`${containerClass} ${className}`.trim()} role="group" aria-label="Share this article">
      {!isCompact && !isVertical && (
        <span className="text-sm font-semibold text-slate-700">শেয়ার করুন</span>
      )}

      <div className={`flex ${isVertical ? "flex-col" : "flex-row"} flex-wrap items-center gap-2`}>
        {canNativeShare && (
          <button type="button" className={iconBtn("native")} onClick={handleNativeShare} title="Share" aria-label="Share this article">
            <Share2 size={16} strokeWidth={2.2} />
          </button>
        )}

        <a className={iconBtn("facebook")} href={links.facebook} target="_blank" rel="noopener noreferrer" title="Share on Facebook" aria-label="Share on Facebook">
          <FacebookIcon />
        </a>

        <a className={iconBtn("x")} href={links.x} target="_blank" rel="noopener noreferrer" title="Share on X" aria-label="Share on X">
          <XIcon />
        </a>

        <a className={iconBtn("linkedin")} href={links.linkedin} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" aria-label="Share on LinkedIn">
          <LinkedInIcon />
        </a>

        <a className={iconBtn("whatsapp")} href={links.whatsapp} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" aria-label="Share on WhatsApp">
          <MessageCircle size={16} strokeWidth={2.2} />
        </a>

        <a className={iconBtn("email")} href={links.email} title="Share by email" aria-label="Share by email">
          <Mail size={16} strokeWidth={2.2} />
        </a>

        <button
          type="button"
          className={`${iconBtn("copy")} ${copyState === "copied" ? "!border-teal-600 !bg-teal-600 !text-white" : ""}`}
          onClick={handleCopy}
          title="Copy link"
          aria-label="Copy article link"
        >
          {copyState === "copied" ? <Check size={16} strokeWidth={2.4} /> : <Copy size={16} strokeWidth={2.2} />}
        </button>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {copyState === "copied" && "Link copied to clipboard"}
        {copyState === "error" && "Couldn't copy the link — please copy it manually"}
      </span>
    </div>
  );
}

ShareButtons.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  summary: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(["horizontal", "vertical"]),
  variant: PropTypes.oneOf(["card", "compact"]),
};

export default ShareButtons;