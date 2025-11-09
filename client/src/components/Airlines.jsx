import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plane, Globe, Shield, Award, Clock, Users } from "lucide-react";

const airlines = [
  {
    id: 1,
    name: "Saudi Arabian Airlines (Saudia)",
    logo: "https://cdn.planespotters.net/04128/hz-asb-saudi-arabian-airlines-airbus-a320-214_PlanespottersNet_164122_b892410812_o.jpg",
        rating: 4.9,
    destinations: 170,
  },
  {
    id: 2,
    name: "EgyptAir",
    logo: "https://d.newsweek.com/en/full/461507/egyptair-flight.jpg",
        rating: 4.9,
    destinations: 170,
  },
  {
    id: 3,
    name: "Ethiopian Airlines",
    logo: "https://expatlivingguide.com/wp-content/uploads/2023/10/ethiopian-airlines-offices-in-dubai-2.webp",
        rating: 4.9,
    destinations: 170,
  },
  {
    id: 4,
    name: "Qatar Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Qatar_Airways_Logo.svg/1200px-Qatar_Airways_Logo.svg.png",
        rating: 4.9,
    destinations: 170,
  },
  {
    id: 5,
    name: "Turkish Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Turkish_Airlines_logo_2019.svg/1200px-Turkish_Airlines_logo_2019.svg.png",
  },
  {
    id: 7,
    name: "Lufthansa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Lufthansa_Logo_2018.svg/1200px-Lufthansa_Logo_2018.svg.png",
  },
  {
    id: 8,
    name: "Air France",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Air_France_Logo.svg/1200px-Air_France_Logo.svg.png",
  },
  {
    id: 9,
    name: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Emirates_logo.svg/1200px-Emirates_logo.svg.png",
  },
  {
    id: 10,
    name: "Max Air",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Max-Air-logo.svg/1200px-Max-Air-logo.svg.png",
  },
  {
    id: 11,
    name: "Kenya Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Kenya_Airways_logo.svg/1200px-Kenya_Airways_logo.svg.png",
  },
  {
    id: 12,
    name: "Royal Air Maroc",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Royal_Air_Maroc_logo.svg/1200px-Royal_Air_Maroc_logo.svg.png",
  },
];

const AirlineCard = ({ airline, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.1 },
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-full flex items-center justify-center p-2">
            <img
              src={airline.logo}
              alt={airline.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ filter: 'grayscale(1) contrast(0.5) brightness(1.2)' }}
            />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          {airline.name}
        </h3>
        
        {airline.rating && (
          <div className="flex items-center justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(airline.rating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {airline.rating}
            </span>
          </div>
        )}
        
        {airline.destinations && (
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Globe className="w-4 h-4 mr-1" />
            <span>{airline.destinations}+ Destinations</span>
          </div>
        )}
        
        <div className="flex justify-center space-x-2 mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Shield className="w-3 h-3 mr-1" /> Safe
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Award className="w-3 h-3 mr-1" /> Premium
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Airlines = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-4">
            <Plane className="w-4 h-4 mr-2" />
            Our Airline Partners
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            Fly with the World's Leading Airlines
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We partner with top-rated airlines to bring you the best travel experience with comfort, safety, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {airlines.map((airline, index) => (
            <AirlineCard key={airline.id} airline={airline} index={index} />
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Ready for Your Next Adventure?</h3>
            <p className="text-blue-100 mb-6">
              Book your next flight with our trusted airline partners and enjoy exclusive benefits, competitive prices, and world-class service.
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300">
              Search Flights
              <Plane className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Airlines;
