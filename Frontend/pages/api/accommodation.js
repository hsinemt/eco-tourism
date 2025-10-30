// pages/api/accommodations/accommodation.js

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
    const accommodationId = frontendData.id || `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        type: frontendData.type || 'EcoLodge',
        accommodationId: accommodationId,
        name: frontendData.name || '',
        description: frontendData.description || '',
        pricePerNight: frontendData.pricePerNight ? parseFloat(frontendData.pricePerNight) : 0,
        numberOfRooms: frontendData.numberOfRooms ? parseInt(frontendData.numberOfRooms) : 1,
        maxGuests: frontendData.maxGuests ? parseInt(frontendData.maxGuests) : 2,
        checkInTime: frontendData.checkInTime || '14:00',
        checkOutTime: frontendData.checkOutTime || '12:00',
        wifiAvailable: Boolean(frontendData.wifiAvailable),
        parkingAvailable: Boolean(frontendData.parkingAvailable),
        accommodationRating: frontendData.accommodationRating ? parseFloat(frontendData.accommodationRating) : 0,
        contactEmail: frontendData.contactEmail || '',
        accommodationPhone: frontendData.accommodationPhone || '',
        ecoCertified: Boolean(frontendData.ecoCertified),
        renewableEnergyPercent: frontendData.renewableEnergyPercent ? parseFloat(frontendData.renewableEnergyPercent) : 0,
        wasteRecyclingRate: frontendData.wasteRecyclingRate ? parseFloat(frontendData.wasteRecyclingRate) : 0,
        organicFoodOffered: Boolean(frontendData.organicFoodOffered),
        waterConservationSystem: Boolean(frontendData.waterConservationSystem),
        familyOwned: Boolean(frontendData.familyOwned),
        traditionalArchitecture: Boolean(frontendData.traditionalArchitecture),
        homeCookedMeals: Boolean(frontendData.homeCookedMeals),
        culturalExperiences: frontendData.culturalExperiences || '',
        starRating: frontendData.starRating ? parseInt(frontendData.starRating) : 3,
        hasSwimmingPool: Boolean(frontendData.hasSwimmingPool),
        hasSpa: Boolean(frontendData.hasSpa),
        hasRestaurant: Boolean(frontendData.hasRestaurant),
        roomService: Boolean(frontendData.roomService)
    };
};

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData) => {
    if (!backendData) return null;

    return {
        id: backendData.accommodationId,
        type: backendData.type,
        name: backendData.name || '',
        description: backendData.description || '',
        pricePerNight: backendData.pricePerNight || 0,
        numberOfRooms: backendData.numberOfRooms || 1,
        maxGuests: backendData.maxGuests || 2,
        checkInTime: backendData.checkInTime || '14:00',
        checkOutTime: backendData.checkOutTime || '12:00',
        wifiAvailable: Boolean(backendData.wifiAvailable),
        parkingAvailable: Boolean(backendData.parkingAvailable),
        accommodationRating: backendData.accommodationRating || 0,
        contactEmail: backendData.contactEmail || '',
        accommodationPhone: backendData.accommodationPhone || '',
        ecoCertified: Boolean(backendData.ecoCertified),
        renewableEnergyPercent: backendData.renewableEnergyPercent || 0,
        wasteRecyclingRate: backendData.wasteRecyclingRate || 0,
        organicFoodOffered: Boolean(backendData.organicFoodOffered),
        waterConservationSystem: Boolean(backendData.waterConservationSystem),
        familyOwned: Boolean(backendData.familyOwned),
        traditionalArchitecture: Boolean(backendData.traditionalArchitecture),
        homeCookedMeals: Boolean(backendData.homeCookedMeals),
        culturalExperiences: backendData.culturalExperiences || '',
        starRating: backendData.starRating || 3,
        hasSwimmingPool: Boolean(backendData.hasSwimmingPool),
        hasSpa: Boolean(backendData.hasSpa),
        hasRestaurant: Boolean(backendData.hasRestaurant),
        roomService: Boolean(backendData.roomService),
        uri: backendData.uri || ''
    };
};

// Helper function to extract accommodations from backend response
const extractAccommodations = (response) => {
    if (response.data && Array.isArray(response.data.accommodations)) {
        return response.data.accommodations;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllAccommodations = async () => {
    try {
        const response = await axiosInstance.get('/accommodations/');
        const backendAccommodations = extractAccommodations(response);
        return backendAccommodations.map(acc => mapToFrontendFields(acc)).filter(acc => acc !== null);
    } catch (error) {
        console.error('Error in getAllAccommodations:', error);
        throw error;
    }
};

export const getAccommodationById = async (id) => {
    try {
        const response = await axiosInstance.get(`/accommodations/${id}`);
        return mapToFrontendFields(response.data.accommodation || response.data);
    } catch (error) {
        console.error('Error in getAccommodationById:', error);
        throw error;
    }
};

export const createAccommodation = async (accommodationData) => {
    try {
        const backendData = mapToBackendFields(accommodationData);
        console.log('Sending data to backend:', backendData);
        const response = await axiosInstance.post('/accommodations/', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createAccommodation:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateAccommodation = async (id, accommodationData) => {
    try {
        const backendData = mapToBackendFields(accommodationData);
        // For update, we only send the fields that are actually provided
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && key !== 'accommodationId') {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating accommodation with data:', updateData);
        const response = await axiosInstance.put(`/accommodations/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateAccommodation:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteAccommodation = async (id) => {
    try {
        const response = await axiosInstance.delete(`/accommodations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteAccommodation:', error);
        throw error;
    }
};

export const searchAccommodations = async (searchTerm) => {
    try {
        const response = await axiosInstance.get(`/accommodations/search/${searchTerm}`);
        const backendAccommodations = extractAccommodations(response);
        return backendAccommodations.map(acc => mapToFrontendFields(acc)).filter(acc => acc !== null);
    } catch (error) {
        console.error('Error in searchAccommodations:', error);
        throw error;
    }
};

export const getTopRatedAccommodations = async () => {
    try {
        const response = await axiosInstance.get('/accommodations/stats/top-rated');
        const backendAccommodations = extractAccommodations(response);
        return backendAccommodations.map(acc => mapToFrontendFields(acc)).filter(acc => acc !== null);
    } catch (error) {
        console.error('Error in getTopRatedAccommodations:', error);
        throw error;
    }
};

export const getCheapestAccommodations = async () => {
    try {
        const response = await axiosInstance.get('/accommodations/stats/cheapest');
        const backendAccommodations = extractAccommodations(response);
        return backendAccommodations.map(acc => mapToFrontendFields(acc)).filter(acc => acc !== null);
    } catch (error) {
        console.error('Error in getCheapestAccommodations:', error);
        throw error;
    }
};