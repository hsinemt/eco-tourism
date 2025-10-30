// pages/api/transport/transport.js

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

// Map frontend field names to backend field names for Bike
const mapBikeToBackend = (frontendData) => {
    const transportId = frontendData.id || `BIKE-${Date.now()}`;
    return {
        transportId: transportId,
        transportName: frontendData.transportName || '',
        transportType: frontendData.transportType || 'City Bike',
        bikeModel: frontendData.bikeModel || '',
        isElectric: Boolean(frontendData.isElectric),
        batteryRange: frontendData.batteryRange ? parseFloat(frontendData.batteryRange) : 0.0,
        rentalPricePerHour: frontendData.rentalPricePerHour ? parseFloat(frontendData.rentalPricePerHour) : 0,
        pricePerKm: frontendData.pricePerKm ? parseFloat(frontendData.pricePerKm) : 0.0,
        carbonEmissionPerKm: frontendData.carbonEmissionPerKm ? parseFloat(frontendData.carbonEmissionPerKm) : 0.0,
        capacity: frontendData.capacity ? parseInt(frontendData.capacity) : 1,
        availability: Boolean(frontendData.availability),
        operatingHours: frontendData.operatingHours || '24/7',
        averageSpeed: frontendData.averageSpeed ? parseFloat(frontendData.averageSpeed) : 0,
        frameSize: frontendData.frameSize || 'M',
        contactPhone: frontendData.contactPhone || '',
    };
};

// Map frontend field names to backend field names for Electric Vehicle
const mapElectricVehicleToBackend = (frontendData) => {
    const transportId = frontendData.id || `EV-${Date.now()}`;
    return {
        transportId: transportId,
        transportName: frontendData.transportName || '',
        transportType: frontendData.transportType || 'Electric Car',
        vehicleModel: frontendData.vehicleModel || '',
        vehicleBatteryRange: frontendData.vehicleBatteryRange ? parseFloat(frontendData.vehicleBatteryRange) : 0,
        chargingTime: frontendData.chargingTime ? parseInt(frontendData.chargingTime) : 0,
        seatingCapacity: frontendData.seatingCapacity ? parseInt(frontendData.seatingCapacity) : 4,
        dailyRentalPrice: frontendData.dailyRentalPrice ? parseFloat(frontendData.dailyRentalPrice) : 0,
        pricePerKm: frontendData.pricePerKm ? parseFloat(frontendData.pricePerKm) : 0,
        carbonEmissionPerKm: frontendData.carbonEmissionPerKm ? parseFloat(frontendData.carbonEmissionPerKm) : 0.0,
        capacity: frontendData.capacity ? parseInt(frontendData.capacity) : 4,
        availability: Boolean(frontendData.availability),
        hasAirConditioning: Boolean(frontendData.hasAirConditioning),
        operatingHours: frontendData.operatingHours || '24/7',
        averageSpeed: frontendData.averageSpeed ? parseFloat(frontendData.averageSpeed) : 0,
        contactPhone: frontendData.contactPhone || '',
    };
};

// Map frontend field names to backend field names for Public Transport
const mapPublicTransportToBackend = (frontendData) => {
    const transportId = frontendData.id || `PT-${Date.now()}`;
    return {
        transportId: transportId,
        transportName: frontendData.transportName || '',
        transportType: frontendData.transportType || 'Bus',
        lineNumber: frontendData.lineNumber || '',
        routeDescription: frontendData.routeDescription || '',
        ticketPrice: frontendData.ticketPrice ? parseFloat(frontendData.ticketPrice) : 0,
        pricePerKm: frontendData.pricePerKm ? parseFloat(frontendData.pricePerKm) : 0,
        carbonEmissionPerKm: frontendData.carbonEmissionPerKm ? parseFloat(frontendData.carbonEmissionPerKm) : 0,
        capacity: frontendData.capacity ? parseInt(frontendData.capacity) : 50,
        availability: Boolean(frontendData.availability),
        frequencyMinutes: frontendData.frequencyMinutes ? parseInt(frontendData.frequencyMinutes) : 30,
        accessibleForDisabled: Boolean(frontendData.accessibleForDisabled),
        operatingHours: frontendData.operatingHours || '06:00-23:00',
        averageSpeed: frontendData.averageSpeed ? parseFloat(frontendData.averageSpeed) : 0,
        contactPhone: frontendData.contactPhone || '',
    };
};

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData) => {
    if (!backendData) return null;

    return {
        id: backendData.transportId,
        transportName: backendData.transportName || '',
        transportType: backendData.transportType || '',
        pricePerKm: backendData.pricePerKm || 0,
        carbonEmissionPerKm: backendData.carbonEmissionPerKm || 0,
        capacity: backendData.capacity || 0,
        availability: Boolean(backendData.availability),
        operatingHours: backendData.operatingHours || '',
        averageSpeed: backendData.averageSpeed || 0,
        contactPhone: backendData.contactPhone || '',
        // Bike-specific
        bikeModel: backendData.bikeModel || '',
        isElectric: Boolean(backendData.isElectric),
        batteryRange: backendData.batteryRange || 0,
        rentalPricePerHour: backendData.rentalPricePerHour || 0,
        frameSize: backendData.frameSize || '',
        // Electric Vehicle-specific
        vehicleModel: backendData.vehicleModel || '',
        vehicleBatteryRange: backendData.vehicleBatteryRange || 0,
        chargingTime: backendData.chargingTime || 0,
        seatingCapacity: backendData.seatingCapacity || 0,
        dailyRentalPrice: backendData.dailyRentalPrice || 0,
        hasAirConditioning: Boolean(backendData.hasAirConditioning),
        // Public Transport-specific
        lineNumber: backendData.lineNumber || '',
        routeDescription: backendData.routeDescription || '',
        ticketPrice: backendData.ticketPrice || 0,
        frequencyMinutes: backendData.frequencyMinutes || 0,
        accessibleForDisabled: Boolean(backendData.accessibleForDisabled),
        uri: backendData.uri || ''
    };
};

