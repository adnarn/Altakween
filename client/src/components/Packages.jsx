import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const packages = [
  {
    id: 1,
    title: "Umrah Basic Package",
    description: "7 days & 6 nights spiritual journey to Makkah and Madinah",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    highlights: "Makkah, Madinah, Zamzam Well",
    price: "₦1,200,000",
    popular: true,
    category: 'pilgrimage'
  },
  {
    id: 2,
    title: "Umrah VIP Package",
    description: "10 days & 9 nights premium spiritual experience",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    highlights: "5-star hotels, Private transportation, Guided tours",
    price: "₦2,500,000",
    category: 'pilgrimage',
    featured: true
  },
  {
    id: 3,
    title: "Save-for-Umrah Plan",
    description: "Flexible savings plan for your spiritual journey",
    image: "https://images.unsplash.com/photo-1518020382113-a7d8fbde3639?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    highlights: "Flexible payments, No interest, Secure savings",
    price: "Custom Plan",
    category: 'pilgrimage',
    featured: true
  },
  {
    id: 4,
    title: "General Travel Services",
    description: "Customized travel solutions worldwide",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    highlights: "Flight booking, Hotel reservations, Tour packages",
    price: "Custom Quote",
    category: 'travel',
    featured: true
  }
];

const PackageCard = ({ pkg }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
    <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{pkg.title}</h3>
        {pkg.popular && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Popular
          </span>
        )}
      </div>
      <p className="mt-2 text-gray-600">{pkg.description}</p>
      <div className="mt-4 flex items-center">
        <MapPin className="text-blue-500 mr-2 h-4 w-4" />
        <span className="text-sm text-gray-500">{pkg.highlights}</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{pkg.price}</span>
        <Link to="/register" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Book Now
        </Link>
      </div>
    </div>
  </div>
);

const Packages = () => {
  // Get only featured packages for the home page (first 3)
  const featuredPackages = packages.slice(0, 3);

  return (
    <section id="packages" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Featured Packages
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover our most popular travel experiences and start your journey today
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {featuredPackages.map((pkg, index) => (
            <div key={pkg.id} data-aos="fade-up" data-aos-delay={`${(index + 1) * 100}`}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
        
        <div className="text-center" data-aos="fade-up">
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            View All Packages
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Packages;
