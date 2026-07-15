// src/pages/Home.jsx

import CategoryNews from "./CategoryNews";
import HeroSection from "../components/home/Hero/HeroSection";
import LatestNews from "../components/home/LatestNews";
import Header from "../components/home/Header/Header";
// import BreakingNews from "../components/home/BreakingNews/BreakingNews";
import NewsSection from "../components/NewsSection/NewsSection";
import VideoSection from "../components/VideoSection/VideoSection";
import NewsCategorySection from "../components/home/NewsCategorySection/NewsCategorySection";

import Top_Headline from "../components/home/Header/TopHeadline";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-100">
 <>
      <Header />
      {/* <HeroSection /> */}

      <Top_Headline />
       
      <HeroSection />

      <NewsSection />

      <VideoSection />
    
      <NewsCategorySection />
      {/* ===============================
          03. Breaking News Ticker
          File: BreakingNews.jsx
      ================================ */}
      {/* <BreakingNews /> */}

      {/* ===============================
          04. Latest News Section
          File: LatestNewsSection.jsx
      ================================ */}
      {/* <LatestNewsSection /> */}
            <LatestNews />
      {/* ===============================
          05. Popular News Section
          File: PopularNewsSection.jsx
      ================================ */}
      {/* <PopularNewsSection /> */}

      {/* ===============================
          06. Category News Section
          File: CategoryNews.jsx
      ================================ */}
      <CategoryNews />

      {/* ===============================
          07. Video News Section
          File: VideoSection.jsx
      ================================ */}
      {/* <VideoSection /> */}

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
</>
    </main>
  );
};

export default Home;