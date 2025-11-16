import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ 
    token: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from navigation state or URL params
    const token = location.state?.token || new URLSearchParams(location.search).get('token');
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    }
  }, [location]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.token.trim()) {
      newErrors.token = 'Reset token is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    if (formSubmitted) validateForm();
  }, [formData, formSubmitted, validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8081/api/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });

      setPasswordReset(true);
      toast.success('Password reset successful! You can now login with your new password.');
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Failed to reset password';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid or expired reset token';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setErrors((prev) => ({ ...prev, form: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (passwordReset) {
    return (
      <>
        <Navbar />
        <PageLayout>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-center">
                  <h1 className="text-2xl font-bold text-white">Password Reset Successful</h1>
                  <p className="text-green-100 mt-1">Your password has been updated</p>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All Done!</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                  
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
              <h1 className="text-2xl font-bold text-white">Reset Password</h1>
              <p className="text-blue-100 mt-1">Create your new password</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reset Token */}
                <div className="space-y-2">
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="Enter your reset token"
                    className={`w-full px-3 py-2 border ${
                      errors.token ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 font-mono text-sm`}
                  />
                  <AnimatePresence>
                    {errors.token && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600 mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.token}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-2.5 h-5 w-5 ${errors.newPassword ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition duration-200`}
                    />
                    <AnimatePresence>
                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-2.5 h-5 w-5 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition duration-200`}
                    />
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {errors.form && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md text-sm text-red-700 flex items-center"
                    >
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      {errors.form}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center text-sm text-gray-600">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
    </>
  );
};

export default ResetPassword;
