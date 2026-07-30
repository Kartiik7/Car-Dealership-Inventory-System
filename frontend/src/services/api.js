import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);

export const register = (userData) => api.post('/auth/register', userData);

export const getCars = () => api.get('/cars');

export const addCar = (carData) => api.post('/cars', carData);

export const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);

export const deleteCar = (id) => api.delete(`/cars/${id}`);

export const purchaseVehicle = (id) => api.post(`/vehicles/${id}/purchase`);

export const restockVehicle = (id, amount) => api.post(`/vehicles/${id}/restock`, { amount });

export default api;
