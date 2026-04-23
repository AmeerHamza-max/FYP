/* eslint-disable */
import axios from 'axios';

const INFLUENCER_API = 'http://localhost:5000/api/influencers';
const CAMPAIGN_API   = 'http://localhost:5000/api/campaigns';

// ── Auth Headers ─────────────────────────────────────────────────────
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'x-auth-token': token
        }
    };
};

// ── 1. Fetch All Influencers ─────────────────────────────────────────
// params: { type: 'all' | 'ai', search, platform, niche, sortBy }
export const fetchAllInfluencers = async (params = {}) => {
    try {
        const response = await axios.get(`${INFLUENCER_API}/`, {
            ...getHeaders(),
            params  // type=all ya type=ai yahan se jayega
        });
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchAllInfluencers]:", error.response?.data || error.message);
        throw error;
    }
};

// ── 2. Fetch Recommendations ─────────────────────────────────────────
export const fetchRecommendations = async (niche, platform, budget) => {
    try {
        const response = await axios.get(`${INFLUENCER_API}/recommend`, {
            ...getHeaders(),
            params: { niche, platform, budget }
        });
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchRecommendations]:", error.message);
        throw error;
    }
};

// ── 3. Fetch Single Influencer Detail ───────────────────────────────
export const fetchInfluencerDetail = async (id) => {
    try {
        const response = await axios.get(`${INFLUENCER_API}/${id}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchInfluencerDetail]:", error.message);
        throw error;
    }
};

// ── 4. Fetch Influencer Analytics ───────────────────────────────────
export const fetchInfluencerAnalytics = async () => {
    try {
        const response = await axios.get(`${INFLUENCER_API}/stats/analytics`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchInfluencerAnalytics]:", error.response?.data || error.message);
        throw error;
    }
};

// ── 5. Fetch Campaign Analytics ──────────────────────────────────────
export const fetchCampaignAnalytics = async () => {
    try {
        const response = await axios.get(`${CAMPAIGN_API}/analytics`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchCampaignAnalytics]:", error.response?.data || error.message);
        throw error;
    }
};

// ── 6. Fetch All Campaigns ───────────────────────────────────────────
export const fetchAllCampaigns = async () => {
    try {
        const response = await axios.get(`${CAMPAIGN_API}/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchAllCampaigns]:", error.response?.data || error.message);
        throw error;
    }
};

// ── 7. Fetch Single Campaign ─────────────────────────────────────────
export const fetchCampaignById = async (id) => {
    try {
        const response = await axios.get(`${CAMPAIGN_API}/${id}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ API Error [fetchCampaignById]:", error.response?.data || error.message);
        throw error;
    }
};