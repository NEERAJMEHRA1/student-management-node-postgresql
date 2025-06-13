import api from './api';

export const register = async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
};

export const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};