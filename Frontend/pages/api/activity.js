// pages/api/activities/activity.js

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

// Map frontend field names to backend field names
const mapToBackendFields = (frontendData) => {
    const activityId = frontendData.id || `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const baseData = {
        type: frontendData.type || 'NatureActivity',
        activityId: activityId,
        activityName: frontendData.name || '',
        activityDescription: frontendData.description || '',
        pricePerPerson: frontendData.pricePerPerson ? parseFloat(frontendData.pricePerPerson) : 0,
        durationHours: frontendData.durationHours ? parseInt(frontendData.durationHours) : 1,
        difficultyLevel: frontendData.difficultyLevel || 'Easy',
        maxParticipants: frontendData.maxParticipants ? parseInt(frontendData.maxParticipants) : 10,
        minAge: frontendData.minAge ? parseInt(frontendData.minAge) : 0,
        activityRating: frontendData.activityRating ? parseFloat(frontendData.activityRating) : 0,
        schedule: frontendData.schedule || '',
        activityLanguages: frontendData.activityLanguages || '',
    };

    // Adventure-specific fields
    if (frontendData.type === 'AdventureActivity') {
        baseData.riskLevel = frontendData.riskLevel ? parseInt(frontendData.riskLevel) : 1;
        baseData.requiredEquipment = frontendData.requiredEquipment || '';
        baseData.physicalFitnessRequired = frontendData.physicalFitnessRequired || '';
        baseData.safetyBriefingRequired = Boolean(frontendData.safetyBriefingRequired);
    }

    // Cultural-specific fields
    if (frontendData.type === 'CulturalActivity') {
        baseData.culturalTheme = frontendData.culturalTheme || '';
        baseData.historicalPeriod = frontendData.historicalPeriod || '';
        baseData.audioGuideAvailable = Boolean(frontendData.audioGuideAvailable);
        baseData.photographyAllowed = Boolean(frontendData.photographyAllowed);
    }

    // Nature-specific fields
    if (frontendData.type === 'NatureActivity') {
        baseData.ecosystemType = frontendData.ecosystemType || '';
        baseData.wildlifeSpotting = frontendData.wildlifeSpotting || '';
        baseData.bestTimeToVisit = frontendData.bestTimeToVisit || '';
        baseData.binocularsProvided = Boolean(frontendData.binocularsProvided);
    }

    return baseData;
};

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData) => {
    if (!backendData) return null;

    const baseData = {
        id: backendData.activityId,
        type: backendData.activityType || backendData.type,
        name: backendData.activityName || '',
        description: backendData.activityDescription || '',
        pricePerPerson: backendData.pricePerPerson || 0,
        durationHours: backendData.durationHours || 1,
        difficultyLevel: backendData.difficultyLevel || 'Easy',
        maxParticipants: backendData.maxParticipants || 10,
        minAge: backendData.minAge || 0,
        activityRating: backendData.activityRating || 0,
        schedule: backendData.schedule || '',
        activityLanguages: backendData.activityLanguages || '',
        uri: backendData.uri || ''
    };

    // Adventure-specific fields
    if (backendData.activityType === 'AdventureActivity' || backendData.type === 'AdventureActivity') {
        baseData.riskLevel = backendData.riskLevel || 1;
        baseData.requiredEquipment = backendData.requiredEquipment || '';
        baseData.physicalFitnessRequired = backendData.physicalFitnessRequired || '';
        baseData.safetyBriefingRequired = Boolean(backendData.safetyBriefingRequired);
    }

    // Cultural-specific fields
    if (backendData.activityType === 'CulturalActivity' || backendData.type === 'CulturalActivity') {
        baseData.culturalTheme = backendData.culturalTheme || '';
        baseData.historicalPeriod = backendData.historicalPeriod || '';
        baseData.audioGuideAvailable = Boolean(backendData.audioGuideAvailable);
        baseData.photographyAllowed = Boolean(backendData.photographyAllowed);
    }

    // Nature-specific fields
    if (backendData.activityType === 'NatureActivity' || backendData.type === 'NatureActivity') {
        baseData.ecosystemType = backendData.ecosystemType || '';
        baseData.wildlifeSpotting = backendData.wildlifeSpotting || '';
        baseData.bestTimeToVisit = backendData.bestTimeToVisit || '';
        baseData.binocularsProvided = Boolean(backendData.binocularsProvided);
    }

    return baseData;
};

// Helper function to extract activities from backend response
const extractActivities = (response) => {
    if (response.data && Array.isArray(response.data.activities)) {
        return response.data.activities;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllActivities = async (type = null) => {
    try {
        const url = type ? `/activities/?type=${type}` : '/activities/';
        const response = await axiosInstance.get(url);
        const backendActivities = extractActivities(response);
        return backendActivities.map(act => mapToFrontendFields(act)).filter(act => act !== null);
    } catch (error) {
        console.error('Error in getAllActivities:', error);
        throw error;
    }
};

export const getActivityById = async (id) => {
    try {
        const response = await axiosInstance.get(`/activities/${id}`);
        return mapToFrontendFields(response.data.activity || response.data);
    } catch (error) {
        console.error('Error in getActivityById:', error);
        throw error;
    }
};

export const createActivity = async (activityData) => {
    try {
        const backendData = mapToBackendFields(activityData);
        console.log('Sending data to backend:', backendData);
        const response = await axiosInstance.post('/activities/', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createActivity:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateActivity = async (id, activityData) => {
    try {
        const backendData = mapToBackendFields(activityData);
        // For update, we only send the fields that are actually provided
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && key !== 'activityId') {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating activity with data:', updateData);
        const response = await axiosInstance.put(`/activities/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateActivity:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteActivity = async (id) => {
    try {
        const response = await axiosInstance.delete(`/activities/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteActivity:', error);
        throw error;
    }
};

export const searchActivities = async (searchTerm) => {
    try {
        const response = await axiosInstance.get(`/activities/search/${searchTerm}`);
        const backendActivities = extractActivities(response);
        return backendActivities.map(act => mapToFrontendFields(act)).filter(act => act !== null);
    } catch (error) {
        console.error('Error in searchActivities:', error);
        throw error;
    }
};

export const getTopRatedActivities = async () => {
    try {
        const response = await axiosInstance.get('/activities/stats/top-rated');
        const backendActivities = extractActivities(response);
        return backendActivities.map(act => mapToFrontendFields(act)).filter(act => act !== null);
    } catch (error) {
        console.error('Error in getTopRatedActivities:', error);
        throw error;
    }
};

export const getCheapestActivities = async () => {
    try {
        const response = await axiosInstance.get('/activities/stats/cheapest');
        const backendActivities = extractActivities(response);
        return backendActivities.map(act => mapToFrontendFields(act)).filter(act => act !== null);
    } catch (error) {
        console.error('Error in getCheapestActivities:', error);
        throw error;
    }
};

export const compareActivities = async (activityId1, activityId2) => {
    try {
        const response = await axiosInstance.post('/activities/compare', {
            activity_id1: activityId1,
            activity_id2: activityId2
        });
        return response.data;
    } catch (error) {
        console.error('Error in compareActivities:', error);
        throw error;
    }
};

// Activity types constant
export const ACTIVITY_TYPES = {
    ADVENTURE: 'AdventureActivity',
    CULTURAL: 'CulturalActivity',
    NATURE: 'NatureActivity'
};

// Difficulty levels constant
export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MODERATE: 'Moderate',
    DIFFICULT: 'Difficult',
    EXPERT: 'Expert'
};