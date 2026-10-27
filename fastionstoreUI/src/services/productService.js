import axios from 'axios';
import { API_URL } from './api';

// Attach JWT token from localStorage for protected admin APIs
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const fetchAllProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const fetchPopularColors = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/popular-colors`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch popular colors:", error);
    return null;
  }
};

export const getProductByIdAPI = async (productId) => {
  const response = await axios.get(`${API_URL}/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products/add`, productData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API_URL}/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
