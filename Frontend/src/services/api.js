import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const studentService = {
    register: (data) => api.post('/students/register', data),
    getAll: () => api.get('/students/all'),
    getById: (id) => api.get(`/students/${id}`),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    search: (keyword) => api.get(`/students/search?keyword=${keyword}`),
};

export const courseService = {
    add: (data) => api.post('/courses/add', data),
    getAll: () => api.get('/courses/all'),
    getById: (id) => api.get(`/courses/id/${id}`),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
    search: (keyword) => api.get(`/courses/search?keyword=${keyword}`),
};

export const bookingService = {
    book: (data) => api.post('/enrollments/enroll', data),
    cancel: (id) => api.post(`/enrollments/cancel/${id}`),
    withdraw: (id) => api.delete(`/enrollments/${id}`),
    getAll: () => api.get('/enrollments/all'),
    getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
    getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`),
    getStats: (courseId) => api.get(`/enrollments/stats/${courseId}`),
    update: (id, data) => api.put(`/enrollments/${id}`, data),
};
