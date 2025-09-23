import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import banner from '../assets/banner.jpg';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Add a small delay to ensure animations work properly on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Animation classes based on mount state and device type
  const titleAnimation = isMobile 
    ? 'opacity-0 translate-y-4' 
    : isMounted 
      ? 'animate-fadeInUp' 
      : 'opacity-0';

  const imageAnimation = isMobile 
    ? 'opacity-0 translate-y-4' 
    : isMounted 
      ? 'animate-fadeInUp' 
      : 'opacity-0';

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-500 pt-24 pb-16 md:pb-32 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div 
            className={`w-full md:w-1/2 transition-all duration-700 ${titleAnimation}`}
            style={{
              animationDelay: isMobile ? '0s' : '0.2s',
              animationFillMode: 'forwards'
            }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
              Discover the World with ALTAKWEEN
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
              Book your dream vacation with our exclusive airline packages. Experience luxury, comfort, and unforgettable memories.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link 
                to="/register" 
                className="inline-flex items-center px-6 py-3 border-2 border-transparent text-base font-medium rounded-lg shadow-sm text-blue-600 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div 
            className={`w-full md:w-1/2 mt-12 md:mt-0 relative transition-all duration-700 ${imageAnimation}`}
            style={{
              animationDelay: isMobile ? '0s' : '0.4s',
              animationFillMode: 'forwards'
            }}
          >
            <div className="relative group max-w-lg mx-auto md:ml-auto">
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img 
                  src={banner} 
                  alt="Travel with ALTAKWEEN"
                  className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent rounded-xl" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm rounded-lg m-2">
                <p className="text-sm font-medium">Your Journey Begins Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add some custom animation styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;
