/* eslint-disable */
import API from './client';

const campaignService = {

    // 1. Fetch all campaigns
    getAllCampaigns: async (filters) => {
        const response = await API.get('/campaigns', { params: filters });
        return response.data;
    },

    // 2. Create Campaign
    createCampaign: async (campaignData) => {
        const response = await API.post('/campaigns/create', campaignData, {
            timeout: 60000 
        });
        return response.data;
    },

    // 3. Get Single Campaign
    getCampaignById: async (id) => {
        const response = await API.get(`/campaigns/${id}`);
        console.log("DEBUG: Service Raw Response:", response.data);
        const result = response.data.data || response.data;
        console.log("DEBUG: Service Normalized Data:", result);
        return result;
    },

    // 4. Update Campaign
    updateCampaign: async (id, updatedData) => {
        const response = await API.put(`/campaigns/${id}`, updatedData);
        return response.data;
    },

    // 5. Update Campaign Status (NEW)
    updateCampaignStatus: async (id, status) => {
        const response = await API.patch(`/campaigns/${id}/status`, {
            status
        });
        return response.data;
    },

    // 6. Delete Campaign
    deleteCampaign: async (id) => {
        const response = await API.delete(`/campaigns/${id}`);
        return response.data;
    },

    // --- NEW: FETCH ANALYTICS DATA (SIRF YEH ADD KIYA HAI) ---
    getAnalytics: async () => {
        try {
            // Yeh wahi route hai jo humne backend routes mein set kiya tha
            const response = await API.get('/campaigns/stats/analytics');
            return response.data; 
        } catch (error) {
            console.error("❌ Analytics Service Error:", error.message);
            throw error;
        }
    }
};

export default campaignService;