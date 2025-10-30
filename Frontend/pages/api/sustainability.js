// pages/api/sustainability/sustainability.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Sustainability API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// SUSTAINABILITY INDICATORS API FUNCTIONS
// ============================================

// GET all indicators - Using your new endpoint
export const getAllIndicators = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/sustainability/all');
        console.log('All indicators response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getAllIndicators:', error);
        throw error;
    }
};

export const getIndicatorById = async (indicatorId) => {
    try {
        const response = await axiosInstance.get(`/sustainability/sustainability/${indicatorId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getIndicatorById:', error);
        throw error;
    }
};

export const createIndicator = async (indicatorData) => {
    try {
        const response = await axiosInstance.post('/sustainability/sustainability/', indicatorData);
        return response.data;
    } catch (error) {
        console.error('Error in createIndicator:', error);
        throw error;
    }
};

export const updateIndicator = async (indicatorId, indicatorData) => {
    try {
        const response = await axiosInstance.put(`/sustainability/sustainability/${indicatorId}`, indicatorData);
        return response.data;
    } catch (error) {
        console.error('Error in updateIndicator:', error);
        throw error;
    }
};

export const deleteIndicator = async (indicatorId) => {
    try {
        const response = await axiosInstance.delete(`/sustainability/sustainability/${indicatorId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteIndicator:', error);
        throw error;
    }
};

// Filter endpoints
export const getCarbonLeaders = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/sustainability/stats/carbon-leaders');
        console.log('Carbon leaders response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getCarbonLeaders:', error);
        throw error;
    }
};

export const getRenewableLeaders = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/sustainability/stats/renewable-leaders');
        console.log('Renewable leaders response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getRenewableLeaders:', error);
        throw error;
    }
};

export const getWaterEfficient = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/sustainability/stats/water-efficient');
        console.log('Water efficient response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getWaterEfficient:', error);
        throw error;
    }
};

export default axiosInstance;
