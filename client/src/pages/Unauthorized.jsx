import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <ShieldAlert className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Unauthorized Access
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You don't have permission to access this page. Please contact the administrator if you believe this is a mistake.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Home className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
            </span>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
