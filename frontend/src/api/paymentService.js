import API from './axiosConfig';

/**
 * @desc    Backend ko subscribe request bhejna
 * @param   {Object} subscriptionData - { planName, billingCycle }
 */
export const subscribeToPlan = async (subscriptionData) => {
    try {
        const response = await API.post('/payments/subscribe', subscriptionData);
        return response.data; // Success message aur subscription details return karega
    } catch (error) {
        // Error handle karein jo backend se aa raha hai
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

/**
 * @desc    User ki current subscription status check karna
 */
export const getMySubscription = async () => {
    try {
        const response = await API.get('/payments/my-subscription');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};