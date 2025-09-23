import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import banner from '../assets/banner.jpg'

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-500 pt-24 pb-32 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2" data-aos="fade-right">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Discover the World with ALTAKWEEN
            </h1>
            <p className="mt-3 text-xl text-blue-100">
              Book your dream vacation with our exclusive airline packages. Experience luxury, comfort, and unforgettable memories.
            </p>
            <div className="mt-8">
              <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50">
                Get Started
                <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2 relative" data-aos="fade-left">
            <div className="relative group">
              <img 
                src={banner} 
                alt="Travel with ALTAKWEEN"
                className="rounded-xl shadow-2xl w-full h-auto transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent rounded-xl" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">Your Journey Begins Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
