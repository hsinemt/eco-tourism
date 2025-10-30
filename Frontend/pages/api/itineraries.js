// pages/api/itineraries/itineraries.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Longer timeout for generation
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Itineraries API Error:', error);
        return Promise.reject(error);
    }
);

// POST generate 3-day itinerary - ONLY THIS ENDPOINT
export const generateThreeDayItinerary = async (
    startDate,
    difficulty = 'Moderate',
    budgetPerNight = null,
    preferredSeason = null
) => {
    try {
        // Build form data for POST request
        const params = {
            start_date: startDate,
            difficulty: difficulty,
        };

        if (budgetPerNight) {
            params.budget_per_night = budgetPerNight;
        }
        if (preferredSeason) {
            params.preferred_season = preferredSeason;
        }

        console.log('Sending POST request with params:', params);

        const response = await axiosInstance.post('/itineraries/generate-3day-itinerary', null, {
            params: params
        });

        console.log('Generate itinerary response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in generateThreeDayItinerary:', error);
        throw error;
    }
};

export default axiosInstance;
