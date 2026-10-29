import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: (userId) => api.get(`/auth/profile/${userId}`),
};

// Bikes API
export const bikesAPI = {
    getAll: (params) => api.get('/bikes', { params }),
    getById: (id) => api.get(`/bikes/${id}`),
    create: (data) => api.post('/bikes', data),
    update: (id, data) => api.put(`/bikes/${id}`, data),
    delete: (id) => api.delete(`/bikes/${id}`),
    getFeatured: () => api.get('/bikes/featured'),
    getOwnerBikes: (ownerId) => api.get(`/bikes/owner/${ownerId}`),
};

// Availability API
export const availabilityAPI = {
    createSlot: (data) => api.post('/availability/slots', data),
    getBikeSlots: (bikeId) => api.get(`/availability/bike/${bikeId}`),
    deleteSlot: (slotId) => api.delete(`/availability/slots/${slotId}`),
};

// Bookings API
export const bookingsAPI = {
    create: (data) => api.post('/bookings', data),
    getById: (id) => api.get(`/bookings/${id}`),
    getRenterBookings: (renterId) => api.get(`/bookings/renter/${renterId}`),
    getOwnerBookings: (ownerId) => api.get(`/bookings/owner/${ownerId}`),
    getPendingBookings: (ownerId) => api.get(`/bookings/owner/${ownerId}/pending`),
    confirm: (id) => api.put(`/bookings/${id}/confirm`),
    cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
    complete: (id) => api.put(`/bookings/${id}/complete`),
};

// Reviews API
export const reviewsAPI = {
    create: (data) => api.post('/reviews', data),
    getBikeReviews: (bikeId) => api.get(`/reviews/bike/${bikeId}`),
    getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

// Admin API
export const adminAPI = {
    getAllUsers: () => api.get('/admin/users'),
    getPendingBikes: () => api.get('/admin/bikes/pending'),
    approveBike: (id) => api.put(`/admin/bikes/${id}/approve`),
    rejectBike: (id) => api.put(`/admin/bikes/${id}/reject`),
    toggleUserBan: (id) => api.put(`/admin/users/${id}/ban`),
    getAnalytics: () => api.get('/admin/analytics'),
};

// Payment API
export const paymentAPI = {
    simulate: (data) => api.post('/payments/simulate', data),
};

export default api;
