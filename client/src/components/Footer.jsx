import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ALTAKWEEN</h3>
            <p className="text-gray-400">
              Making travel dreams come true since 2010. Your trusted partner for Middle East adventures.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#packages" className="text-gray-400 hover:text-white">Packages</a></li>
              <li><a href="#airlines" className="text-gray-400 hover:text-white">Airlines</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="mr-2 h-4 w-4" />
                <span>info@altakween.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="mr-2 h-4 w-4" />
                <span>+234 816 768 2378</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="mr-2 h-4 w-4" />
                <span>+234 903 708 6166</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>No 11, Salisu Kado Block, Katsina</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>No. 2 Gami Plaza, Kano</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} ALTAKWEEN Travel Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
