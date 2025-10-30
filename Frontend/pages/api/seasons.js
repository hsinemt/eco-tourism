// pages/api/seasons/seasons.js
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
        console.error('Seasons API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// SEASONS API FUNCTIONS
// ============================================

// GET all seasons
export const getAllSeasons = async (limit = 100) => {
    try {
        const response = await axiosInstance.get(`/seasons/?limit=${limit}`);
        console.log('All seasons response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getAllSeasons:', error);
        throw error;
    }
};

// GET season by ID
export const getSeasonById = async (seasonId) => {
    try {
        const response = await axiosInstance.get(`/seasons/${seasonId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getSeasonById:', error);
        throw error;
    }
};

// POST create season
export const createSeason = async (seasonData) => {
    try {
        const response = await axiosInstance.post('/seasons/', seasonData);
        return response.data;
    } catch (error) {
        console.error('Error in createSeason:', error);
        throw error;
    }
};

// PUT update season
export const updateSeason = async (seasonId, seasonData) => {
    try {
        const response = await axiosInstance.put(`/seasons/${seasonId}`, seasonData);
        return response.data;
    } catch (error) {
        console.error('Error in updateSeason:', error);
        throw error;
    }
};

// DELETE season
export const deleteSeason = async (seasonId) => {
    try {
        const response = await axiosInstance.delete(`/seasons/${seasonId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteSeason:', error);
        throw error;
    }
};

// GET peak seasons (high tourism)
export const getPeakSeasons = async () => {
    try {
        const response = await axiosInstance.get('/seasons/stats/peak-seasons');
        console.log('Peak seasons response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getPeakSeasons:', error);
        throw error;
    }
};

// GET warmest seasons
export const getWarmestSeasons = async (limit = 5) => {
    try {
        const response = await axiosInstance.get(`/seasons/stats/warmest?limit=${limit}`);
        console.log('Warmest seasons response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getWarmestSeasons:', error);
        throw error;
    }
};

// GET activities by season
export const getActivitiesBySeason = async (seasonId, limit = 10) => {
    try {
        const response = await axiosInstance.get(`/seasons/current/activities?season_id=${seasonId}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error in getActivitiesBySeason:', error);
        throw error;
    }
};

export default axiosInstance;
