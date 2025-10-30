// pages/api/carbon/carbon-optimizer.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Carbon Optimizer API Error:', error);
        return Promise.reject(error);
    }
);

// POST optimize trip - Carbon Footprint Optimization
export const optimizeTrip = async (tripData) => {
    try {
        console.log('Sending optimize trip request with data:', tripData);

        const response = await axiosInstance.post('/carbon-optimizer/optimize-trip', tripData);

        console.log('Optimize trip response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in optimizeTrip:', error);
        throw error;
    }
};

export default axiosInstance;
