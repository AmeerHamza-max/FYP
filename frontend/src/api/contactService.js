import axios from 'axios';

// Backend Base URL - Apne backend port ke mutabiq check kar lein
const API_URL = 'http://localhost:5000/api/contact';

/**
 * @desc Contact Form Submit karne ki service
 * @param {Object} contactData - { name, email, message }
 */
export const submitContactMessage = async (contactData) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, contactData);
    return response.data; // Success: { success: true, message: "..." }
  } catch (error) {
    // Error handling: Agar backend se specific message aaye toh wo dikhana, warna default
    const errorMsg = error.response?.data?.message || 'Server error, please try again later.';
    throw new Error(errorMsg);
  }
};