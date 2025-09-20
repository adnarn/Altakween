// client/src/pages/About.jsx
import React from 'react';
import PageLayout from '../components/PageLayout';
import { Users, Globe, Award, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Global Reach",
      description: "Connecting travelers with unique experiences in over 100 countries worldwide."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Award-Winning Service",
      description: "Recognized for excellence in customer service and travel innovation."
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Passionate Team",
      description: "Our team of travel experts is dedicated to making your journey unforgettable."
    }
  ];

  return (
    <PageLayout className="bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ALTAKWEEN</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences since 2023.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At ALTAKWEEN, we believe that travel has the power to change lives. Our mission is to make extraordinary 
              travel experiences accessible to everyone by combining local expertise with innovative technology.
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We go the extra mile to ensure your travel experience is seamless and memorable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 mt-4">The passionate people behind your perfect journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Alex Johnson', role: 'CEO & Founder', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { name: 'Sarah Williams', role: 'Travel Expert', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { name: 'Michael Chen', role: 'Operations', image: 'https://randomuser.me/api/portraits/men/46.jpg' }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have discovered the world with ALTAKWEEN.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;