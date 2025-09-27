import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setLoading(true);
        const response = await get('/packages?featured=true&limit=3');
        setPackages(Array.isArray(response) ? response : response.data || response.packages || []);
      } catch (err) {
        console.error('Error fetching featured packages:', err);
        setError(err.message || 'Failed to load featured packages');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, [get]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading packages. Please try again later.</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No featured packages available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Packages
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our most popular travel experiences
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div 
              key={pkg._id || pkg.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  className="w-full h-full object-cover"
                  src={pkg.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                  alt={pkg.title}
                />
                {pkg.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <span className="text-lg font-semibold text-blue-600">
                    {pkg.price ? `₦${Number(pkg.price).toLocaleString('en-US', {maximumFractionDigits: 0})}` : 'Contact Us'}
                  </span>
                </div>
                
                <p className="mt-2 text-gray-600 line-clamp-2">{pkg.description}</p>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pkg.highlights || pkg.destination || 'Various locations'}</span>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < (pkg.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <Link
                    to={`/services#${pkg._id || pkg.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View All Packages
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Packages;
