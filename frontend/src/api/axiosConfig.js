import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Aapka backend URL
});

// Har request se pehle token header mein add karne ke liye interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Login ke waqt save kiya hua token
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default API;