import React from 'react';

const airlines = [
  {
    id: 1,
    name: 'Saudi Airlines',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Saudi_Airlines_logo.svg/1200px-Saudi_Airlines_logo.svg.png',
    alt: 'Saudi Airlines'
  },
  {
    id: 2,
    name: 'Egypt Air',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Egyptair_logo.svg/1200px-Egyptair_logo.svg.png',
    alt: 'Egypt Air'
  },
  {
    id: 3,
    name: 'Emirates',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Emirates_logo.svg/1200px-Emirates_logo.svg.png',
    alt: 'Emirates'
  },
  {
    id: 4,
    name: 'Qatar Airways',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Qatar_Airways_Logo.svg/1200px-Qatar_Airways_Logo.svg.png',
    alt: 'Qatar Airways'
  }
];

const Airlines = () => {
  return (
    <section id="airlines" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Partner Airlines
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Fly with the best airlines in the region
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {airlines.map((airline, index) => (
            <div 
              key={airline.id} 
              className="flex items-center justify-center p-8 bg-gray-50 rounded-lg transition-all duration-300 hover:filter-none hover:shadow-md"
              style={{
                filter: 'grayscale(100%) brightness(120%)',
              }}
              data-aos="fade-up" 
              data-aos-delay={`${(index + 1) * 100}`}
            >
              <img 
                src={airline.logo} 
                alt={airline.alt} 
                className="h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Airlines;
