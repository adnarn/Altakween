import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tokenSent, setTokenSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const response = await axios.post('http://localhost:8081/api/auth/forgot-password', {
        email: formData.email
      });

      setResetToken(response.data.resetToken);
      setTokenSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset instructions';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No account found with this email address';
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

  const handleResetPassword = () => {
    navigate('/reset-password', { state: { token: resetToken } });
  };

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
              <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
              <p className="text-blue-100 mt-1">
                {tokenSent ? 'Check your instructions' : 'Enter your email to reset'}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {!tokenSent ? (
                <>
                  <div className="text-center mb-6">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-2.5 h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition duration-200`}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-xs text-red-600 mt-1 flex items-center"
                            >
                              <AlertCircle className="w-3.5 h-3.5 mr-1" />
                              {errors.email}
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
                          Sending instructions...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Reset Instructions
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    We've sent password reset instructions to your email address.
                    <br />
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                      Token: {resetToken}
                    </span>
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleResetPassword}
                      className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      Continue to Reset Password
                    </button>
                    
                    <button
                      onClick={() => {
                        setTokenSent(false);
                        setResetToken('');
                        setFormData({ email: '' });
                        setFormSubmitted(false);
                        setErrors({});
                      }}
                      className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Email Entry
                    </button>
                  </div>
                </div>
              )}

              {/* Back to Login */}
              {!tokenSent && (
                <div className="mt-6 text-center text-sm text-gray-600">
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
    </>
  );
};

export default ForgotPassword;
