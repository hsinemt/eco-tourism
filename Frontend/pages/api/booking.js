// pages/api/booking.js

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

// Map frontend field names to backend field names (to match Backend BookingCreate schema)
const mapToBackendFields = (frontendData) => {
    // Normalize booking_date to full ISO datetime if only a date is provided
    const normalizeDateTime = (value) => {
        if (!value) return new Date().toISOString();
        // If value looks like YYYY-MM-DD (no 'T'), append midnight time
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return `${value}T00:00:00`;
        }
        return value;
    };

    // Accept `tourist_id` directly, or try to extract ID from a full URI if provided
    const extractTouristId = (val) => {
        if (!val) return undefined;
        // If full URI like http://...#Tourist_John, take part after '#'
        if (val.includes('#')) {
            return val.split('#').pop();
        }
        return val;
    };

    return {
        booking_id: frontendData.booking_id || undefined,
        booking_date: normalizeDateTime(frontendData.booking_date),
        booking_status: frontendData.booking_status || 'confirmed',
        check_out_date: frontendData.check_out_date || undefined,
        payment_method: frontendData.payment_method || undefined,
        confirmation_code: frontendData.confirmation_code || undefined,
        special_requests: frontendData.special_requests || undefined,
        tourist_id: extractTouristId(frontendData.tourist_id || frontendData.tourist || frontendData.tourist_uri),
        accommodation_id: frontendData.accommodation_id || undefined,
        activity_id: frontendData.activity_id || undefined,
    };
};

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData) => {
    if (!backendData) return null;
    return {
        booking_url: backendData.booking_url,
        booking_id: backendData.booking_id,
        booking_date: backendData.booking_date,
        booking_status: backendData.status,
        confirmation_code: backendData.confirmation_code,
        tourist_id: backendData.tourist ? backendData.tourist.split('_').pop() : '',
        tourist_uri: backendData.tourist
    };
};

// Helper function to extract bookings from backend response
const extractBookings = (response) => {
    if (response.data && Array.isArray(response.data.bookings)) {
        return response.data.bookings;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    return [];
};

export const getAllBookings = async () => {
    try {
        console.log('Fetching all bookings from:', `${API_BASE_URL}/bookings/all`);
        const response = await axiosInstance.get('/bookings/all');
        console.log('Bookings API response:', response.data);
        const backendBookings = extractBookings(response);
        const mappedBookings = backendBookings.map(booking => mapToFrontendFields(booking));
        console.log('Mapped bookings:', mappedBookings);
        return {
            bookings: mappedBookings,
            count: response.data?.count || mappedBookings.length
        };
    } catch (error) {
        console.error('Error in getAllBookings:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};

export const getBookingById = async (id) => {
    try {
        console.log('Fetching booking by ID:', id);
        const response = await axiosInstance.get(`/bookings/${id}`);
        console.log('Booking by ID response:', response.data);
        return mapToFrontendFields(response.data);
    } catch (error) {
        console.error('Error in getBookingById:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};

export const getBookingsByTourist = async (touristId) => {
    try {
        console.log('Fetching bookings by tourist:', touristId);
        const response = await axiosInstance.get(`/bookings/by-tourist/${touristId}`);
        const backendBookings = extractBookings(response);
        return {
            bookings: backendBookings.map(booking => mapToFrontendFields(booking)),
            count: response.data?.count || backendBookings.length,
            tourist_id: touristId
        };
    } catch (error) {
        console.error('Error in getBookingsByTourist:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const backendData = mapToBackendFields(bookingData);
        console.log('Creating booking with data:', backendData);
        const response = await axiosInstance.post('/bookings/create', backendData);
        console.log('Create booking response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in createBooking:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const updateBooking = async (id, bookingData) => {
    try {
        const backendData = {
            booking_date: bookingData.booking_date,
            status: bookingData.booking_status
        };

        // Remove null/undefined values
        Object.keys(backendData).forEach(key => {
            if (backendData[key] === null || backendData[key] === undefined) {
                delete backendData[key];
            }
        });

        console.log('Updating booking with data:', backendData);
        const response = await axiosInstance.put(`/bookings/${id}`, backendData);
        console.log('Update booking response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in updateBooking:', error);
        if (error.response?.data) {
            console.error('Backend validation errors:', error.response.data);
        }
        throw error;
    }
};

export const deleteBooking = async (id) => {
    try {
        console.log('Deleting booking:', id);
        const response = await axiosInstance.delete(`/bookings/${id}`);
        console.log('Delete booking response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in deleteBooking:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};

// Booking status constants
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled'
};