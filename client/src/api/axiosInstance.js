import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://excel-adav.onrender.com/api', // Update if needed
    withCredentials: true, // Only needed if using cookies
});

// Attach token to all requests
instance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default instance;