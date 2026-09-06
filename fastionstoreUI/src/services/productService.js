import axios from 'axios';
import { API_URL } from './api';

// Admin APIs ke liye token localStorage se bhejte hain.
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const fetchAllProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
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
