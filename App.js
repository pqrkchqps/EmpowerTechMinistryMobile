import React, {useState, useEffect} from 'react';
import Threads from './components/Threads';
import ThreadDetails from './components/ThreadDetails';
import Contact from './components/Contact';
import Calendly from './components/Calendly';
import About from './components/About';
import ButtonScreen from "./components/ButtonScreen"
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {WithSplashScreen} from './components/Splash';
import notifee, { EventType } from '@notifee/react-native';
window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';
const {API_URL, SOCKET_URL} = Config;
import {name as appName} from './app.json';

import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import {isTemplateSpan} from 'typescript';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const socket = io(SOCKET_URL);

// Styled components
const Container = styled.View`
  display: flex;
  height: 100%;
  background-color: #ffffff;
`;

const InnerContainer = styled.View`
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [newThread, setNewThread] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [routeName, setRouteName] = useState("About")


  axios.interceptors.request.use(async config => {
    config.headers['auth-token'] = await AsyncStorage.getItem('authToken');
    return config;
  });

  axios.interceptors.response.use(
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

  async function onDisplayNotification(title, body, data) {
    console.log(title, body, id)
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    if (pressAction){
      switch (notification.data.type){
        case "thread":
          setRouteName("Talk")
      }
    }
    console.log(notification, pressAction)
  });

  function loadLoginDetails() {
    // Check for stored authentication token upon app launch
    const credentialsPromise = Keychain.getGenericPassword();
    credentialsPromise.then(credentials => {
      setEmail(credentials.username);
      setPassword(credentials.password);
    });
  }

  function setSockets() {
    socket.on('newNotification', notification => {
      console.log('newNotification', notification);
      switch (notification.type){
        case "thread":
          setNewThread(notification.data);
          break;
        case "comment":
          setNewComment(notification.data)
          break;
      }
      
      onDisplayNotification(notification.data.title, notification.data.content, 
        {id: notification.data.id, type: notification.type, parentid: notification.data.parentid});
    });

    socket.on('ping', function () {
      console.log('ping recieved, sending pong');
      socket.emit('pong', {timestamp: new Date().getTime()});
    });
  }

  useEffect(() => {
    setSockets();
    loadLoginDetails();
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
    } catch (error) {
      console.error('Error while removing authentication token:', error);
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 100);
  }, []);

  return (
    <Container
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      {!loggedIn ? (
        <InnerContainer>
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
        </InnerContainer>
      ) : (
        <WithSplashScreen isAppReady={isAppReady}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName={routeName}
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  iconName = focused ? 'rocket' : 'circle';
                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
              })}>
              <Tab.Group
                screenOptions={{
                  headerShown: false,
                  handleLogout,
                }}>
                <Tab.Screen name="About" component={About} />
                <Tab.Screen name="Talk">
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Talk"
                        children={(props) => <Threads newThread={newThread} {...props} />}
                      />
                      <Stack.Screen
                        name="TalkDetails"
                        component={ThreadDetails}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Contact">
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Contact"
                        component={Contact}
                      />
                      <Stack.Screen
                        name="Meeting"
                        component={Calendly}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen 
                  name="Logout" 
                  component={ButtonScreen} 
                  options={({navigation})=> ({
                            tabBarButton:props => <TouchableOpacity {...props} onPress={()=>handleLogout()} />
                })} />
              </Tab.Group>
            </Tab.Navigator>
          </NavigationContainer>
        </WithSplashScreen>
      )}
    </Container>
  );
}

export default App;
