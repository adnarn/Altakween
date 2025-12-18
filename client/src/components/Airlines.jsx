import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plane, Globe, Search } from 'lucide-react';

// Airline data
const airlines = [
  {
    id: 1,
    name: 'Saudi Arabian Airlines (Saudia)',
    logo: 'https://cdn.planespotters.net/04128/hz-asb-saudi-arabian-airlines-airbus-a320-214_PlanespottersNet_164122_b892410812_o.jpg',
    rating: 4.9,
    destinations: 170,
    tags: ['SkyTeam', 'Premium', 'Halal']
  },
  {
    id: 2,
    name: 'EgyptAir',
    logo: 'https://d.newsweek.com/en/full/461507/egyptair-flight.jpg',
    rating: 4.9,
    destinations: 170,
    tags: ['Star Alliance', 'Economy+']
  },
  {
    id: 3,
    name: 'Ethiopian Airlines',
    logo: 'https://expatlivingguide.com/wp-content/uploads/2023/10/ethiopian-airlines-offices-in-dubai-2.webp',
    rating: 4.9,
    destinations: 170,
    tags: ['Star Alliance', 'African']
  },
  {
    id: 4,
    name: 'Qatar Airways',
    logo: 'https://tse4.mm.bing.net/th/id/OIP.tNGMrTtwa2Nk7GOfk1KCEAHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
    rating: 4.9,
    destinations: 170,
    tags: ['Oneworld', '5-Star', 'Luxury']
  },
  {
    id: 5,
    name: 'Turkish Airlines',
    logo: 'https://th.bing.com/th/id/R.7a1a22631865e2bbb15f0f8e329d7674?rik=76a5givboCe8Vw&pid=ImgRaw&r=0',
    rating: 4.8,
    destinations: 335,
    tags: ['Star Alliance', 'Global']
  },
  {
    id: 7,
    name: 'Lufthansa',
    logo: 'https://logos-world.net/wp-content/uploads/2020/10/Lufthansa-Logo.png',
    rating: 4.7,
    destinations: 220,
    tags: ['Star Alliance', 'European']
  },
  {
    id: 8,
    name: 'Air France',
    logo: 'https://logos-world.net/wp-content/uploads/2020/03/Air-France-Logo-2009-2016.jpg',
    rating: 4.6,
    destinations: 200,
    tags: ['SkyTeam', 'European']
  },
  {
    id: 9,
    name: 'Emirates',
    logo: 'https://pluspng.com/img-png/emirates-airlines-logo-png-emirates-logo-the-most-famous-brands-and-company-logos-in-the-world-3840x2160.png',
    rating: 4.9,
    destinations: 160,
    tags: ['Luxury', 'A380', 'Global']
  },
  {
    id: 10,
    name: 'Max Air',
    logo: 'https://tse4.mm.bing.net/th/id/OIP.-s6gVosikv1kfwsQ5FqYqwHaCH?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
    rating: 4.3,
    destinations: 25,
    tags: ['Regional', 'Nigeria']
  },
  {
    id: 11,
    name: 'Kenya Airways',
    logo: 'https://bootflare.com/wp-content/uploads/2023/03/Kenya-Airways-Logo-2048x1365.png',
    rating: 4.5,
    destinations: 56,
    tags: ['SkyTeam', 'African']
  },
  {
    id: 12,
    name: 'Royal Air Maroc',
    logo: 'https://logos-world.net/wp-content/uploads/2023/01/Royal-Air-Maroc-Logo.png',
    rating: 4.4,
    destinations: 90,
    tags: ['Oneworld', 'African']
  }
];

const AirlineCard = ({ airline }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-4">
        <div className="h-32 flex items-center justify-center mb-4">
          <img
            src={airline.logo}
            alt={airline.name}
            className="max-h-full max-w-full object-contain"
            style={{
              filter: 'grayscale(1) contrast(0.5) brightness(1.2)',
              opacity: 0.9,
            }}
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {airline.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Globe className="w-4 h-4 mr-1 text-blue-600" />
          <span>{airline.destinations}+ Destinations</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {airline.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Airlines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAirlines, setFilteredAirlines] = useState(airlines);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = airlines.filter(
        (airline) =>
          airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (airline.tags &&
            airline.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setFilteredAirlines(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Airline Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partnering with top-rated airlines to bring you exceptional travel experiences.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search airlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAirlines.map((airline) => (
            <AirlineCard key={airline.id} airline={airline} />
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for Your Next Adventure?</h3>
          <p className="mb-6 max-w-2xl mx-auto text-blue-100">
            Book your next flight with our trusted airline partners.
          </p>
          <button className="bg-white text-blue-700 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors">
            Search Flights
          </button>
        </div>
      </div>
    </section>
  );
};

export default Airlines;
