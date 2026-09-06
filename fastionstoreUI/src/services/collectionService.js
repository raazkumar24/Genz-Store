import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const DEFAULT_COLLECTIONS = [
  {
    _id: "default-1",
    name: "Oversized Tees",
    slug: "oversized-tees",
    subtitle: "Relaxed Fit",
    image: "/models/model1.png",
    link: "/collections/oversized-tees",
    bgColor: "bg-[#e0f2fe]",
    colSpan: "md:col-span-4",
    height: "h-[350px] md:h-[500px]",
    order: 1
  },
  {
    _id: "default-2",
    name: "Hoodies",
    slug: "hoodies",
    subtitle: "Cozy Essentials",
    image: "/models/model3.png",
    link: "/collections/hoodies",
    bgColor: "bg-[#ffedd5]",
    colSpan: "md:col-span-4",
    height: "h-[350px] md:h-[500px]",
    order: 2
  },
  {
    _id: "default-3",
    name: "Cargos",
    slug: "cargos",
    subtitle: "Relaxed Fit Cargos",
    image: "/collections/baggy_pants.png",
    link: "/collections/cargos",
    bgColor: "bg-[#f1f5f9]",
    colSpan: "md:col-span-8",
    height: "h-[350px] md:h-[500px]",
    order: 3
  },
  {
    _id: "default-4",
    name: "Menswear",
    slug: "men",
    subtitle: "Modern Tailoring",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
    link: "/collections/men",
    bgColor: "bg-[#f3e8ff]",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
    order: 4
  },
  {
    _id: "default-5",
    name: "Womenswear",
    slug: "women",
    subtitle: "The New Elegance",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
    link: "/collections/women",
    bgColor: "bg-[#ffe4e6]",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
    order: 5
  }
];

export const fetchAllCollections = async () => {
  try {
    const response = await axios.get(`${API_URL}/collections`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch collections from backend, using default collections fallback:", error.message);
    return DEFAULT_COLLECTIONS;
  }
};

export const createCollection = async (collectionData) => {
  const isFormData = collectionData instanceof FormData;
  const response = await axios.post(`${API_URL}/collections/add`, collectionData, {
    headers: {
      ...getAuthHeaders(),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });
  return response.data;
};

export const updateCollection = async (id, collectionData) => {
  const isFormData = collectionData instanceof FormData;
  const response = await axios.put(`${API_URL}/collections/${id}`, collectionData, {
    headers: {
      ...getAuthHeaders(),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });
  return response.data;
};

export const deleteCollection = async (id) => {
  const response = await axios.delete(`${API_URL}/collections/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const resetDefaultCollections = async () => {
  const response = await axios.post(`${API_URL}/collections/reset`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
