import axios from 'axios';

// Environment variable se backend API ka base URL read karte hain.
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
    data: cartItem, // axios delete requires payload in data
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
