import React, {useState, useEffect} from 'react';
import Threads from './components/Threads';
import ThreadDetails from './components/ThreadDetails';
//import Contact from './components/Contact';
import Calendly from './components/Calendly';
import Articles from './components/Articles';
import ArticleDetails from './components/ArticleDetails';
import ButtonScreen from './components/ButtonScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/fontawesome';
import {WithSplashScreen} from './components/Splash';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import config from './utils/env';
const {API_URL, SOCKET_URL} = config;
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
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import axios from './utils/axios';
import {isTemplateSpan} from 'typescript';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {wrapScrollView} from 'react-native-scroll-into-view';
import {RouteContext, RouteProvider} from './components/RouteContext';
import {useContext} from 'react';
import {CommentContext} from './components/CommentContext';
import {ThreadContext} from './components/ThreadContext';
import {ErrorContext} from './components/ErrorContext';

const socket = io(SOCKET_URL);

// Styled components
const Container = styled.View`
  display: flex;
  height: 100%;
  background-color: #ffffff;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: #010049;
`;

const InnerContainer = styled.View`
  background-color: #010049;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginContainer = styled.View`
  height: 400px;
  background-color: #ffffff;
  padding: 30px;
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
  margin-top: 10px;
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

const Input = styled.TextInput.attrs({
  placeholderTextColor: 'gray',
})`
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

const WrappedContainer = wrapScrollView(Container);

export function App() {
  const {error} = useContext(ErrorContext);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const {setRouteName} = useContext(RouteContext);
  const {setSocketComment: setThreadComment, setScrollToId} =
    useContext(CommentContext);
  const {
    setSocketComment: setArticleComment,
    setScrollToId: setScrollToIdArticle,
  } = useContext(CommentContext);
  const {setSocketThread, setThreadId} = useContext(ThreadContext);

  useEffect(() => {
    if (error?.response?.status === 401) {
      setLoggedIn(false);
      loadLoginDetails();
    }
  }, [error]);

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
          if (notification.data.type === 'thread')
            setThreadComment(notification.data);
          else if (notification.data.type === 'article')
            setArticleComment(notification.data);
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
      const userId = response.data.user.id;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userId', userId.toString());
      await Keychain.setGenericPassword(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.log('Error while saving authentication token:', error);
    }
  };

  const handleSendPasswordReset = async () => {
    // Implement login functionality here
    // For demonstration, we'll assume successful login and store the token
    try {
      console.log(config);
      console.log(API_URL);
      const response = await axios.post(API_URL + '/api/auth/link', {
        email,
      });
      console.log('posted to link');
    } catch (error) {
      console.log('Error while posting to /api/auth/link:', error);
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
    Alert.alert('Confirmation', 'Do you really want to logout?', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Logout',
        onPress: () => {
          try {
            AsyncStorage.removeItem('authToken').then(() => {
              Keychain.resetGenericPassword().then(() => {
                setLoggedIn(false);
              });
            });
          } catch (error) {
            console.error('Error while removing authentication token:', error);
            console.log(error);
          }
        },
      },
    ]);
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
            <LoginContainer>
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
            </LoginContainer>
          ) : (
            <LoginContainer>
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

              <ContactItem>
                <Text>
                  Forgot Your Password
                  <LinkText onPress={handleSendPasswordReset}>
                    {' '}
                    Send Password Reset Link
                  </LinkText>
                </Text>
              </ContactItem>

              <ContactItem>
                <Text>
                  Don't have an account yet?
                  <LinkText onPress={() => setIsRegisterOpen(true)}>
                    {' '}
                    Register
                  </LinkText>
                </Text>
              </ContactItem>
            </LoginContainer>
          )}
        </InnerContainer>
      ) : (
        <WithSplashScreen isAppReady={isAppReady}>
          <NavigationContainer>
            <WrappedContainer
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Tab.Navigator
                lazy={false}
                initialRouteName="Articles"
                screenOptions={({route}) => ({
                  tabBarStyle: {backgroundColor: '#010049', paddingTop: 10},
                  tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    iconName = focused ? 'rocket' : 'circle';
                    return <Icon name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'white',
                  lazy: false,
                })}>
                <Tab.Group
                  screenOptions={{
                    headerShown: false,
                    handleLogout,
                  }}>
                  <Tab.Screen
                    name="Articles"
                    options={{
                      headerTintColor: 'white',
                    }}>
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Articles"
                          component={Articles}
                          options={NavScreenOptions}
                        />
                        <Stack.Screen
                          name="Article Details"
                          component={ArticleDetails}
                          options={NavScreenOptions}
                        />
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen name="Talk">
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Talk "
                          component={Threads}
                          options={NavScreenOptions}
                        />
                        <Stack.Screen
                          name="Talk Details"
                          options={NavScreenOptions}
                          component={ThreadDetails}
                        />
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Contact"
                    component={Calendly}
                    options={NavScreenOptions}
                  />
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
            </WrappedContainer>
          </NavigationContainer>
        </WithSplashScreen>
      )}
    </Container>
  );
}

const NavScreenOptions = {
  headerTitleStyle: {
    color: 'white', // Change the text color
    fontSize: 24, // Change the font size
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center', // Center the text
  },
  headerStyle: {
    backgroundColor: '#010049', // Change the background color of the header
  },
  headerTintColor: 'white',
};