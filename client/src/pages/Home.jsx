import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PageLayout from '../components/PageLayout';
import SaveForUmrahPlan from '../components/SaveForUmrahPlan';
import Packages from '../components/Packages';
import Airlines from '../components/Airlines';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Only initialize AOS on the client side
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      
      // Initialize AOS with responsive settings
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        startEvent: 'DOMContentLoaded',
        disable: isMobile ? true : false, // Disable animations on mobile by default
      });

      // Refresh AOS when window is resized
      const handleResize = () => {
        AOS.refresh();
      };

      window.addEventListener('resize', handleResize);
      
      // Initial refresh after all components are mounted
      const timer = setTimeout(() => {
        AOS.refresh();
      }, 1000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [isMobile]);

  // Add a class to the body when component mounts to handle initial load
  useEffect(() => {
    document.body.classList.add('home-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  // Add a slight delay before showing content to ensure proper rendering
  if (!isMounted) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="overflow-hidden">
        <Hero />
        <div data-aos="fade-up" data-aos-delay="100">
          <Packages />
        </div>
        <div data-aos="fade-up" data-aos-delay="150">
          <HowItWorks />
        </div>
        <div data-aos="fade-up" data-aos-delay="200">
          <SaveForUmrahPlan />
        </div>
        <div data-aos="fade-up" data-aos-delay="250">
          <Airlines />
        </div>
        <div data-aos="fade-up" data-aos-delay="300">
          <Testimonials />
        </div>
        <div data-aos="fade-up" data-aos-delay="350">
          <CTA />
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
