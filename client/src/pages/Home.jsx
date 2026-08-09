// src/pages/Home.jsx

import HeroSection from "../components/home/Hero/HeroSection";
// import BreakingNews from "../components/home/BreakingNews/BreakingNews";
import NewsSection from "../components/NewsSection/NewsSection";
import VideoSection from "../components/VideoSection/VideoSection";

import BreakingNews from "../components/home/Header/BreakingNews";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <BreakingNews />

      <HeroSection />

      <NewsSection />

      <VideoSection />

     
    </main>
  );
};

export default Home;