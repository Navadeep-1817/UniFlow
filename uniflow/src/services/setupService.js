import api from './api';

const setupService = {
  /**
   * Get all universities
   * @returns {Promise} List of universities
   */
  getUniversities: async () => {
    try {
      const response = await api.get('/setup/universities');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch universities' };
    }
  },

  /**
   * Get all departments (optionally filtered by university)
   * @param {string} universityId - Optional university ID to filter
   * @returns {Promise} List of departments
   */
  getDepartments: async (universityId = null) => {
    try {
      const url = universityId 
        ? `/setup/departments?university=${universityId}`
        : '/setup/departments';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch departments' };
    }
  },

  /**
   * Get all student bodies (optionally filtered by university)
   * @param {string} universityId - Optional university ID to filter
   * @returns {Promise} List of student bodies
   */
  getStudentBodies: async (universityId = null) => {
    try {
      const url = universityId 
        ? `/student-bodies?university=${universityId}`
        : '/student-bodies';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student bodies' };
    }
  },
};

export default setupService;
