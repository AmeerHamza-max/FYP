import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/api', // Tumhara backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: Har request ke sath token bhejne ke liye
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;