// pages/api/users/users.js
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
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// TOURIST API FUNCTIONS
// ============================================

const mapTouristToBackendFields = (frontendData) => {
    // Remove the ID generation - backend will handle it
    return {
        tourist_id: frontendData.id || null, // Backend auto-generates if null
        name: frontendData.name || '',
        email: frontendData.email || null,
        nationality: frontendData.nationality || null,
        preferences: frontendData.preferences || null
    };
};

const mapTouristToFrontendFields = (backendData) => {
    if (!backendData) return null;

    return {
        id: backendData.tourist_id || backendData.uri?.split('/').pop() || '',
        name: backendData.name || '',
        email: backendData.email || '',
        nationality: backendData.nationality || '',
        preferences: backendData.preferences || '',
        registrationDate: backendData.registrationDate || '',
        uri: backendData.uri || ''
    };
};

const extractTourists = (response) => {
    if (response.data && Array.isArray(response.data.tourists)) {
        return response.data.tourists;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllTourists = async (limit = 100) => {
    try {
        const response = await axiosInstance.get(`/users/?limit=${limit}`); // Changed from /tourists/
        const backendTourists = extractTourists(response);
        return backendTourists.map(t => mapTouristToFrontendFields(t)).filter(t => t !== null);
    } catch (error) {
        console.error('Error in getAllTourists:', error);
        throw error;
    }
};

export const getTouristById = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`); // Changed from /tourists/
        return mapTouristToFrontendFields(response.data.tourist || response.data);
    } catch (error) {
        console.error('Error in getTouristById:', error);
        throw error;
    }
};

export const createTourist = async (touristData) => {
    try {
        const backendData = mapTouristToBackendFields(touristData);
        console.log('Sending tourist data to backend:', backendData);
        const response = await axiosInstance.post('/users/', backendData); // Changed from /tourists/
        return response.data;
    } catch (error) {
        console.error('Error in createTourist:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateTourist = async (id, touristData) => {
    try {
        const backendData = mapTouristToBackendFields(touristData);
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && key !== 'tourist_id') {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating tourist with data:', updateData);
        const response = await axiosInstance.put(`/users/${id}`, updateData); // Changed from /tourists/
        return response.data;
    } catch (error) {
        console.error('Error in updateTourist:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteTourist = async (id) => {
    try {
        const response = await axiosInstance.delete(`/users/${id}`); // Changed from /tourists/
        return response.data;
    } catch (error) {
        console.error('Error in deleteTourist:', error);
        throw error;
    }
};

// ============================================
// GUIDE API FUNCTIONS
// ============================================

const mapGuideToBackendFields = (frontendData) => {
    return {
        guide_id: frontendData.id || null, // Backend auto-generates if null
        name: frontendData.name || '',
        language: frontendData.language || '',
        certification: frontendData.certification || null,
        experience_years: frontendData.experienceYears ? parseInt(frontendData.experienceYears) : null
    };
};

const mapGuideToFrontendFields = (backendData) => {
    if (!backendData) return null;

    return {
        id: backendData.guide_id || backendData.uri?.split('/').pop() || '',
        name: backendData.name || '',
        language: backendData.language || '',
        certification: backendData.certification || '',
        experienceYears: backendData.experienceYears || backendData.experience_years || 0,
        uri: backendData.uri || ''
    };
};

const extractGuides = (response) => {
    if (response.data && Array.isArray(response.data.guides)) {
        return response.data.guides;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllGuides = async (language = null, limit = 100) => {
    try {
        let url = `/users/guides/?limit=${limit}`; // Changed from /tourists/guides/
        if (language) {
            url += `&language=${encodeURIComponent(language)}`;
        }
        const response = await axiosInstance.get(url);
        const backendGuides = extractGuides(response);
        return backendGuides.map(g => mapGuideToFrontendFields(g)).filter(g => g !== null);
    } catch (error) {
        console.error('Error in getAllGuides:', error);
        throw error;
    }
};

export const getGuideById = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/guides/${id}`); // Changed from /tourists/guides/
        return mapGuideToFrontendFields(response.data.guide || response.data);
    } catch (error) {
        console.error('Error in getGuideById:', error);
        throw error;
    }
};

export const createGuide = async (guideData) => {
    try {
        const backendData = mapGuideToBackendFields(guideData);
        console.log('Sending guide data to backend:', backendData);
        const response = await axiosInstance.post('/users/guides/', backendData); // Changed from /tourists/guides/
        return response.data;
    } catch (error) {
        console.error('Error in createGuide:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateGuide = async (id, guideData) => {
    try {
        const backendData = mapGuideToBackendFields(guideData);
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && key !== 'guide_id') {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating guide with data:', updateData);
        const response = await axiosInstance.put(`/users/guides/${id}`, updateData); // Changed from /tourists/guides/
        return response.data;
    } catch (error) {
        console.error('Error in updateGuide:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteGuide = async (id) => {
    try {
        const response = await axiosInstance.delete(`/users/guides/${id}`); // Changed from /tourists/guides/
        return response.data;
    } catch (error) {
        console.error('Error in deleteGuide:', error);
        throw error;
    }
};
