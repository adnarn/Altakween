"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useApi } from "./ApiContext" // Import useApi to make API calls
import { toast } from "react-toastify"

export const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true) // Initial loading state for checking local storage
  const [error, setError] = useState(null)
  const { post } = useApi() // Use the post method from ApiContext

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
        const response = await post("/auth/login", { email, password });
        if (response.user && response.token) {
          const userWithToken = { 
            ...response.user, 
            token: response.token,
            role: response.user.role || 'user' // Ensure role is set, default to 'user'
          };
          setCurrentUser(userWithToken);
          const role = getUserRole(userWithToken);
          setUserRole(role);
          localStorage.setItem("altaqween_user", JSON.stringify(userWithToken));
          toast.success("Login successful!");
          return role; // Return the user's role
        } else {
          throw new Error(response.message || "Login failed.");
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Login failed";
        toast.error(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [post, getUserRole]
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await post("/auth/register", userData)
        if (response.user && response.token) {
          const userWithToken = { 
            ...response.user, 
            token: response.token,
            role: response.user.role || 'user' // Ensure role is set, default to 'user'
          };
          setCurrentUser(userWithToken);
          const role = getUserRole(userWithToken);
          setUserRole(role);
          localStorage.setItem("altaqween_user", JSON.stringify(userWithToken));
          toast.success("Registration successful! You are now logged in.")
          return { success: true, role }
        } else {
          throw new Error(response.message || "Registration failed.")
        }
      } catch (err) {
        setError(err.message)
        toast.error(err.message || "Registration failed.")
        return { success: false, message: err.message }
      } finally {
        setLoading(false)
      }
    },
    [post, getUserRole],
  )

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null)
    setUserRole(null)
    localStorage.removeItem("altaqween_user")
    toast.info("You have been logged out.")
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
