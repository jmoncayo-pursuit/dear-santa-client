const API_URL = '/api';  // Use relative path since we're using Vite proxy

const api = {
  // Get all letters
  getLetters: async () => {
    try {
      const response = await fetch(`${API_URL}/letters`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || 'Failed to fetch letters');
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Submit a new letter
  submitLetter: async (letterData) => {
    try {
      const response = await fetch(`${API_URL}/letters/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(letterData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || 'Failed to submit letter');
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default api; 