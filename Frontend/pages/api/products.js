// pages/api/products/products.js
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
        console.error('Products API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// PRODUCTS API FUNCTIONS
// ============================================

export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/products/');
        return response.data;
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        throw error;
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await axiosInstance.get(`/sustainability/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getProductById:', error);
        throw error;
    }
};

export const searchProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.organic_only) params.append('organic_only', 'true');
        if (filters.limit) params.append('limit', filters.limit);

        const response = await axiosInstance.get(`/sustainability/products/?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchProducts:', error);
        throw error;
    }
};

export const getOrganicProducts = async (limit = 20) => {
    try {
        const response = await axiosInstance.get(`/sustainability/products/filter/organic?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error in getOrganicProducts:', error);
        throw error;
    }
};

export const getHandmadeProducts = async (limit = 20) => {
    try {
        const response = await axiosInstance.get(`/sustainability/products/filter/handmade?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error in getHandmadeProducts:', error);
        throw error;
    }
};

export const getFairTradeProducts = async (limit = 20) => {
    try {
        const response = await axiosInstance.get(`/sustainability/products/filter/fair-trade?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error in getFairTradeProducts:', error);
        throw error;
    }
};

export const getCheapestProducts = async () => {
    try {
        const response = await axiosInstance.get('/sustainability/products/stats/cheapest');
        return response.data;
    } catch (error) {
        console.error('Error in getCheapestProducts:', error);
        throw error;
    }
};

export const getLowStockProducts = async (threshold = 50) => {
    try {
        const response = await axiosInstance.get(`/sustainability/products/stats/low-stock?threshold=${threshold}`);
        return response.data;
    } catch (error) {
        console.error('Error in getLowStockProducts:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/sustainability/products/', productData);
        return response.data;
    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
};

export const updateProduct = async (productId, updateData) => {
    try {
        const response = await axiosInstance.put(`/sustainability/products/${productId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error in updateProduct:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/sustainability/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        throw error;
    }
};
