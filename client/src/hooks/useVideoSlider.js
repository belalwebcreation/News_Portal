import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { VIDEO_BREAKPOINTS } from "../constants/videoConfig"; // ১ লেভেল উপরে src/constants

export const useVideoSlider = (videos = []) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(5);
  const [paused, setPaused] = useState(false);

  const pauseTimeoutRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Responsive Breakpoint Listener
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // কনফিগ অ্যারে থেকে প্রথম ম্যাচিং ব্রেকপয়েন্টটি খুঁজে বের করা
      const matchedConfig = VIDEO_BREAKPOINTS.find(bp => width >= bp.minWidth);
      if (matchedConfig) {
        setCardsPerPage(matchedConfig.cardsPerPage);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(videos.length / cardsPerPage));
  }, [videos.length, cardsPerPage]);

  // Autoplay Logic
  useEffect(() => {
    if (paused || totalPages <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, totalPages]);

  // Reset page if out of bounds on breakpoint change
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  // Current page videos slice
  const startIndex = currentPage * cardsPerPage;
  const currentVideos = useMemo(() => {
    return videos.slice(startIndex, startIndex + cardsPerPage);
  }, [videos, startIndex, cardsPerPage]);

  // Manual Page Change Handler
  const handlePageChange = useCallback((newPage) => {
    let targetPage = newPage;
    if (newPage < 0) targetPage = totalPages - 1;
    if (newPage >= totalPages) targetPage = 0;

    setDirection(targetPage > currentPage ? 1 : -1);
    setCurrentPage(targetPage);
  }, [currentPage, totalPages]);

  // 180ms Pause Delay (Fast Cursor Pass-through এড়াতে)
  const handleMouseEnter = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setPaused(true);
    }, 180);
  }, []);

  // 400ms Resume Delay (Smooth Autoplay Restart)
  const handleMouseLeave = useCallback(() => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setPaused(false);
    }, 400);
  }, []);

  // Cleanup Timeout References
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return {
    currentPage,
    direction,
    totalPages,
    currentVideos,
    handlePageChange,
    setPaused,
    handleMouseEnter,
    handleMouseLeave,
    cardsPerPage
  };
};