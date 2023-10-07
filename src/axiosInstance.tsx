import axios from 'axios';

const token = document.cookie.split('; ').find((row) => row.startsWith('token'))?.split("=")[1];

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Authorization': `Bearer: ${token}`,
        'Content-Type': 'application/json'
    },
    withCredentials: (token !== undefined)
});

export function updateToken(token: string) {
    console.log("new token: " + token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosInstance.defaults.withCredentials = (token !== undefined);
    console.log(axiosInstance.defaults);
}

export function hasToken() {
    const token = axiosInstance.defaults.headers.common['Authorization'];
  
    console.log(token)
    // Check if the token exists and is not empty
    return token != 'Bearer undefined';
};

export default axiosInstance;