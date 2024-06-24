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

// Save data
export const saveData = async (changes, data) => {
  try {
    for (const [row, prop, oldValue, newValue] of changes) {
      const updatedRow = { ...data[row], [prop]: newValue };
      await axios.post(`${API_BASE_URL}/data/`, updatedRow);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Fetch statistics
export const fetchStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {};
  }
};