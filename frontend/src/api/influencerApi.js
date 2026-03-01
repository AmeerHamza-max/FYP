import axios from 'axios';

// Backend ka base URL (Aap apni port ke mutabiq change kar sakte hain)
const API_URL = 'http://localhost:5000/api/influencers';

/**
 * 📊 Sab se pehle database mein store saara data fetch karne ke liye
 */
export const fetchAllInfluencers = async () => {
    try {
        const token = localStorage.getItem('token'); // Agar auth middleware use kar rahe hain
        const response = await axios.get(`${API_URL}/`, {
            headers: {
                'x-auth-token': token
            }
        });
        return response.data; // Yeh { success: true, data: [...] } return karega
    } catch (error) {
        console.error("❌ API Error [fetchAllInfluencers]:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 🤖 AI Recommendations fetch karne ke liye
 */
export const fetchRecommendations = async (niche, platform, budget) => {
    try {
        const response = await axios.get(`${API_URL}/recommend`, {
            params: { niche, platform, budget }
        });
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchRecommendations]:", error.message);
        throw error;
    }
};

/**
 * 🔍 Kisi specific influencer ki detail dekhne ke liye
 */
export const fetchInfluencerDetail = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchInfluencerDetail]:", error.message);
        throw error;
    }
};