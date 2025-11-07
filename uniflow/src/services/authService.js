import api from './api';

// Map frontend roles to backend roles
const ROLE_MAPPING = {
  'student': 'student',
  'faculty': 'faculty',
  'hod': 'academic_admin_hod',
  'placement': 'academic_admin_tp',
  'faculty_head': 'non_academic_faculty_head',
  'team_rep': 'non_academic_team_rep',
  'sports': 'trainer',
  'superadmin': 'superadmin'
};

// Reverse mapping for displaying roles
const ROLE_DISPLAY_MAPPING = {
  'student': 'student',
  'faculty': 'faculty',
  'academic_admin_hod': 'hod',
  'academic_admin_tp': 'placement',
  'non_academic_faculty_head': 'faculty_head',
  'non_academic_team_rep': 'team_rep',
  'trainer': 'sports',
  'superadmin': 'superadmin'
};

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response from API
   */
  register: async (userData) => {
    try {
      // Map frontend role to backend role
      const backendRole = ROLE_MAPPING[userData.role] || userData.role;
      
      // Prepare registration payload based on role
      const payload = {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '0000000000', // Temporary default if not provided
        role: backendRole,
      };

      // Add role-specific data
      if (userData.role === 'student') {
        payload.university = userData.university;
        payload.department = userData.department;
        payload.rollNumber = userData.rollNumber;
        payload.year = userData.year || '1';
        payload.section = userData.section || 'A';
        payload.batch = userData.batch || new Date().getFullYear().toString();
      } else if (userData.role === 'faculty') {
        payload.university = userData.university;
        payload.department = userData.department;
        payload.employeeId = userData.employeeId;
        payload.designation = userData.designation || 'Assistant Professor';
        payload.qualification = userData.qualification || 'M.Tech';
      } else if (userData.role === 'hod' || userData.role === 'placement') {
        payload.university = userData.university;
        payload.department = userData.department;
      } else if (userData.role === 'faculty_head' || userData.role === 'team_rep') {
        payload.university = userData.university;
        payload.studentBody = userData.studentBody;
      }

      const response = await api.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials {email, password, role}
   * @returns {Promise} Response from API with token and user data
   */
  login: async (credentials) => {
    try {
      // Map frontend role to backend role
      const backendRole = ROLE_MAPPING[credentials.role] || credentials.role;
      
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        role: backendRole,
      });

      const { token, data } = response.data;

      // Store auth data
      if (credentials.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  /**
   * Logout user
   * @returns {Promise} Response from API
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  /**
   * Get current user data
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Response from API
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/updatedetails', userData);
      
      // Update stored user data
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  /**
   * Update password
   * @param {Object} passwordData - {currentPassword, newPassword}
   * @returns {Promise} Response from API
   */
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/updatepassword', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password update failed' };
    }
  },

  /**
   * Forgot password - request reset token
   * @param {string} email - User email
   * @returns {Promise} Response from API
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgotpassword', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset request failed' };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} Response from API
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.put(`/auth/resetpassword/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  getStoredUser: () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get user's frontend role (for routing)
   * @returns {string|null} Frontend role or null
   */
  getUserRole: () => {
    const user = authService.getStoredUser();
    if (!user) return null;
    
    // Map backend role to frontend role for routing
    return ROLE_DISPLAY_MAPPING[user.role] || user.role;
  },
};

export default authService;
