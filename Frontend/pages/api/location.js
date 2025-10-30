// pages/api/locations/location.js

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
    const locationId = frontendData.id || `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const location_id = frontendData.uri_id || `Location_${Date.now()}`;

    const baseData = {
        location_id: location_id,
        locationId: locationId,
        locationName: frontendData.name || '',
        latitude: frontendData.latitude ? parseFloat(frontendData.latitude) : 0,
        longitude: frontendData.longitude ? parseFloat(frontendData.longitude) : 0,
        address: frontendData.address || '',
        locationDescription: frontendData.description || '',
    };

    // City-specific fields
    if (frontendData.type === 'City') {
        baseData.population = frontendData.population ? parseInt(frontendData.population) : 0;
        baseData.postalCode = frontendData.postalCode || '';
        baseData.touristAttractions = frontendData.touristAttractions || '';
    }

    // NaturalSite-specific fields
    if (frontendData.type === 'NaturalSite') {
        baseData.protectedStatus = Boolean(frontendData.protectedStatus);
        baseData.biodiversityIndex = frontendData.biodiversityIndex ? parseFloat(frontendData.biodiversityIndex) : 0;
        baseData.areaSizeHectares = frontendData.areaSizeHectares ? parseFloat(frontendData.areaSizeHectares) : 0;
        baseData.entryFee = frontendData.entryFee ? parseFloat(frontendData.entryFee) : 0;
    }

    // Region-specific fields
    if (frontendData.type === 'Region') {
        baseData.climateType = frontendData.climateType || '';
        baseData.regionArea = frontendData.regionArea ? parseFloat(frontendData.regionArea) : 0;
        baseData.mainAttractions = frontendData.mainAttractions || '';
    }

    return baseData;
};

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData, type = null) => {
    if (!backendData) return null;

    // Extract URI ID properly from the location field
    let uriId = backendData.uri_id || '';
    if (!uriId && backendData.location) {
        // Extract the ID from the full URI (e.g., "http://example.org/eco#City_Tunis" -> "City_Tunis")
        const parts = backendData.location.split('#');
        if (parts.length > 1) {
            uriId = parts[1];
        } else {
            // Fallback: try splitting by /
            const pathParts = backendData.location.split('/');
            uriId = pathParts[pathParts.length - 1];
        }
    }

    const baseData = {
        id: backendData.locationId || backendData.locationid,
        uri_id: uriId,
        type: type || 'City',
        name: backendData.locationName || backendData.locationname || '',
        latitude: parseFloat(backendData.latitude) || 0,
        longitude: parseFloat(backendData.longitude) || 0,
        address: backendData.address || '',
        description: backendData.locationDescription || backendData.locationdescription || '',
    };

    // City-specific fields
    if (type === 'City' || backendData.population !== undefined) {
        baseData.population = parseInt(backendData.population) || 0;
        baseData.postalCode = backendData.postalCode || backendData.postalcode || '';
        baseData.touristAttractions = backendData.touristAttractions || backendData.touristattractions || '';
        baseData.type = 'City';
    }

    // NaturalSite-specific fields
    if (type === 'NaturalSite' || backendData.protectedStatus !== undefined) {
        baseData.protectedStatus = Boolean(backendData.protectedStatus);
        baseData.biodiversityIndex = parseFloat(backendData.biodiversityIndex) || 0;
        baseData.areaSizeHectares = parseFloat(backendData.areaSizeHectares) || 0;
        baseData.entryFee = parseFloat(backendData.entryFee) || 0;
        baseData.type = 'NaturalSite';
    }

    // Region-specific fields
    if (type === 'Region' || backendData.climateType !== undefined) {
        baseData.climateType = backendData.climateType || backendData.climatetype || '';
        baseData.regionArea = parseFloat(backendData.regionArea) || 0;
        baseData.mainAttractions = backendData.mainAttractions || backendData.mainattractions || '';
        baseData.type = 'Region';
    }

    return baseData;
};

// Helper function to extract locations from backend response
const extractLocations = (response, type = null) => {
    if (response.data && Array.isArray(response.data.locations)) {
        return response.data.locations;
    }
    if (response.data && Array.isArray(response.data.cities)) {
        return response.data.cities;
    }
    if (response.data && Array.isArray(response.data.natural_sites)) {
        return response.data.natural_sites;
    }
    if (response.data && Array.isArray(response.data.regions)) {
        return response.data.regions;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && response.data.results) {
        return response.data.results;
    }
    return [];
};

export const getAllLocations = async (locationType = null) => {
    try {
        const url = locationType ? `/locations/?location_type=${locationType}` : '/locations/';
        const response = await axiosInstance.get(url);
        const backendLocations = extractLocations(response);
        return backendLocations.map(loc => mapToFrontendFields(loc, locationType)).filter(loc => loc !== null);
    } catch (error) {
        console.error('Error in getAllLocations:', error);
        throw error;
    }
};

export const getCities = async () => {
    try {
        const response = await axiosInstance.get('/locations/cities');
        const backendLocations = extractLocations(response);
        return backendLocations.map(loc => mapToFrontendFields(loc, 'City')).filter(loc => loc !== null);
    } catch (error) {
        console.error('Error in getCities:', error);
        throw error;
    }
};

export const getNaturalSites = async () => {
    try {
        const response = await axiosInstance.get('/locations/natural-sites');
        const backendLocations = extractLocations(response);
        return backendLocations.map(loc => mapToFrontendFields(loc, 'NaturalSite')).filter(loc => loc !== null);
    } catch (error) {
        console.error('Error in getNaturalSites:', error);
        throw error;
    }
};

export const getRegions = async () => {
    try {
        const response = await axiosInstance.get('/locations/regions');
        const backendLocations = extractLocations(response);
        return backendLocations.map(loc => mapToFrontendFields(loc, 'Region')).filter(loc => loc !== null);
    } catch (error) {
        console.error('Error in getRegions:', error);
        throw error;
    }
};

export const getLocationById = async (id, type) => {
    try {
        const endpoint = type === 'City' ? `/locations/city/${id}` :
            type === 'NaturalSite' ? `/locations/natural-site/${id}` :
                type === 'Region' ? `/locations/region/${id}` : `/locations/${id}`;

        const response = await axiosInstance.get(endpoint);

        // Handle different response structures
        let locationData;
        if (response.data.city) locationData = response.data.city;
        else if (response.data.natural_site) locationData = response.data.natural_site;
        else if (response.data.region) locationData = response.data.region;
        else locationData = response.data;

        return mapToFrontendFields({...locationData, uri_id: id}, type);
    } catch (error) {
        console.error('Error in getLocationById:', error);
        throw error;
    }
};

export const createCity = async (cityData) => {
    try {
        const backendData = mapToBackendFields(cityData);
        console.log('Creating city with data:', backendData);
        const response = await axiosInstance.post('/locations/city', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createCity:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const createNaturalSite = async (siteData) => {
    try {
        const backendData = mapToBackendFields(siteData);
        console.log('Creating natural site with data:', backendData);
        const response = await axiosInstance.post('/locations/natural-site', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createNaturalSite:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const createRegion = async (regionData) => {
    try {
        const backendData = mapToBackendFields(regionData);
        console.log('Creating region with data:', backendData);
        const response = await axiosInstance.post('/locations/region', backendData);
        return response.data;
    } catch (error) {
        console.error('Error in createRegion:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateCity = async (id, cityData) => {
    try {
        const backendData = mapToBackendFields(cityData);
        // For update, we only send the fields that are actually provided
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && !['location_id', 'locationId'].includes(key)) {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating city with data:', updateData);
        const response = await axiosInstance.put(`/locations/city/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateCity:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateNaturalSite = async (id, siteData) => {
    try {
        const backendData = mapToBackendFields(siteData);
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && !['location_id', 'locationId'].includes(key)) {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating natural site with data:', updateData);
        const response = await axiosInstance.put(`/locations/natural-site/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateNaturalSite:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateRegion = async (id, regionData) => {
    try {
        const backendData = mapToBackendFields(regionData);
        const updateData = {};
        Object.keys(backendData).forEach(key => {
            if (backendData[key] !== undefined && backendData[key] !== null && !['location_id', 'locationId'].includes(key)) {
                updateData[key] = backendData[key];
            }
        });

        console.log('Updating region with data:', updateData);
        const response = await axiosInstance.put(`/locations/region/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateRegion:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteLocation = async (id) => {
    try {
        const response = await axiosInstance.delete(`/locations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteLocation:', error);
        throw error;
    }
};

export const findNearbyLocations = async (latitude, longitude, radiusKm = 50, locationType = null) => {
    try {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radius_km: radiusKm.toString()
        });
        if (locationType) params.append('location_type', locationType);

        const response = await axiosInstance.get(`/locations/nearby?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error in findNearbyLocations:', error);
        throw error;
    }
};

// Location types constant
export const LOCATION_TYPES = {
    CITY: 'City',
    NATURAL_SITE: 'NaturalSite',
    REGION: 'Region'
};

// Climate types constant
export const CLIMATE_TYPES = {
    TROPICAL: 'Tropical',
    TEMPERATE: 'Temperate',
    ARID: 'Arid',
    CONTINENTAL: 'Continental',
    POLAR: 'Polar',
    MEDITERRANEAN: 'Mediterranean'
};