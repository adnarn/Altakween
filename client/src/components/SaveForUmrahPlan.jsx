import React from 'react';
import { PiggyBank, Calendar, Gift, ShieldCheck, ArrowRight } from 'lucide-react';

const SaveForUmrahPlan = () => {
  const features = [
    {
      icon: <PiggyBank className="w-8 h-8 text-blue-600" />,
      title: 'Flexible Savings',
      description: 'Save at your own pace with no pressure. Contribute any amount, anytime.'
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: 'No Fixed Schedule',
      description: 'Choose your preferred Umrah dates when you\'re ready to travel.'
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      title: 'Exclusive Benefits',
      description: 'Get access to special deals and early-bird offers on Umrah packages.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-600" />,
      title: 'Fully Secure',
      description: 'Your savings are safe with our secure payment system and financial protection.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic Saver',
      price: '₦5,000',
      period: 'month',
      features: [
        'Minimum monthly contribution',
        'Basic account support',
        '6-month savings plan',
        'Standard Umrah package options'
      ],
      popular: false
    },
    {
      name: 'Premium Saver',
      price: '₦15,000',
      period: 'month',
      features: [
        'Priority booking',
        'Dedicated account manager',
        '3-month savings plan',
        'Premium Umrah package options',
        'Free travel insurance'
      ],
      popular: true
    },
    {
      name: 'Flexi Saver',
      price: 'Custom',
      period: 'flexible',
      features: [
        'Save any amount, anytime',
        'Choose your own timeline',
        'Mix of standard and premium benefits',
        'Flexible Umrah dates',
        'Personalized support'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Save for Umrah - Your Journey, Your Way
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Fulfill your spiritual journey with our flexible savings plan designed for your convenience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6" data-aos="fade-right">
            <h3 className="text-2xl font-bold text-gray-900">What is the Save for Umrah Plan?</h3>
            <p className="text-gray-600">
              Our <span className="font-semibold text-blue-600">Save for Umrah Plan</span> is a revolutionary, flexible savings solution designed to make your spiritual journey to the holy cities of Makkah and Madinah more accessible than ever. 
              This innovative program allows you to gradually save money towards your Umrah trip at a pace that suits your financial situation.
            </p>
            <p className="text-gray-600">
              Whether you prefer to contribute <span className="font-medium">weekly, bi-weekly, or monthly</span>, our plan adapts to your unique circumstances. 
              There are no rigid schedules or fixed amounts - you're in complete control of your savings journey.
            </p>
            <p className="text-gray-600">
              The best part? Your Umrah journey begins the moment you start saving. 
              As your savings grow, our dedicated team will work with you to plan every detail of your spiritual experience, ensuring that when you're ready to travel, everything is perfectly arranged.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-800 font-medium">
                "A flexible savings package that allows you to start saving weekly or monthly towards your Umrah expenses, and travel when your savings are complete."
              </p>
            </div>
            <div className="pt-4">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                Start Saving Now
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">Choose Your Savings Plan</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={plan.name}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`relative bg-white rounded-2xl shadow-sm border ${plan.popular ? 'border-2 border-blue-500 transform -translate-y-2' : 'border-gray-200'} overflow-hidden transition-all duration-300 hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.period !== 'flexible' && (
                      <span className="ml-2 text-gray-500">/ {plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Plan?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our travel experts can create a personalized savings plan tailored to your budget and timeline.
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-700 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
            Contact Our Advisors
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SaveForUmrahPlan;
