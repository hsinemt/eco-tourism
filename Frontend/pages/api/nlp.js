// pages/api/nlp/nlp.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('NLP API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Helper function to parse SPARQL result format
const parseSparqlResult = (result) => {
    const parsed = {};

    for (const [key, valueObj] of Object.entries(result)) {
        if (valueObj && typeof valueObj === 'object' && 'value' in valueObj) {
            // Extract the actual value from SPARQL format
            parsed[key] = valueObj.value;
        } else {
            parsed[key] = valueObj;
        }
    }

    return parsed;
};

export const queryNLP = async (question, useAdvancedNLP = false) => {
    try {
        const response = await axiosInstance.post('/nlp/query', {
            question: question,
            use_advanced_nlp: useAdvancedNLP
        });

        // Parse the results to extract values from SPARQL format
        if (response.data && response.data.results && Array.isArray(response.data.results)) {
            response.data.results = response.data.results.map(parseSparqlResult);
        }

        return response.data;
    } catch (error) {
        console.error('Error in queryNLP:', error);
        throw error;
    }
};

export const analyzeQuestion = async (question) => {
    try {
        const response = await axiosInstance.get('/nlp/analyze', {
            params: { question }
        });
        return response.data;
    } catch (error) {
        console.error('Error in analyzeQuestion:', error);
        throw error;
    }
};
