// src/features/pages/components/BookmarkButton.jsx

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import profileService from "../../../../services/profileService";

const BookmarkIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M6 4h12v16l-6-4-6 4V4z" />
  </svg>
);

BookmarkIcon.propTypes = {
  filled: PropTypes.bool,
};

const BookmarkButton = ({
  newsId,
  initialCount = 0,
}) => {
  // AuthContext-এর actual property হলো userInfo
  const { userInfo, isLoggedIn } = useAuth();

  const navigate = useNavigate();

  const [bookmarked, setBookmarked] = useState(false);
  const [count, setCount] = useState(
    Number.isFinite(initialCount) ? initialCount : 0
  );

  const [checking, setChecking] = useState(
    Boolean(isLoggedIn && userInfo)
  );

  const [toggling, setToggling] = useState(false);

  // ======================================================
  // Check current bookmark status
  // ======================================================

  useEffect(() => {
    if (!newsId) {
      setChecking(false);
      return;
    }

    // User logged out হলে status check করার দরকার নেই
    if (!isLoggedIn || !userInfo) {
      setBookmarked(false);
      setChecking(false);
      return;
    }

    let mounted = true;

    setChecking(true);

    profileService
      .getBookmarkStatus(newsId)
      .then((res) => {
        if (!mounted) return;

        setBookmarked(Boolean(res?.bookmarked));
      })
      .catch((error) => {
        if (!mounted) return;

        console.error(
          "Failed to check bookmark status:",
          error
        );

        // Status check fail করলেও user-কে logout করব না।
        setBookmarked(false);
      })
      .finally(() => {
        if (mounted) {
          setChecking(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [newsId, isLoggedIn, userInfo]);

  // ======================================================
  // Toggle Bookmark
  // ======================================================

  const handleClick = async () => {
    // Authentication না থাকলে login page
    if (!isLoggedIn || !userInfo) {
      navigate("/login");
      return;
    }

    // Duplicate request prevent
    if (checking || toggling || !newsId) {
      return;
    }

    const previousBookmarked = bookmarked;
    const previousCount = count;

    // Optimistic UI
    const nextBookmarked = !previousBookmarked;

    setBookmarked(nextBookmarked);

    setCount(
      nextBookmarked
        ? previousCount + 1
        : Math.max(previousCount - 1, 0)
    );

    setToggling(true);

    try {
      const res = await profileService.toggleBookmark(
        newsId
      );

      // Backend response অনুযায়ী final state
      const finalBookmarked = Boolean(
        res?.bookmarked
      );

      setBookmarked(finalBookmarked);

      // Backend থেকে actual count এলে সেটাই ব্যবহার করব
      if (
        typeof res?.bookmarksCount === "number"
      ) {
        setCount(res.bookmarksCount);
      }
    } catch (error) {
      console.error(
        "Failed to toggle bookmark:",
        error
      );

      // API fail হলে optimistic change rollback
      setBookmarked(previousBookmarked);
      setCount(previousCount);
    } finally {
      setToggling(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={checking || toggling}
      aria-pressed={bookmarked}
      aria-label={
        bookmarked
          ? "Remove bookmark"
          : "Bookmark this article"
      }
      title={
        bookmarked
          ? "বুকমার্ক সরান"
          : "বুকমার্ক করুন"
      }
   className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-meta text-xs font-semibold ring-1 ring-inset transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        bookmarked
          ? "bg-accent/10 text-accent ring-accent/30"
          : "bg-ink/[0.03] text-graphite ring-ink/10 hover:bg-ink/[0.06] dark:bg-paper/[0.03] dark:text-paper/70 dark:ring-paper/10 dark:hover:bg-paper/[0.06]"
      }`}
    >
      <BookmarkIcon filled={bookmarked} />

      {count > 0 && (
        <span>{count}</span>
      )}
    </button>
  );
};

BookmarkButton.propTypes = {
  newsId: PropTypes.string.isRequired,
  initialCount: PropTypes.number,
};

export default BookmarkButton;