import axios from 'axios';
import { API_URL } from './api';

// Generate or retrieve persistent guest ID
export const getGuestId = () => {
  let guestId = localStorage.getItem('genz_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('genz_guest_id', guestId);
  }
  return guestId;
};

// Headers with either JWT Auth token or Guest ID
export const getCartHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'x-guest-id': getGuestId(),
  };
  if (token && token !== 'undefined' && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const addToCartAPI = async (cartItem) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, cartItem, {
      headers: getCartHeaders(),
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend addToCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};

export const updateCartAPI = async (cartItem) => {
  try {
    const response = await axios.put(`${API_URL}/cart/update`, cartItem, {
      headers: getCartHeaders(),
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend updateCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};

export const removeFromCartAPI = async (cartItem) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/remove`, {
      headers: getCartHeaders(),
      data: cartItem,
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend removeFromCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};

export const fetchCartAPI = async (userId = null) => {
  try {
    const url = userId ? `${API_URL}/cart/${userId}` : `${API_URL}/cart`;
    const response = await axios.get(url, {
      headers: getCartHeaders(),
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend fetchCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};

export const clearCartAPI = async () => {
  try {
    const response = await axios.post(`${API_URL}/cart/clear`, {}, {
      headers: getCartHeaders(),
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend clearCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};

export const syncCartAPI = async (items) => {
  try {
    if (!Array.isArray(items) || items.length === 0) return null;
    const response = await axios.post(`${API_URL}/cart/sync`, { items }, {
      headers: getCartHeaders(),
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend syncCartAPI warning:', error.response?.data?.message || error.message);
    return null;
  }
};
