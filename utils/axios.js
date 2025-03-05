import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://10.0.2.2:8081',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async config => {
  config.headers['auth-token'] = await AsyncStorage.getItem('authToken');
  console.log(config);
  return config;
});

axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (err.response && err.response.status === 401) {
      setLoggedIn(false);
      loadLoginDetails();
    }
    return Promise.reject(err);
  },
);

  export default axiosInstance;