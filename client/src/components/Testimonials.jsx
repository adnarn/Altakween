import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    content: 'The Dubai package was amazing! Everything was perfectly organized, and the Saudi Airlines flights were so comfortable. Will definitely book with ALTAKWEEN again!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Michael Brown',
    rating: 5,
    content: 'Egypt Air flights were excellent, and the tour guides in Cairo were very knowledgeable. The whole experience was seamless thanks to ALTAKWEEN.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Aisha Rahman',
    rating: 5,
    content: 'The Saudi Explorer package was perfect for our family. The hotels were luxurious, and the flights were always on time. Highly recommend ALTAKWEEN for Middle East travel!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Travelers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-md" 
              data-aos="fade-up" 
              data-aos-delay={`${(index + 1) * 100}`}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
