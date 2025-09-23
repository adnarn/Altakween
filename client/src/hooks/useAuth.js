import { useContext } from 'react';
import {AuthContext} from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Ensure we're always working with a string role
  const getEffectiveRole = () => {
    if (!context.user && !context.userRole) return null;
    
    // If we have a user object with role, use that
    if (context.user && context.user.role) {
      return context.user.role;
    }
    
    // Otherwise use the userRole from context (handling both string and object cases)
    return typeof context.userRole === 'object' 
      ? context.userRole.role || context.userRole.user?.role || null 
      : context.userRole;
  };
  
  return {
    ...context,
    // Override userRole with the effective role
    userRole: getEffectiveRole()
  };
};

export default useAuth;
