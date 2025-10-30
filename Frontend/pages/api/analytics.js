// pages/api/analytics/analytics.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Analytics API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// ANALYTICS API FUNCTIONS
// ============================================

export const getCarbonStatistics = async () => {
    try {
        const response = await axiosInstance.get('/analytics/carbon-stats');
        return response.data;
    } catch (error) {
        console.error('Error in getCarbonStatistics:', error);
        throw error;
    }
};

export const getStatisticsByRegion = async () => {
    try {
        const response = await axiosInstance.get('/analytics/by-region');
        return response.data;
    } catch (error) {
        console.error('Error in getStatisticsByRegion:', error);
        throw error;
    }
};

export const getTopEcoActivities = async (limit = 10) => {
    try {
        const response = await axiosInstance.get(`/analytics/top-eco?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error in getTopEcoActivities:', error);
        throw error;
    }
};

export const getActivityTypes = async () => {
    try {
        const response = await axiosInstance.get('/analytics/activity-types');
        return response.data;
    } catch (error) {
        console.error('Error in getActivityTypes:', error);
        throw error;
    }
};

export const getAccommodationsStats = async () => {
    try {
        const response = await axiosInstance.get('/analytics/accommodations-stats');
        return response.data;
    } catch (error) {
        console.error('Error in getAccommodationsStats:', error);
        throw error;
    }
};

export const getDifficultyDistribution = async () => {
    try {
        const response = await axiosInstance.get('/analytics/difficulty');
        return response.data;
    } catch (error) {
        console.error('Error in getDifficultyDistribution:', error);
        throw error;
    }
};

export const getCompleteDashboard = async () => {
    try {
        const response = await axiosInstance.get('/analytics/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error in getCompleteDashboard:', error);
        throw error;
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Parse SPARQL result values
export const parseSparqlValue = (field) => {
    if (!field) return null;
    if (typeof field === 'object' && 'value' in field) {
        return field.value;
    }
    return field;
};

// Parse entire SPARQL result array
export const parseSparqlResults = (results) => {
    if (!results || !Array.isArray(results)) return [];

    return results.map(item => {
        const parsed = {};
        for (const [key, valueObj] of Object.entries(item)) {
            parsed[key] = parseSparqlValue(valueObj);
        }
        return parsed;
    });
};
