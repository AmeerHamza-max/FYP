import client from './client'; // Aapka axios instance

const inquiryService = {
  // Inquiry submit karne ka function
  submit: async (data) => {
    try {
      // Backend path: /api/inquiry + /submit
      // Agar client.js mein baseURL 'http://localhost:5000/api' set hai, 
      // toh sirf '/inquiry/submit' likhna kafi hai.
      const response = await client.post('/inquiry/submit', data);
      return response.data;
    } catch (error) {
      // Error handling ko behtar kiya gaya hai
      throw error.response ? error.response.data : new Error("Network Error");
    }
  }
};

export default inquiryService;