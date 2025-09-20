import React from 'react';
import { Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <MapPin className="w-10 h-10 text-blue-600" />,
      title: 'Choose Your Destination',
      description: 'Browse our curated selection of travel packages and select your dream destination.',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      icon: <Calendar className="w-10 h-10 text-indigo-600" />,
      title: 'Select Dates & Package',
      description: 'Pick your preferred travel dates and choose the perfect package that suits your needs.',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 3,
      icon: <CreditCard className="w-10 h-10 text-purple-600" />,
      title: 'Secure Booking',
      description: 'Complete your booking with our secure payment system. We accept all major credit cards.',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      title: 'Enjoy Your Journey',
      description: 'Pack your bags and get ready for an unforgettable travel experience with us!',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Planning your perfect trip has never been easier with our simple 4-step process
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-blue-500 to-green-500 -translate-y-1/2 transform"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group"
              >
                <div className={`${step.bgColor} p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center text-center`}>
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="md:hidden mr-2 text-blue-600">{step.id}.</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-4 text-blue-500">
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
