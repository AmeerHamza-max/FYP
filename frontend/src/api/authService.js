import client from './client';

/**
 * Register a new User/Business
 */
export const registerUser = async (userData) => {
    try {
        const response = await client.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

/**
 * Login User & Save Session
 */
export const loginUser = async (credentials) => {
    try {
        const response = await client.post('/auth/login', credentials);
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

/**
 * Forgot Password - Token generation request
 * User ka email backend ko bhejta hai taake link generate ho
 */
export const forgotPassword = async (email) => {
    try {
        // Backend expects: { email: "example@mail.com" }
        const response = await client.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to send reset email");
    }
};

/**
 * Reset Password - Using token from URL
 * Backend expects PUT request with new password
 */
export const resetPassword = async (token, newPassword) => {
    try {
        // Backend route: /auth/reset-password/:token
        const response = await client.put(`/auth/reset-password/${token}`, { 
            password: newPassword 
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Password reset failed");
    }
};

/**
 * Logout Utility
 */
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

/**
 * Helper: Get Current User Data
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};