import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me')
};

// Loans API
export const loansAPI = {
    create: (data) => api.post('/loans', data),
    getMyLoans: () => api.get('/loans/my-loans'),
    getAll: (status = 'all') => api.get(`/loans?status=${status}`),
    getById: (id) => api.get(`/loans/${id}`),
    updateStatus: (id, data) => api.patch(`/loans/${id}/status`, data)
};

// Payments API
export const paymentsAPI = {
    create: (data) => api.post('/payments', data),
    getMyPayments: () => api.get('/payments/my-payments'),
    getAll: () => api.get('/payments')
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/users'),
    updateProfile: (data) => api.put('/users/profile', data)
};

// Stats API
export const statsAPI = {
    getUserStats: () => api.get('/stats/user'),
    getAdminStats: () => api.get('/stats/admin')
};

export default api;
