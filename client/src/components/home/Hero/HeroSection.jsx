import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import HeroBanner from "./components/HeroBanner";
import HeroLeft from "./components/HeroLeft";
import HeroCenter from "./components/HeroCenter";
import HeroRight from "./components/HeroRight";

import { newsService } from "../../../features/news/services/newsService";
import { normalizeNewsForHero } from "../../../utils/normalizeNewsForHero";

const LEFT_SLOT_COUNT = 4;
const RIGHT_SLOT_COUNT = 4;
const TOTAL_SLOTS = 1 + LEFT_SLOT_COUNT + RIGHT_SLOT_COUNT;

const HeroSection = () => {
  const [heroData, setHeroData] = useState({ center: null, left: [], right: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await newsService.getAllNews({
          isFeatured: true,
          status: "published",
          limit: TOTAL_SLOTS,
        });

        const list = Array.isArray(response) ? response : response?.data ?? [];

        if (!isMounted) return;

        const [centerRaw, ...restRaw] = list;
        const leftRaw = restRaw.slice(0, LEFT_SLOT_COUNT);
        const rightRaw = restRaw.slice(LEFT_SLOT_COUNT, LEFT_SLOT_COUNT + RIGHT_SLOT_COUNT);

        setHeroData({
          center: normalizeNewsForHero(centerRaw),
          left: leftRaw.map(normalizeNewsForHero),
          right: rightRaw.map(normalizeNewsForHero),
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || "হিরো নিউজ লোড করতে ব্যর্থ হয়েছে।");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Framer Motion Variants for Container & Staggered Children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 sm:py-5 lg:py-8">
      {/* 1. Top Banner Space with Compact Mobile Spacing */}
      <div className="mb-5 lg:mb-8">
        <HeroBanner />
      </div>

      {/* 2. Main Hero Card Shell (Responsive Radius & Inner Padding) */}
      <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 shadow-sm p-4 sm:p-5 xl:p-8">
        
        {/* Responsive Grid System (Mobile Gap Gap-6 -> Desktop Gap-8) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-6 lg:gap-8"
        >
          
          {/* 1. Center Hero Main News (DOM Order 1 on Mobile, Middle Column on Desktop) */}
          <motion.div
            variants={columnVariants}
            className="col-span-12 lg:col-span-6 order-1 lg:order-2 px-0 lg:px-2 flex flex-col justify-between"
          >
            {heroData.center ? (
              <HeroCenter news={heroData.center} />
            ) : loading ? (
              <div className="h-[280px] sm:h-[360px] lg:h-[420px] rounded-xl lg:rounded-2xl bg-neutral-100 animate-pulse" />
            ) : (
              !error && (
                <div className="h-56 sm:h-64 flex items-center justify-center border border-dashed border-neutral-200 rounded-2xl">
                  <p className="text-sm font-medium text-neutral-400">
                    এখনো কোনো ফিচার্ড নিউজ নেই।
                  </p>
                </div>
              )
            )}
          </motion.div>

          {/* 2. Left Column (DOM Order 2 on Mobile, Left Column on Desktop) */}
          <motion.div
            variants={columnVariants}
            className="col-span-12 lg:col-span-3 order-2 lg:order-1 lg:pr-6 lg:border-r lg:border-neutral-100/80 flex flex-col justify-between"
          >
            {heroData.left.length > 0 ? (
              <HeroLeft newsList={heroData.left} />
            ) : loading ? (
              <div className="space-y-4 sm:space-y-6">
                {Array.from({ length: LEFT_SLOT_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 sm:h-24 rounded-xl bg-neutral-100 animate-pulse"
                  />
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* 3. Right Column (DOM Order 3 Always) */}
          <motion.div
            variants={columnVariants}
            className="col-span-12 lg:col-span-3 order-3 lg:pl-6 lg:border-l lg:border-neutral-100/80 flex flex-col justify-between"
          >
            {heroData.right.length > 0 ? (
              <HeroRight newsList={heroData.right} />
            ) : loading ? (
              <div className="space-y-4 sm:space-y-6">
                {Array.from({ length: RIGHT_SLOT_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 sm:h-24 rounded-xl bg-neutral-100 animate-pulse"
                  />
                ))}
              </div>
            ) : null}
          </motion.div>

        </motion.div>
      </div>

      {/* Global Error Notice - Isolated Below Main Shell */}
      {error && (
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-100 text-center text-xs sm:text-sm font-medium text-red-600">
          {error}
        </div>
      )}
    </section>
  );
};

export default HeroSection;