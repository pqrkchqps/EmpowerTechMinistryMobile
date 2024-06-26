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
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
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
import { wrapScrollView } from 'react-native-scroll-into-view';
import {RouteContext, RouteProvider} from "./components/RouteContext"
import { useContext } from 'react';
import {CommentContext} from './components/CommentContext';
import {ThreadContext} from './components/ThreadContext';

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
  color: #000000;
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

const WrappedScrollView = wrapScrollView(ScrollView);

export function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const {setRouteName} = useContext(RouteContext);
  const {setSocketComment, setScrollToId} = useContext(CommentContext);
  const {setSocketThread, setThreadId} = useContext(ThreadContext);

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

  async function displayNotification(title, body, data) {
    try {
      console.log('displayNotification', title, body, data);

      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'talk_activity',
        name: 'Talk Activity',
        importance: AndroidImportance.HIGH,
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
    } catch (e) {
      console.log('err: ', e);
    }
  }

  function handleNotificationClick(type, detail) {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        const {notification, pressAction} = detail;

        console.log('User pressed notification', detail.notification);
        switch (notification.data.type) {
          case 'thread':
            setThreadId(notification.data.id);
            setScrollToId(null);
            setRouteName('Talk Details');
            break;
          case 'comment':
            setThreadId(notification.data.id);
            setScrollToId(notification.data.scrollToId);
            setRouteName('Talk Details');
            break;
        }
    }
  }

  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) =>
      handleNotificationClick(type, detail),
    );
    notifee.onForegroundEvent(async ({type, detail}) =>
      handleNotificationClick(type, detail),
    );
  }, []);

  function loadLoginDetails() {
    // Check for stored authentication token upon app launch
    const credentialsPromise = Keychain.getGenericPassword();
    credentialsPromise.then(credentials => {
      setEmail(credentials.username);
      setPassword(credentials.password);
    });
  }

  function setSockets() {
    socket.on('newNotification', async notification => {
      console.log('newNotification', notification);
      switch (notification.type) {
        case 'thread':
          setSocketThread(notification.data);
          await displayNotification(
            notification.data.title,
            notification.data.username + ' - ' + notification.data.content,
            {id: notification.data.id, type: notification.type},
          );
          break;
        case 'comment':
          setSocketComment(notification.data);
          await displayNotification(
            notification.data.title,
            notification.data.username + ' - ' + notification.data.content,
            {
              id: notification.data.rootid,
              type: notification.type,
              scrollToId: notification.data.id,
            },
          );
          break;
      }
    });

    socket.on('ping', function () {
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
    }, 1000);
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
            <WrappedScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Tab.Navigator
                initialRouteName="About"
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
                        <Stack.Screen name="Talk " component={Threads} />
                        <Stack.Screen
                          name="Talk Details"
                          component={ThreadDetails}
                        />
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen name="Contact">
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen name="Contact " component={Contact} />
                        <Stack.Screen name="Meeting" component={Calendly} />
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Logout"
                    component={ButtonScreen}
                    options={({navigation}) => ({
                      tabBarButton: props => (
                        <TouchableOpacity
                          {...props}
                          onPress={() => handleLogout()}
                        />
                      ),
                    })}
                  />
                </Tab.Group>
              </Tab.Navigator>
            </WrappedScrollView>
          </NavigationContainer>
        </WithSplashScreen>
      )}
    </Container>
  );
}
