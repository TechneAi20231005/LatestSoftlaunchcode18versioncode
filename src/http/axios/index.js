import axios from 'axios';
import {
  REACT_APP_API_REWAMP_BASE_URL,
  REACT_APP_API_URL
} from '../../config/envConfig';

// Create a new Axios instance
const customAxios = axios.create({
  baseURL: REACT_APP_API_REWAMP_BASE_URL
  // timeout: 10000, // Set timeout for requests (in milliseconds)
});

// Add a request interceptor
customAxios.interceptors.request.use(
  function (config) {
    // Set default Authorization header with bearer token
    const accessToken = localStorage.getItem('jwt_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
customAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Handle response error
    return Promise.reject(error);
  }
);

export default customAxios;
