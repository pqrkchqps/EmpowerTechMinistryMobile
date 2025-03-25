import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {ErrorContext} from '../components/ErrorContext';
import Modal from 'react-native-modal';
import {Button, Text, View} from 'react-native';

const axiosInstance = axios.create({
  baseURL: 'https://10.0.2.2:8081',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
});

function AxiosComponent({children}) {
  const {error, setError} = useContext(ErrorContext);

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
      setError(err);
      return Promise.reject(err);
    },
  );

  const closeModal = () => {
    setError(null);
  };

  console.log(error?.response?.data?.error);

  return (
    <>
      <Modal isVisible={error}>
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: 50,
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                fontSize: 28,
                margin: 20,
              }}>
              {error?.response?.data?.error}
            </Text>

            <Button
              title="Close"
              onPress={closeModal}
              style={{
                marginBottom: 20,
              }}
            />
          </View>
        </View>
      </Modal>
      {children}
    </>
  );
}
export {AxiosComponent};
export default axiosInstance;