import api from './api';

const trainerService = {
  /**
   * Register a new trainer
   * @param {Object} trainerData - Trainer registration data
   * @returns {Promise} Response from API
   */
  register: async (trainerData) => {
    try {
      const response = await api.post('/trainers/register', trainerData);
      
      // Store auth data if token is returned
      if (response.data.data?.token) {
        localStorage.setItem('trainerToken', response.data.data.token);
        localStorage.setItem('trainerData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Trainer registration failed' };
    }
  },

  /**
   * Login trainer
   * @param {Object} credentials - Login credentials {email, password}
   * @returns {Promise} Response from API with token and trainer data
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/trainers/login', credentials);
      
      const { token, data } = response.data;

      // Store auth data
      localStorage.setItem('trainerToken', token);
      localStorage.setItem('trainerData', JSON.stringify(data));

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Trainer login failed' };
    }
  },

  /**
   * Get trainer profile
   * @returns {Promise} Trainer profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/trainers/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get trainer profile' };
    }
  },

  /**
   * Update trainer profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Response from API
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/trainers/profile', profileData);
      
      // Update stored data
      if (response.data.data) {
        localStorage.setItem('trainerData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  /**
   * Get trainer's assigned events
   * @returns {Promise} List of events
   */
  getEvents: async () => {
    try {
      const response = await api.get('/trainers/events');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get events' };
    }
  },

  /**
   * Get trainer statistics
   * @returns {Promise} Statistics data
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/trainers/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get statistics' };
    }
  },

  /**
   * Logout trainer
   * @returns {Promise} Response from API
   */
  logout: async () => {
    try {
      // Clear auth data
      localStorage.removeItem('trainerToken');
      localStorage.removeItem('trainerData');
      
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  /**
   * Check if trainer is authenticated
   * @returns {boolean} True if trainer is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('trainerToken');
    return !!token;
  },

  /**
   * Get stored trainer data
   * @returns {Object|null} Trainer data or null
   */
  getStoredTrainer: () => {
    const trainerStr = localStorage.getItem('trainerData');
    return trainerStr ? JSON.parse(trainerStr) : null;
  },
};

export default trainerService;
