// pages/api/feedback.js
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

// Map backend fields to frontend fields
const mapToFrontendFields = (backendData) => {
    if (!backendData) return null;
    return {
        id: backendData.id || backendData.feedback_id,
        activity_uri: backendData.activity_uri || '',
        user_name: backendData.user_name || '',
        rating: backendData.rating || 0,
        comment: backendData.comment || '',
        created_at: backendData.created_at || new Date().toISOString(),
        updated_at: backendData.updated_at || new Date().toISOString(),
    };
};

// GET all feedbacks with filters
export const getAllFeedbacks = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Add all parameters, using backend field names
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);
        if (params.min_rating) queryParams.append('min_rating', params.min_rating);
        if (params.max_rating) queryParams.append('max_rating', params.max_rating);
        if (params.user_name) queryParams.append('user_name', params.user_name);

        const url = `/feedback/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('Fetching from:', url);

        const response = await axiosInstance.get(url);
        console.log('Response:', response.data);

        // Handle array response
        if (Array.isArray(response.data)) {
            return {
                feedbacks: response.data.map(fb => mapToFrontendFields(fb)),
                pagination: {
                    total: response.data.length,
                    limit: params.limit || 10,
                    offset: params.offset || 0,
                    has_more: false
                }
            };
        }

        // Handle object response with feedbacks
        if (response.data.feedbacks) {
            return {
                feedbacks: response.data.feedbacks.map(fb => mapToFrontendFields(fb)),
                pagination: response.data.pagination || {
                    total: response.data.feedbacks.length,
                    limit: params.limit || 10,
                    offset: params.offset || 0,
                    has_more: false
                }
            };
        }

        return {
            feedbacks: [],
            pagination: {
                total: 0,
                limit: params.limit || 10,
                offset: params.offset || 0,
                has_more: false
            }
        };
    } catch (error) {
        console.error('Error in getAllFeedbacks:', error);
        throw error;
    }
};

// GET feedback by ID
export const getFeedbackById = async (feedbackId) => {
    try {
        const response = await axiosInstance.get(`/feedback/${feedbackId}`);
        return mapToFrontendFields(response.data);
    } catch (error) {
        console.error('Error in getFeedbackById:', error);
        throw error;
    }
};

// GET feedback by activity URI - FIXED to handle correct response structure
export const getActivityFeedback = async (activityUri) => {
    try {
        // Encode the URI properly for the URL path
        const encodedUri = encodeURIComponent(activityUri);
        const url = `/feedback/activity/${encodedUri}`;

        console.log('Fetching activity feedback from:', url);

        const response = await axiosInstance.get(url);

        console.log('Activity feedback response:', response.data);

        // Backend returns { activity_uri, feedbacks, statistics }
        const data = response.data;

        // Transform the response to match what frontend expects
        return {
            activity_uri: data.activity_uri,
            feedbacks: Array.isArray(data.feedbacks) ? data.feedbacks.map(fb => mapToFrontendFields(fb)) : [],
            total_reviews: data.feedbacks ? data.feedbacks.length : 0,
            average_rating: data.statistics?.average_rating || 0,
            rating_distribution: data.statistics?.rating_distribution || {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            },
            feedback_summary: data.statistics?.summary || null,
            recent_reviews: data.feedbacks ? data.feedbacks.slice(0, 5).map(fb => ({
                user_name: fb.user_name,
                rating: fb.rating,
                comment: fb.comment,
                created_at: fb.created_at
            })) : []
        };
    } catch (error) {
        console.error('Error in getActivityFeedback:', error);
        throw error;
    }
};

// POST create feedback
export const submitFeedback = async (feedbackData) => {
    try {
        const payload = {
            activity_uri: feedbackData.activity_uri,
            user_name: feedbackData.user_name,
            rating: parseInt(feedbackData.rating),
            comment: feedbackData.comment
        };

        console.log('Submitting feedback:', payload);
        const response = await axiosInstance.post('/feedback/', payload);
        return mapToFrontendFields(response.data);
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        throw error;
    }
};

// PUT update feedback
export const updateFeedback = async (feedbackId, feedbackData) => {
    try {
        const payload = {
            activity_uri: feedbackData.activity_uri,
            user_name: feedbackData.user_name,
            rating: parseInt(feedbackData.rating),
            comment: feedbackData.comment
        };

        console.log('Updating feedback:', payload);
        const response = await axiosInstance.put(`/feedback/${feedbackId}`, payload);
        return mapToFrontendFields(response.data);
    } catch (error) {
        console.error('Error in updateFeedback:', error);
        throw error;
    }
};

// DELETE feedback
export const deleteFeedback = async (feedbackId) => {
    try {
        const response = await axiosInstance.delete(`/feedback/${feedbackId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteFeedback:', error);
        throw error;
    }
};

export default axiosInstance;
