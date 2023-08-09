import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Threads from './components/Threads';
import ThreadDetails from './components/ThreadDetails';
import Contact from './components/Contact';
import About from './components/About';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WithSplashScreen} from './components/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';
const {API_URL} = Config;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';

axios.interceptors.request.use(async config => {
  config.headers['auth-token'] = await AsyncStorage.getItem('authToken');
  return config;
});

// Styled components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const ContactInfo = styled.View`
  margin-top: 20px;
`;

const ContactItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ContactIcon = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const ContactText = styled.Text`
  font-size: 16px;
  color: #555;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 12px;
  align-items: center;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const LinkText = styled.Text`
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
`;

const Stack = createNativeStackNavigator();

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for stored authentication token upon app launch

    const credentialsPromise = Keychain.getGenericPassword();
    credentialsPromise.then(credentials => {
      setEmail(credentials.username);
      setPassword(credentials.password);
    });
  }, []);

  const handleLogin = async () => {
    // Implement login functionality here
    // For demonstration, we'll assume successful login and store the token
    try {
      const response = await axios.post(API_URL + '/api/auth/login', {
        email,
        password,
      });
      const token = response.headers['auth-token'];
      await AsyncStorage.setItem('authToken', token);
      await Keychain.setGenericPassword(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.log('Error while saving authentication token:', error);
    }
  };

  const handleRegister = async () => {
    try {
      console.log(Config);
      console.log(API_URL + '/api/auth/register');
      const response = await axios.post(API_URL + '/api/auth/register', {
        username,
        email,
        password,
      });
      const token = response.headers['auth-token'];
      await AsyncStorage.setItem('authToken', token);
      await Keychain.setGenericPassword(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error('Error while saving authentication token:', error);
      console.log(error);
    }
  };

  const handleLogout = async () => {
    // Remove stored authentication token to log the user out
    try {
      await AsyncStorage.removeItem('authToken');
      await Keychain.resetGenericPassword();
      setLoggedIn(false);
      console.log('logout');
    } catch (error) {
      console.error('Error while removing authentication token:', error);
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
  }, []);
  return (
    <Container>
      {!loggedIn ? (
        <>
          {isRegisterOpen ? (
            <>
              <Title>Register for Empower Tech Ministry</Title>
              <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button onPress={handleRegister}>
                <ButtonText>Register</ButtonText>
              </Button>

              <Text>
                Already have an account?
                <LinkText onPress={() => setIsRegisterOpen(false)}>
                  {' '}
                  Login
                </LinkText>
              </Text>
            </>
          ) : (
            <>
              <Title>Login to Empower Tech Ministry</Title>
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button onPress={handleLogin}>
                <ButtonText>Login</ButtonText>
              </Button>
              <Text>
                Don't have an account yet?
                <LinkText onPress={() => setIsRegisterOpen(true)}>
                  {' '}
                  Register
                </LinkText>
              </Text>
            </>
          )}
        </>
      ) : (
        <WithSplashScreen isAppReady={isAppReady}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{handleLogout}}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Threads"
                component={Threads}
                initialParams={{handleLogout}}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ThreadDetails"
                component={ThreadDetails}
                initialParams={{handleLogout}}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Contact"
                component={Contact}
                initialParams={{handleLogout}}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="About"
                component={About}
                initialParams={{handleLogout}}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </WithSplashScreen>
      )}
    </Container>
  );
}

export default App;
