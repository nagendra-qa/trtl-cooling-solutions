import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Company API
export const companyAPI = {
  getDetails: () => api.get('/company'),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Camps API
export const campsAPI = {
  getAll: (customerId) => api.get('/camps', { params: { customerId } }),
  getById: (id) => api.get(`/camps/${id}`),
  create: (data) => api.post('/camps', data),
  update: (id, data) => api.put(`/camps/${id}`, data),
  delete: (id) => api.delete(`/camps/${id}`),
};

// Work Orders API
export const workOrdersAPI = {
  getAll: (params) => api.get('/workorders', { params }),
  getById: (id) => api.get(`/workorders/${id}`),
  create: (formData) => api.post('/workorders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/workorders/${id}`, data),
  delete: (id) => api.delete(`/workorders/${id}`),
};

// Bills API
export const billsAPI = {
  getAll: (params) => api.get('/bills', { params }),
  getById: (id) => api.get(`/bills/${id}`),
  getNextInvoiceNumber: () => api.get('/bills/next-invoice-number'),
  create: (data) => api.post('/bills', data),
  update: (id, data) => api.put(`/bills/${id}`, data),
  delete: (id) => api.delete(`/bills/${id}`),
  downloadPDF: (id) => api.get(`/bills/${id}/pdf`, { responseType: 'blob' }),
};
