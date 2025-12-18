import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import countries from 'react-phone-number-input/locale/en.json';
import Select from 'react-select';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  ChevronDown,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';
import { parsePhoneNumber } from 'libphonenumber-js';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    country: null,
    password: '',
    confirmPassword: '',
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const countryOptions = useMemo(() => {
    return Object.entries(countries).map(([value, label]) => ({
      value,
      label: `${label} (${value})`,
    }));
  }, []);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState({
    isValidFormat: false,
    suggestions: [],
    isDisposable: false,
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Common email domain typos and suggestions
  const commonEmailTypos = {
    'gmai.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmail.co': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outlook.co': 'outlook.com',
    'yaho.com': 'yahoo.com',
    'yaho.co': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
  };

  // List of disposable/temporary email domains
  const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'grr.la',
    'tmpmail.org', 'getnada.com', 'maildrop.cc', 'temp-mail.org'
  ];

  // Validate email format and check for common typos
  const validateEmailFormat = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      return {
        isValidFormat: false,
        suggestions: [],
        isDisposable: false
      };
    }

    // Extract domain
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Check for common typos
    const suggestions = [];
    if (commonEmailTypos[domain]) {
      const correctedEmail = email.replace(domain, commonEmailTypos[domain]);
      suggestions.push(correctedEmail);
    }

    // Check for disposable emails
    const isDisposable = disposableDomains.some(disposable => 
      domain.includes(disposable) || domain === disposable
    );

    return {
      isValidFormat: true,
      suggestions,
      isDisposable,
      domain
    };
  }, []);

  // Debounced email validation
  useEffect(() => {
    const validateEmail = () => {
      if (!formData.email.trim()) {
        setEmailStatus({
          isValidFormat: false,
          suggestions: [],
          isDisposable: false,
        });
        return;
      }

      const formatValidation = validateEmailFormat(formData.email);
      
      setEmailStatus({
        isValidFormat: formatValidation.isValidFormat,
        suggestions: formatValidation.suggestions,
        isDisposable: formatValidation.isDisposable,
      });
    };

    const timer = setTimeout(() => {
      validateEmail();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [formData.email, validateEmailFormat]);

  // Validate phone number format (must be 11 digits without country code)
  const validatePhone = useCallback((phone) => {
    if (!phone) return { isValid: false, message: 'Phone number is required' };
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's exactly 11 digits (for Nigerian format: 08012345678)
    if (digitsOnly.length === 11) {
      return { 
        isValid: true, 
        message: 'Valid phone number',
        formattedPhone: digitsOnly // Send only digits to backend
      };
    }
    
    // Check international format (with country code)
    if (phone.startsWith('+')) {
      // For Nigeria (+234), remove +234 and check if remaining is 10 digits
      if (phone.startsWith('+234')) {
        const localNumber = phone.substring(4).replace(/\D/g, '');
        if (localNumber.length === 10) {
          return { 
            isValid: true, 
            message: 'Valid phone number',
            formattedPhone: '0' + localNumber // Convert to local format
          };
        }
      }
      // For other countries, you might want different logic
    }
    
    return { 
      isValid: false, 
      message: 'Phone number must be 11 digits (e.g., 08012345678)' 
    };
  }, []);

  const validateForm = useCallback((forceValidate = false) => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailStatus.isValidFormat) {
      newErrors.email = 'Please enter a valid email address';
    } else if (emailStatus.isDisposable) {
      newErrors.email = 'Please use a permanent email address, not a temporary one';
    }

    // Phone validation
    const phoneValidation = validatePhone(formData.phone);
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.country) newErrors.country = 'Country is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 50) {
      newErrors.password = 'Password is too long (max 50 characters)';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Only keep form error if we're not forcing a re-validation
    if (forceValidate && errors.form) {
      delete errors.form;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, emailStatus, errors.form, validatePhone]);

  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [formData, formSubmitted, validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general form error when user modifies any field
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
  };

  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCountryCode(selectedOption.value);
      
      if (formData.phone) {
        try {
          const phoneNumber = parsePhoneNumber(formData.phone);
          if (phoneNumber && phoneNumber.isValid()) {
            setFormData(prev => ({
              ...prev,
              country: selectedOption
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              country: selectedOption,
              phone: ''
            }));
          }
        } catch {
          setFormData(prev => ({
            ...prev,
            country: selectedOption,
            phone: ''
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          country: selectedOption,
          phone: ''
        }));
      }
    } else {
      setSelectedCountryCode(null);
      setFormData(prev => ({
        ...prev,
        country: null
      }));
    }
    // Clear country error when user selects something
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: '' }));
    }
    // Clear general form error
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
    // Clear general form error
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
    
    if (value) {
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (phoneNumber && phoneNumber.country) {
          const detectedCountry = phoneNumber.country;
          const countryOption = countryOptions.find(opt => opt.value === detectedCountry);
          if (countryOption && formData.country?.value !== detectedCountry) {
            setFormData(prev => ({
              ...prev,
              country: countryOption
            }));
            setSelectedCountryCode(detectedCountry);
          }
        }
      } catch {
        // If parsing fails, do nothing
      }
    }
  };

  const applyEmailSuggestion = (suggestedEmail) => {
    setFormData(prev => ({
      ...prev,
      email: suggestedEmail
    }));
    // Clear errors when applying suggestion
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Clear any previous form errors
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
    
    // Validate form
    const isValid = validateForm(true); // Force re-validation
    
    if (!isValid) {
      toast.error('Please fix the form errors before submitting.');
      return;
    }

    // Extra validation before submission
    if (emailStatus.isDisposable) {
      toast.error('Please use a permanent email address, not a temporary one.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate phone and format it for backend
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        throw new Error(phoneValidation.message);
      }

      // Prepare registration data - ensure all fields are properly formatted
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: phoneValidation.formattedPhone, // Use formatted phone (11 digits)
        address: formData.address.trim(),
        state: formData.state.trim(),
        country: formData.country?.value || formData.country,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      console.log('Registration data being sent:', JSON.stringify(registrationData, null, 2));

      // Call the register function from AuthContext
      const result = await register(registrationData);
      
      if (result && result.success) {
        toast.success('Registration successful! You can now log in.');
        navigate('/');
      } else {
        throw new Error(result?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error details:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      let serverErrors = {};
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        errorMessage = error.response.data?.message || `Request failed with status code ${error.response.status}`;
        
        // Handle validation errors from server
        if (error.response.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([field, message]) => {
            serverErrors[field] = Array.isArray(message) ? message[0] : message;
          });
        }
        
        // Handle specific error messages from server
        if (error.response.data?.error) {
          if (typeof error.response.data.error === 'string') {
            errorMessage = error.response.data.error;
          } else if (error.response.data.error.message) {
            errorMessage = error.response.data.error.message;
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      // Update errors state but don't block the form
      setErrors(prev => ({ 
        ...prev, 
        ...serverErrors,
        form: errorMessage 
      }));
      
      toast.error(errorMessage);
      
      // After showing error, reset formSubmitted to allow retry
      setFormSubmitted(false);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear all errors and allow retry
  const clearAllErrors = () => {
    setErrors({});
    setFormSubmitted(false);
  };

  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                    <p className="text-gray-600">Join us today!</p>
                  </div>

                  <AnimatePresence>
                    {errors.form && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md"
                      >
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <div className="flex-1">
                            <p className="text-sm text-red-700">{errors.form}</p>
                            <button
                              onClick={clearAllErrors}
                              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Clear errors and try again
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field with enhanced validation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.email ? 'border-red-500' : 
                            emailStatus.isValidFormat && !emailStatus.isDisposable ? 'border-green-500' : 
                            'border-gray-300'
                          }`}
                          placeholder="Enter your email address"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          {formData.email && emailStatus.isValidFormat ? (
                            emailStatus.isDisposable ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )
                          ) : null}
                        </div>
                      </div>
                      
                      {/* Email validation messages */}
                      <div className="mt-1 space-y-1">
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                        
                        {emailStatus.suggestions.length > 0 && !errors.email && (
                          <div className="text-sm text-amber-600">
                            <p>Did you mean?</p>
                            {emailStatus.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => applyEmailSuggestion(suggestion)}
                                className="text-amber-700 hover:text-amber-900 underline mr-2"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {emailStatus.isValidFormat && !emailStatus.isDisposable && !errors.email && (
                          <p className="text-sm text-green-600 flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Valid email address
                          </p>
                        )}
                        
                        {emailStatus.isDisposable && (
                          <p className="text-sm text-amber-600">
                            ⚠️ This appears to be a temporary email address
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Country Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <Select
                        value={formData.country}
                        onChange={handleCountryChange}
                        options={countryOptions}
                        placeholder="Select country..."
                        classNamePrefix="react-select"
                        className={`w-full text-sm rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '42px',
                            borderColor: errors.country ? '#ef4444' : base.borderColor,
                            '&:hover': {
                              borderColor: errors.country ? '#ef4444' : base['&:hover'].borderColor,
                            },
                          }),
                        }}
                        components={{
                          DropdownIndicator: () => <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />,
                        }}
                        isClearable
                        isSearchable
                      />
                      {errors.country && (
                        <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                        <span className="text-xs text-gray-500 ml-1">
                          (11 digits, e.g., 08012345678)
                        </span>
                      </label>
                      <div className={`relative border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition-all`}>
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Phone className="h-4 w-4" />
                        </span>
                        <PhoneInput
                          international
                          country={selectedCountryCode || undefined}
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          defaultCountry={selectedCountryCode || "NG"} // Default to Nigeria
                          placeholder="Enter 11-digit phone number"
                          className="!pl-10 !pr-3 !py-2 !w-full !border-0 !focus:ring-0"
                          style={{
                            '--PhoneInput-color--focus': 'transparent',
                            '--PhoneInputCountrySelectArrow-color': '#6b7280',
                            '--PhoneInputCountrySelectArrow-color--focus': '#3b82f6',
                            '--PhoneInputCountryFlag-borderColor': 'transparent',
                            '--PhoneInputCountryFlag-height': '20px',
                            '--PhoneInputCountryFlag-width': '30px',
                          }}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                      )}
                      {!errors.phone && formData.phone && (
                        <p className="text-xs text-gray-500 mt-1">
                          Format: 11 digits (e.g., 08012345678)
                        </p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your address"
                        />
                      </div>
                      {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                    </div>

                    {/* State/Region Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="Enter your state/region"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                      
                      {errors.form && (
                        <div className="mt-3 text-center">
                          <button
                            type="button"
                            onClick={clearAllErrors}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Click here to clear errors and retry
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Right side - Image/Info */}
                <div className="md:w-1/2 bg-blue-600 relative hidden md:block">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl font-bold mb-2">Fly Smarter, Travel Better</h2>
                      <p className="text-blue-100 mb-4">
                        Join thousands of users booking with top airlines worldwide.
                      </p>
                      <div className="space-y-2">
                        {[
                          'Trusted global airline partners',
                          'Safe & secure payments',
                          '24/7 travel support',
                        ].map((text, i) => (
                          <div key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            <p className="text-sm text-blue-100">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    </>
  );
};

export default Register;
