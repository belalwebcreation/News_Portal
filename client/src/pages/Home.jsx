// src/pages/Home.jsx

import HeroSection from "../components/home/Hero/HeroSection";
// import BreakingNews from "../components/home/BreakingNews/BreakingNews";
import NewsSection from "../components/NewsSection/NewsSection";
import VideoSection from "../components/VideoSection/VideoSection";
import Footer from "../components/home/Footer";

import BreakingNews from "../components/home/Header/BreakingNews";

const Home = () => {
  return (
    <>
      <main className="min-h-screen bg-gray-100">
        <BreakingNews />

        <HeroSection />

        <NewsSection />

        <VideoSection />

        {/* ===============================
            08. Photo Gallery Section
            File: PhotoGallerySection.jsx
        ================================ */}
        {/* <PhotoGallerySection /> */}

        {/* ===============================
            09. Trending News Section
            File: TrendingSection.jsx
        ================================ */}
        {/* <TrendingSection /> */}

        {/* ===============================
            10. Advertisement Section
            File: AdvertisementSection.jsx
        ================================ */}
        {/* <AdvertisementSection /> */}

        {/* ===============================
            11. Newsletter Section
            File: NewsletterSection.jsx
        ================================ */}
        {/* <NewsletterSection /> */}
      </main>

      <Footer />
    </>
  );
};

export default Home;