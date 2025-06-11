import axiosInstance from './axiosInstance';

export const getCurrentUser = () => {
    return axiosInstance.get('/auth/profile');
};