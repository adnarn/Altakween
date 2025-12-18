"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import PropTypes from "prop-types"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true) // Initial loading state for checking local storage
  const [error, setError] = useState(null)
  
  // const API_BASE_URL = "http://localhost:8081/api"
  const API_BASE_URL = "https://altakween-4nng.vercel.app/api"

  // Get user role from current user
  const getUserRole = useCallback((user) => {
    if (!user) return null;
    // Check for role in user object (adjust according to your API response structure)
    return user.role || (user.isAdmin ? 'admin' : 'user');
  }, []);

  // Load user from local storage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("altaqween_user")
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setUserRole(getUserRole(user));
      }
    } catch (err) {
      console.error("Failed to load user from local storage:", err)
      localStorage.removeItem("altaqween_user") // Clear corrupted data
    } finally {
      setLoading(false)
    }
  }, [getUserRole])

  // Login function
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        if (response.data.user && response.data.token) {
          const userWithToken = { 
            ...response.data.user, 
            token: response.data.token,
            role: response.data.user.role || 'user' // Ensure role is set, default to 'user'
          };
          
          setCurrentUser(userWithToken);
          const role = getUserRole(userWithToken);
          setUserRole(role);
          localStorage.setItem("altaqween_user", JSON.stringify(userWithToken));
          
          // Set default auth header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          toast.success("Login successful!");
          return role; // Return the user's role
        } else {
          throw new Error(response.data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Login failed";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getUserRole],
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
        });
        
        if (response.status === 400) {
          // Handle validation errors
          const errorMessage = response.data?.message || 'Validation failed';
          const validationErrors = response.data?.errors || {};
          
          const formattedErrors = Object.entries(validationErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
            
          throw new Error(formattedErrors || errorMessage);
        }
        
        if (!response.data.user || !response.data.token) {
          throw new Error(response.data?.message || 'Registration failed: Invalid server response');
        }
        
        const userWithToken = { 
          ...response.data.user, 
          token: response.data.token,
          role: response.data.user.role || 'user' // Ensure role is set, default to 'user'
        };
        
        setCurrentUser(userWithToken);
        const role = getUserRole(userWithToken);
        setUserRole(role);
        localStorage.setItem("altaqween_user", JSON.stringify(userWithToken));
        
        // Set default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        toast.success("Registration successful! You are now logged in.");
        return { success: true, role };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Registration failed.";
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [getUserRole],
  )

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem("altaqween_user");
    delete axios.defaults.headers.common['Authorization'];
    toast.info("You have been logged out.");
  }, [])

  const value = {
    currentUser,
    userRole, // Add userRole to the context value
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: userRole === 'admin', // Helper boolean for admin checks
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
