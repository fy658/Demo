import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Fetch all data
export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};


// Save data (supports both single row and multiple rows)
export const saveData = async (changedData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/data/bulk/`, changedData);
    return response.data;
  } catch (error) {
    console.error('Error saving data:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};
