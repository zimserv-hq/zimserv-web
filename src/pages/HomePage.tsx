// src/pages/HomePage.tsx
import SEO from "../components/SEO";
import Hero from "../components/Hero/Hero";
import CategorySection from "../components/Home/CategorySection";
import HowItWorks from "../components/Home/HowItWorks";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import FeaturedProviders from "../components/Home/FeaturedProviders";
import ProviderCTA from "../components/Home/ProviderCTA";

const HomePage = () => {
  return (
    <>
      <SEO
        title="Find Trusted Service Providers in Zimbabwe | ZimServ"
        description="ZimServ connects you with verified service providers across Zimbabwe. Find plumbers, electricians, cleaners, event planners, and more in Harare, Bulawayo, and beyond."
        keywords="service providers Zimbabwe, Harare services, Bulawayo professionals, plumbers Zimbabwe, electricians, home services, event planners, verified providers"
        url="/"
      />
      <Hero />
      <CategorySection />
      <FeaturedProviders />
      <HowItWorks />
      <WhyChooseUs />
      <ProviderCTA />
    </>
  );
};

export default HomePage;
