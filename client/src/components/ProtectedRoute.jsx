import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  
  // If still loading user data from localStorage, show a loading indicator or nothing
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified and user's role is not in allowedRoles, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If user is authenticated and has the required role, render the children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
