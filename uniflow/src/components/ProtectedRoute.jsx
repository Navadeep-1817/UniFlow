import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api.config';

/**
 * ProtectedRoute Component
 * 
 * Provides authentication and role-based access control for routes.
 * 
 * Features:
 * - Verifies user is authenticated (has valid token)
 * - Validates user role matches required role(s)
 * - Checks approval status for admin roles
 * - Handles loading states during authentication check
 * - Redirects unauthorized users appropriately
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string|string[]} props.allowedRoles - Role(s) allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  const API_BASE_URL = API_CONFIG.BASE_URL;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if token exists in localStorage or cookie
        const token = localStorage.getItem('token') || getCookie('token');
        
        if (!token) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: 'No authentication token found'
          });
          return;
        }

        // Verify token with backend
        const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data.success && response.data.user) {
          const user = response.data.user;

          // Check if user is approved (for admin roles)
          if (isAdminRole(user.role) && user.approvalStatus !== 'approved') {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: user,
              error: 'pending_approval'
            });
            return;
          }

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: user,
            error: null
          });
        } else {
          throw new Error('Invalid authentication response');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        
        // Clear invalid token
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error.response?.data?.message || 'Authentication failed'
        });
      }
    };

    verifyAuth();
  }, [API_BASE_URL, location.pathname]);

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Helper function to check if role is admin type
  const isAdminRole = (role) => {
    const adminRoles = ['superadmin', 'academic_admin', 'non_academic_admin', 'hod', 'placement_officer', 'faculty_head', 'sports_coordinator'];
    return adminRoles.includes(role);
  };

  // Helper function to normalize role names
  const normalizeRole = (role) => {
    const roleMap = {
      'super_admin': 'superadmin',
      'academic_admin': 'academic_admin',
      'non_academic_admin': 'non_academic_admin',
      'hod': 'hod',
      'placement_officer': 'placement_officer',
      'faculty': 'faculty',
      'student': 'student',
      'trainer': 'trainer',
      'team_rep': 'team_rep',
      'faculty_head': 'faculty_head',
      'sports_coordinator': 'sports_coordinator'
    };
    return roleMap[role] || role;
  };

  // Helper function to check if user has required role
  const hasRequiredRole = (userRole, requiredRoles) => {
    if (!requiredRoles) return true; // No role requirement
    
    const normalizedUserRole = normalizeRole(userRole);
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const normalizedRequiredRoles = rolesArray.map(r => normalizeRole(r));
    
    return normalizedRequiredRoles.includes(normalizedUserRole);
  };

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user needs approval
  if (authState.error === 'pending_approval') {
    return <Navigate to="/pending-approval" state={{ from: location }} replace />;
  }

  // Not authenticated - redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && !hasRequiredRole(authState.user.role, allowedRoles)) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = getDashboardPath(authState.user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and authorized - render the protected component
  return children;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role) => {
  const dashboardMap = {
    'superadmin': '/superadmin/dashboard',
    'super_admin': '/superadmin/dashboard',
    'student': '/student/dashboard',
    'faculty': '/faculty/dashboard',
    'hod': '/hod/dashboard',
    'placement_officer': '/placement/dashboard',
    'team_rep': '/teamrep/dashboard',
    'faculty_head': '/student-body/faculty-head/dashboard',
    'sports_coordinator': '/sports/dashboard',
    'trainer': '/trainer/dashboard',
    'academic_admin': '/academic/dashboard',
    'non_academic_admin': '/non-academic/dashboard'
  };
  
  return dashboardMap[role] || '/login';
};

export default ProtectedRoute;