// Helper function to extract transports from backend response
const extractTransports = (response) => {
    if (response.data && Array.isArray(response.data.transports)) {
        return response.data.transports;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllTransports = async (type = null) => {
    try {
        const url = type ? `/transport/?type=${type}` : '/transport/';
        const response = await axiosInstance.get(url);
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in getAllTransports:', error);
        throw error;
    }
};

export const getTransportById = async (id) => {
    try {
        const response = await axiosInstance.get(`/transport/${id}`);
        return mapToFrontendFields(response.data.transport || response.data);
    } catch (error) {
        console.error('Error in getTransportById:', error);
        throw error;
    }
};

export const createBike = async (bikeData) => {
    try {
        const backendData = mapBikeToBackend(bikeData);
        console.log('Sending bike data to backend:', backendData);
        const response = await axiosInstance.post('/transport/bike', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createBike:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const createElectricVehicle = async (evData) => {
    try {
        const backendData = mapElectricVehicleToBackend(evData);
        console.log('Sending electric vehicle data to backend:', backendData);
        const response = await axiosInstance.post('/transport/electric-vehicle', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createElectricVehicle:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const createPublicTransport = async (ptData) => {
    try {
        const backendData = mapPublicTransportToBackend(ptData);
        console.log('Sending public transport data to backend:', backendData);
        const response = await axiosInstance.post('/transport/public-transport', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createPublicTransport:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateTransport = async (id, transportData) => {
    try {
        const updateData = {
            transportName: transportData.transportName,
            availability: transportData.availability,
            pricePerKm: transportData.pricePerKm ? parseFloat(transportData.pricePerKm) : undefined,
            operatingHours: transportData.operatingHours,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        console.log('Updating transport with data:', updateData);
        const response = await axiosInstance.put(`/transport/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateTransport:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteTransport = async (id) => {
    try {
        const response = await axiosInstance.delete(`/transport/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteTransport:', error);
        throw error;
    }
};

export const searchTransports = async (searchTerm) => {
    try {
        const response = await axiosInstance.get(`/transport/search/${searchTerm}`);
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in searchTransports:', error);
        throw error;
    }
};

export const getZeroEmissionTransports = async () => {
    try {
        const response = await axiosInstance.get('/transport/filter/zero-emission');
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in getZeroEmissionTransports:', error);
        throw error;
    }
};

export const getCheapestTransports = async () => {
    try {
        const response = await axiosInstance.get('/transport/stats/cheapest');
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in getCheapestTransports:', error);
        throw error;
    }
};

export const getFastestTransports = async () => {
    try {
        const response = await axiosInstance.get('/transport/stats/fastest');
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in getFastestTransports:', error);
        throw error;
    }
};

export const getEcoScoreRanking = async () => {
    try {
        const response = await axiosInstance.get('/transport/stats/eco-score');
        const backendTransports = extractTransports(response);
        return backendTransports.map(transport => mapToFrontendFields(transport)).filter(transport => transport !== null);
    } catch (error) {
        console.error('Error in getEcoScoreRanking:', error);
        throw error;
    }
};
