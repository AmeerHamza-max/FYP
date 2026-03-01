import API from './client';

// Campaign se related saari API requests yahan se hongi
const campaignService = {
    
    // 1. Saari campaigns fetch karna (with Search, Status, Platform filters)
    getAllCampaigns: (filters) => {
        // filters aik object hoga: { search: '', status: '', platform: '' }
        return API.get('/campaigns', { params: filters });
    },

    // 2. Nayi campaign create karna (Form data yahan bhejenge)
    createCampaign: (campaignData) => {
        return API.post('/campaigns/create', campaignData);
    },

    // 3. Single campaign ki details lena (ID ke zariye)
    getCampaignById: (id) => {
        return API.get(`/campaigns/${id}`);
    },

    // 4. Campaign ko update karna
    updateCampaign: (id, updatedData) => {
        return API.put(`/campaigns/${id}`, updatedData);
    },

    // 5. Campaign delete karna
    deleteCampaign: (id) => {
        return API.delete(`/campaigns/${id}`);
    }
};

export default campaignService;