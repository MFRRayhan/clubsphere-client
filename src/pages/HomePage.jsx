import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedClubs from "../components/FeaturedClubs";
import HowItWorks from "../components/HowItWorks";
import WhyJoin from "../components/WhyJoin";

const HomePage = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Dynamic Section: Featured Clubs */}
      <FeaturedClubs />

      {/* Extra Section 1 */}
      <HowItWorks />

      {/* Extra Section 2 */}
      <WhyJoin />
    </div>
  );
};

export default HomePage;
