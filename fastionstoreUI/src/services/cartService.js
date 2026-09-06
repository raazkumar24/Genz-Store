import axios from 'axios';
import { API_URL } from './api';

// Auth headers for cart operations
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const addToCartAPI = async (cartItem) => {
  const token = localStorage.getItem('token');
  if (!token) return; // Only save to backend if user is logged in
  
  const response = await axios.post(`${API_URL}/cart/add`, cartItem, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateCartAPI = async (cartItem) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  const response = await axios.put(`${API_URL}/cart/update`, cartItem, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const removeFromCartAPI = async (cartItem) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  const response = await axios.delete(`${API_URL}/cart/remove`, {
    headers: getAuthHeaders(),
    data: cartItem,
  });
  return response.data;
};

export const fetchCartAPI = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const response = await axios.get(`${API_URL}/cart/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
