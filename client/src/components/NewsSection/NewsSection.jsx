import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { newsService } from "../../features/news/services/newsService";
import { mapNewsItem, mapNewsList } from "../../utils/mapNewsItem";

import LeftSidebar from "./LeftSidebar";
import MainGrid from "./MainGrid";
import RightSidebar from "./RightSidebar";

const EMPTY_LAYOUT = {
  left: { featured: null, imageNews: [], textNews: [] },
  center: { featured: null, cardNews: [], textNews: [] },
  right: [],
};

const NewsSection = () => {
  const [layout, setLayout] = useState(EMPTY_LAYOUT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchLayout = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await newsService.getNewsSectionLayout();
        if (ignore) return;

        setLayout({
          left: {
            featured: mapNewsItem(raw.left?.featured),
            imageNews: mapNewsList(raw.left?.imageNews),
            textNews: mapNewsList(raw.left?.textNews),
          },
          center: {
            featured: mapNewsItem(raw.center?.featured),
            cardNews: mapNewsList(raw.center?.cardNews),
            textNews: mapNewsList(raw.center?.textNews),
          },
          right: mapNewsList(raw.right),
        });
      } catch (err) {
        if (!ignore) setError(err.message || "সংবাদ লোড করতে ব্যর্থ হয়েছে।");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchLayout();
    return () => {
      ignore = true;
    };
  }, []);

  const { left, center, right } = layout;

  return (
    <motion.section
      aria-labelledby="latest-news-heading"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="max-w-[1450px] mx-auto px-4 lg:px-8 my-10"
    >
      {/* Section Container Card Matching Hero Design System */}
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-5 lg:p-8">
        
        {/* Editorial Section Header */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-200/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full" />
            <h2
              id="latest-news-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
            >
              সর্বশেষ সংবাদ
            </h2>
          </div>
        </div>

        {/* Unified Gradient Skeleton View */}
        {loading ? (
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="h-[380px] rounded-2xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
                <div className="h-32 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-6">
              <div className="h-48 rounded-2xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              <div className="h-24 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              <div className="h-24 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
            </div>
            <div className="col-span-12 lg:col-span-3 order-3 space-y-6">
              <div className="h-24 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              <div className="h-24 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
              <div className="h-24 rounded-xl bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
            </div>
          </div>
        ) : error ? (
          /* Error Banner inside Card */
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : (
          /* Main 3 | 6 | 3 Layout with Mobile Re-ordering */
          <div className="grid grid-cols-12 gap-8 xl:gap-10 items-start">
            
            {/* 1. Main Center Grid (Order 1 on Mobile, Center on Desktop) */}
            <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
              <MainGrid
                featured={center.featured}
                cardNews={center.cardNews}
                textNews={center.textNews}
              />
            </div>

            {/* 2. Left Sidebar (Order 2 on Mobile, Left on Desktop) */}
            <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 lg:border-r lg:pr-6 xl:pr-8 border-neutral-200/60">
              <LeftSidebar
                featured={left.featured}
                imageNews={left.imageNews}
                textNews={left.textNews}
              />
            </div>

            {/* 3. Right Sidebar (Order 3 Always) */}
            <div className="col-span-12 lg:col-span-3 order-3 lg:border-l lg:pl-6 xl:pl-8 border-neutral-200/60">
              <RightSidebar news={right} />
            </div>

          </div>
        )}
      </div>
    </motion.section>
  );
};

export default NewsSection;