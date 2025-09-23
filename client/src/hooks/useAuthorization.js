import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth';

const useAuthorization = (allowedRoles = [], redirectTo = '/login') => {
  const { isAuthenticated, userRole, loading, user, checkAuth } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get the effective role from user data
  const getEffectiveRole = useCallback(() => {
    if (!user && !userRole) return null;
    
    // If we have a user object with role, use that
    if (user && user.role) {
      return user.role;
    }
    
    // Otherwise use the userRole from auth context
    return typeof userRole === 'object' ? userRole.role || null : userRole;
  }, [user, userRole]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsChecking(true);
        
        // First, check if we have a valid session
        const isAuthValid = await checkAuth();
        
        if (!isAuthValid) {
          console.log('Session not valid, redirecting to login');
          setIsAuthorized(false);
          navigate(redirectTo, { 
            state: { 
              from: location,
              message: 'Please log in to continue.'
            },
            replace: true 
          });
          return;
        }

        const currentRole = getEffectiveRole();
        console.log('Auth check:', { isAuthenticated, currentRole, allowedRoles, user });
        
        // If no specific roles required, any authenticated user is authorized
        if (allowedRoles.length === 0) {
          console.log('No roles required, user is authorized');
          setIsAuthorized(true);
          return;
        }

        // Check if user has any of the allowed roles
        const hasRequiredRole = currentRole && allowedRoles.includes(currentRole);
        console.log('Role check:', { currentRole, allowedRoles, hasRequiredRole });
        
        setIsAuthorized(!!hasRequiredRole);

        // Redirect if not authorized
        if (!hasRequiredRole) {
          console.log('User not authorized for this route');
          if (allowedRoles.includes('admin')) {
            navigate('/unauthorized', { 
              state: { 
                from: location,
                message: 'You do not have permission to access the admin panel.'
              },
              replace: true 
            });
          } else {
            navigate(redirectTo, { 
              state: { 
                from: location,
                message: 'You do not have permission to access this page.'
              },
              replace: true 
            });
          }
        }
      } catch (error) {
        console.error('Authorization error:', error);
        setIsAuthorized(false);
        navigate(redirectTo, { 
          state: { 
            from: location,
            message: 'An error occurred while verifying your access.'
          },
          replace: true 
        });
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, userRole, user, loading, allowedRoles, redirectTo, navigate, location, checkAuth, getEffectiveRole]);

  return { 
    isAuthorized, 
    loading: loading || isChecking,
    userRole: getEffectiveRole(),
    user
  };
};

export default useAuthorization;