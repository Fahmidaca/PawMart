// API service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Simple in-memory cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests with caching
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const method = options.method || 'GET';
  const cacheKey = `${method}:${url}`;

  // Check cache for GET requests
  if (method === 'GET') {
    const cached = apiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Add timeout to prevent long waits
    signal: AbortSignal.timeout(10000), // 10 second timeout
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Cache successful GET responses
    if (method === 'GET') {
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
  getProfile: () => 
    apiRequest('/auth/me'),
  
  updateProfile: (userData) => 
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Services API
export const servicesAPI = {
  getAll: () => 
    apiRequest('/services'),
  
  getById: (id) => 
    apiRequest(`/services/${id}`),
  
  create: (serviceData) => 
    apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  
  update: (id, serviceData) => 
    apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  
  delete: (id) => 
    apiRequest(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// Listings API
export const listingsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/listings?${queryString}` : '/listings';
    return apiRequest(endpoint);
  },

  getById: (id) =>
    apiRequest(`/listings/${id}`),

  create: (listingData) =>
    apiRequest('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    }),

  update: (id, listingData) =>
    apiRequest(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    }),

  delete: (id) =>
    apiRequest(`/listings/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  getAll: () => 
    apiRequest('/orders'),
  
  getById: (id) => 
    apiRequest(`/orders/${id}`),
  
  create: (orderData) => 
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  update: (id, orderData) => 
    apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),
  
  delete: (id) => 
    apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthCheck = () => 
  apiRequest('/health');

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Get current auth token
export const getToken = () => getAuthToken();

export default {
  authAPI,
  servicesAPI,
  listingsAPI,
  ordersAPI,
  healthCheck,
  setAuthToken,
  getToken,
};