import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import SaveForUmrahPlan from '../components/SaveForUmrahPlan';
import Packages from '../components/Packages';
import Airlines from '../components/Airlines';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <>
      <Hero />
      <Packages />
      <HowItWorks />
      <SaveForUmrahPlan />
      <Airlines />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;
