// pages/api/ai/ai.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // AI queries might take longer
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('AI API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// AI API FUNCTIONS
// ============================================

export const aiQuery = async (question) => {
    try {
        const response = await axiosInstance.post('/ai/ai-query', {
            question: question
        });
        return response.data;
    } catch (error) {
        console.error('Error in aiQuery:', error);
        throw error;
    }
};

export const testGemini = async () => {
    try {
        const response = await axiosInstance.get('/ai/test');
        return response.data;
    } catch (error) {
        console.error('Error in testGemini:', error);
        throw error;
    }
};

// Helper to parse SPARQL results
export const parseSparqlValue = (field) => {
    if (!field) return null;
    if (typeof field === 'object' && 'value' in field) {
        return field.value;
    }
    return field;
};

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
