// client/src/pages/PackageDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Users, Calendar, Check, Heart, Share2 } from 'lucide-react';

const PackageDetails = () => {
  const { id } = useParams();
  
  // Package data matching the Services component
  const packageData = {
    1: {
      id: 1,
      category: 'pilgrimage',
      title: 'Umrah Basic Package',
      location: 'Makkah & Madinah',
      price: '₦2,500,000',
      duration: '2 Weeks',
      rating: 4.9,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      description: 'Experience a spiritually fulfilling journey with our Umrah Basic Package. This package is designed for those seeking a budget-friendly yet comfortable pilgrimage experience to the holy cities of Makkah and Madinah.',
      highlights: [
        'Umrah Visa processing and assistance',
        'Return flight from Kano',
        'Comfortable 3-star hotel accommodation',
        'Guided ziyarah to historical Islamic sites',
        '24/7 customer support'
      ],
      itinerary: [
        { day: 1, title: 'Departure from Kano', description: 'Flight to Jeddah, transfer to Makkah' },
        { day: 2, title: 'Island Exploration', description: 'Guided tour of nearby islands and sandbanks' },
        { day: 3, title: 'Water Sports Day', description: 'Snorkeling, kayaking, and paddleboarding' },
        { day: 4, title: 'Spa & Relaxation', description: 'Enjoy a day at the spa and resort amenities' },
        { day: 5, title: 'Sunset Cruise', description: 'Evening cruise with dolphin watching and canapés' },
        { day: 6, title: 'Free Day', description: 'Enjoy the resort at your leisure' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to the airport' }
      ],
      includes: [
        'Umrah Visa',
        'Return Ticket (Kano Departure)',
        'Local Transportation',
        '3 Star Hotel Stay',
        'Guided Ziyarah',
        'Daily Haram Trips'
      ],
      notIncluded: [
        'Personal expenses',
        'Meals not specified',
        'Vaccination costs',
        'Travel insurance'
      ]
    },
    2: {
      id: 2,
      category: 'pilgrimage',
      title: 'Umrah VIP Package',
      location: 'Makkah & Madinah',
      price: '₦3,000,000 – ₦3,500,000',
      duration: '2 Weeks',
      rating: 5.0,
      reviews: 350,
      image: 'https://images.unsplash.com/photo-1541123356219-af9f5bddbdf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      description: 'Our premium Umrah package offers luxury and convenience for your spiritual journey. Enjoy 4-star accommodations, premium services, and personalized attention throughout your pilgrimage.',
      highlights: [
        'Premium 4-star hotel near Haram',
        'Return flights from Lagos & Abuja',
        'Private transportation with experienced drivers',
        'Daily Haram trips with group coordination',
        'Comprehensive travel insurance'
      ],
      itinerary: [
        { day: 1, title: 'Departure from Lagos/Abuja', description: 'Business class flight to Jeddah, luxury transfer to Makkah' },
        { day: 2, title: 'Island Exploration', description: 'Guided tour of nearby islands and sandbanks' },
        { day: 3, title: 'Water Sports Day', description: 'Snorkeling, kayaking, and paddleboarding' },
        { day: 4, title: 'Spa & Relaxation', description: 'Enjoy a day at the spa and resort amenities' },
        { day: 5, title: 'Sunset Cruise', description: 'Evening cruise with dolphin watching and canapés' },
        { day: 6, title: 'Free Day', description: 'Enjoy the resort at your leisure' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to the airport' }
      ],
      includes: [
        'Umrah Visa',
        'Return Ticket (Lagos & Abuja Departures)',
        'Local Transportation',
        '4 Star Hotel Stay',
        'Daily Haram Trips',
        'Group Coordination'
      ],
      notIncluded: [
        'Personal expenses',
        'Meals not specified',
        'Vaccination costs',
        'Travel insurance'
      ]
    },
    3: {
      id: 3,
      category: 'pilgrimage',
      title: 'Save-for-Umrah Plan',
      location: 'Flexible (Choose month: Sept–Dec)',
      price: '₦875,000/month OR ₦218,750/week',
      duration: 'Flexible',
      rating: 4.8,
      reviews: 120,
      image: 'https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      description: 'Start your spiritual journey with our flexible savings plan. Save gradually and achieve your dream of performing Umrah with our structured payment plan.',
      highlights: [
        'Flexible weekly or monthly contributions',
        'Dedicated account manager',
        'Price lock-in guarantee',
        'Monthly progress reports',
        'No hidden charges'
      ],
      itinerary: [
        { day: 1, title: 'Plan Activation', description: 'Start your savings journey with as low as ₦218,750' },
        { day: 2, title: 'Island Exploration', description: 'Guided tour of nearby islands and sandbanks' },
        { day: 3, title: 'Water Sports Day', description: 'Snorkeling, kayaking, and paddleboarding' },
        { day: 4, title: 'Spa & Relaxation', description: 'Enjoy a day at the spa and resort amenities' },
        { day: 5, title: 'Sunset Cruise', description: 'Evening cruise with dolphin watching and canapés' },
        { day: 6, title: 'Free Day', description: 'Enjoy the resort at your leisure' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to the airport' }
      ],
      includes: [
        'Flexible weekly/monthly contributions',
        'Full Umrah arrangements when savings complete',
        'Monthly price updates for planning'
      ],
      notIncluded: [
        'Visa fees (if applicable)',
        'Personal expenses',
        'Travel insurance',
        'Vaccination costs'
      ]
    },
    4: {
      id: 4,
      category: 'travel',
      title: 'General Travel Services',
      location: 'Worldwide',
      price: 'Custom Quote',
      duration: 'Flexible',
      rating: 4.7,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      description: 'Customized travel solutions for all your needs. Whether it\'s business, leisure, or special occasions, we create personalized travel experiences tailored to your preferences.',
      highlights: [
        'Tailored travel itineraries',
        'Best price guarantee',
        '24/7 customer support',
        'Wide range of destinations',
        'Special group and family packages'
      ],
      itinerary: [
        { day: 1, title: 'Consultation', description: 'Discuss your travel needs and preferences' },
        { day: 2, title: 'Island Exploration', description: 'Guided tour of nearby islands and sandbanks' },
        { day: 3, title: 'Water Sports Day', description: 'Snorkeling, kayaking, and paddleboarding' },
        { day: 4, title: 'Spa & Relaxation', description: 'Enjoy a day at the spa and resort amenities' },
        { day: 5, title: 'Sunset Cruise', description: 'Evening cruise with dolphin watching and canapés' },
        { day: 6, title: 'Free Day', description: 'Enjoy the resort at your leisure' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to the airport' }
      ],
      includes: [
        'Flight Booking',
        'Hotel Reservations',
        'Airport Pick-up & Drop-off',
        'Group Tours & Honeymoon Packages',
        'Customised Travel Planning'
      ],
      notIncluded: [
        'Visa fees',
        'Travel insurance',
        'Meals not specified',
        'Personal expenses'
      ]
    }
  }[id];

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Package not found</h2>
          <Link to="/services" className="text-blue-600 hover:underline">
            ← Back to all packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          to="/services" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to all packages
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Package Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={packageData.image}
              alt={packageData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{packageData.location}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{packageData.title}</h1>
                <div className="flex items-center">
                  <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-4">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span>{packageData.rating}</span>
                    <span className="ml-1">({packageData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{packageData.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">{packageData.description}</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trip Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {packageData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Itinerary</h3>
              <div className="space-y-4">
                {packageData.itinerary.map((day, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{day.day}</span>
                      </div>
                      {index !== packageData.itinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <h4 className="font-medium text-gray-900">{day.title}</h4>
                      <p className="text-gray-600 text-sm">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {packageData.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-red-500 mr-2">✕</span>
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {packageData.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-0.5">✕</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold text-blue-600">${packageData.price}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Next available: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Max group size: 12 people</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Book Now
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Have questions?{' '}
                  <a href="#" className="text-blue-600 hover:underline">Contact us</a>
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-2xl p-6">
              <h3 className="font-medium text-gray-900 mb-3">Need help booking?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Speak to our travel experts who can help you plan your perfect trip.
              </p>
              <div className="space-y-2">
                <a href="tel:+15551234567" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </a>
                <a href="mailto:info@altakween.com" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@altakween.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;