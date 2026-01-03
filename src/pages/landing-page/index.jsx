import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import DestinationsCarousel from './components/DestinationsCarousel';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>GlobeTrotter - Plan Your Perfect Multi-City Adventure</title>
        <meta 
          name="description" 
          content="Transform your travel planning with GlobeTrotter. Create multi-city itineraries, track budgets, and share experiences with a global community of travelers." 
        />
      </Helmet>

      <div className="min-h-screen bg-background smooth-scroll">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <DestinationsCarousel />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;