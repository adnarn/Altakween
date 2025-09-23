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
  const [loading, setLoading] = useState(true) // Initial loading state for checking local storage
  const [error, setError] = useState(null)
  const { post } = useApi() // Use the post method from ApiContext

  // Load user from local storage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("altaqween_user")
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error("Failed to load user from local storage:", err)
      localStorage.removeItem("altaqween_user") // Clear corrupted data
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(
    async (email, password) => {  // Accept email and password as separate parameters
      setLoading(true);
      setError(null);
      try {
        const response = await post("/auth/login", { email, password }); // Send as object
        if (response.user && response.token) {
          const userWithToken = { ...response.user, token: response.token };
          setCurrentUser(userWithToken);
          localStorage.setItem("altaqween_user", JSON.stringify(userWithToken));
          toast.success("Login successful!");
          return userWithToken.role; // Return the user's role
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
    [post] // Make sure post is in the dependency array
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await post("/auth/register", userData)
        if (response.user && response.token) {
          const userWithToken = { ...response.user, token: response.token }
          setCurrentUser(userWithToken)
          localStorage.setItem("altaqween_user", JSON.stringify(userWithToken))
          toast.success("Registration successful! You are now logged in.")
          return { success: true }
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
    [post],
  )

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem("altaqween_user")
    toast.info("You have been logged out.")
  }, [])

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
