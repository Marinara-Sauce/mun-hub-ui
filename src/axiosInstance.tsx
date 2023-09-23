import axios from 'axios';
import { useCookies } from 'react-cookie';

const token = document.cookie.split('; ').find((row) => row.startsWith('token'))?.split("=")[1];

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Authorization': `Bearer: ${token}`,
        'Content-Type': 'application/json'
    },
});

export function updateToken(token: string) {
    console.log("new token: " + token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function hasToken() {
    const token = axiosInstance.defaults.headers.common['Authorization'];
  
    // Check if the token exists and is not empty
    return !!token;
};

export default axiosInstance;