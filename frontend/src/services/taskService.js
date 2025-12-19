import api from './api';

export const taskService = {
    createTask: (taskData) => api.post('/tasks', taskData),
    getTasks: (params) => api.get('/tasks', { params }),
    getTask: (id) => api.get(`/tasks/${id}`),
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    completeTask: (id) => api.put(`/tasks/${id}/complete`),
    getDashboardStats: () => api.get('/tasks/dashboard/stats')
};