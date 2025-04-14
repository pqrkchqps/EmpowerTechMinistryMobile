import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';

import styled from 'styled-components/native';
import axios from '../utils/axios';
import config from '../utils/env';
const {API_URL} = config;
import RedirectNavigator from './RedirectNavigator';
import {ThreadContext} from './ThreadContext';
import {useFocusEffect} from '@react-navigation/native';

// Styled components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const ThreadItem = styled.View`
  margin-bottom: 20px;
`;

const ThreadTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const ThreadContent = styled.Text`
  color: #666;
`;

const ThreadAuthorDetails = styled.Text`
  color: #700;
  margin: 5px 5px 5px 0px;
`;

const ThreadDateDetails = styled.Text`
  color: #888;
  margin: 5px;
`;

const HeadingContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const NewThreadForm = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 10px;
`;

const NewThreadTitle = styled.TextInput.attrs({
  placeholderTextColor: 'gray',
})`
  font-size: 18px;
  color: #555;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const NewThreadContent = styled.TextInput.attrs({
  placeholderTextColor: 'gray',
})`
  color: #666;
  padding: 10px;
  border: 1px solid #ccc;
  height: 100px;
`;

// Threads Component
const Threads = ({navigation, scrollToId}) => {
  const {socketThreads, setThreadId} = useContext(ThreadContext);
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  useEffect(() => {
    if (socketThreads) {
      setThreads(state => [...state, ...socketThreads]);
    }
  }, [socketThreads]);

  useEffect(() => {
    const promise = axios.get(API_URL + '/api/thread');
    promise.then(response => {
      setThreads(response.data.threads);
    });
  }, []);

  const handleAddThread = async () => {
    if (newThreadTitle.trim() === '') {
      return;
    }

    const newThread = {
      title: newThreadTitle,
      content: newThreadContent,
    };

    const response = await axios.post(API_URL + '/api/thread', newThread);

    setNewThreadTitle('');
    setNewThreadContent('');
  };

  const handleClickThread = async threadId => {
    setThreadId(threadId);
    navigation.navigate('Talk Details');
  };

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setEnabled(true);
    return () => {
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const renderItem = ({item: thread}) => (
    <TouchableOpacity
      id={`${thread.id}`}
      onPress={handleClickThread.bind(this, thread.id)}>
      <ThreadItem>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <HeadingContainer>
          <ThreadAuthorDetails>{thread.username}</ThreadAuthorDetails>
          <ThreadDateDetails>
            {thread.month}/{thread.day}/{thread.year}
          </ThreadDateDetails>
        </HeadingContainer>
        <ThreadContent>{thread.content}</ThreadContent>
        {scrollToId == thread.id && console.log(thread.id)}
      </ThreadItem>
    </TouchableOpacity>
  );

  return (
    <Container>
      <AvoidSoftInputView>
        <RedirectNavigator />
        <FlatList
          data={threads}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'key-' + item.id}
          ListFooterComponent={
            <NewThreadForm>
              <NewThreadTitle
                placeholder="Thread Title"
                value={newThreadTitle}
                onChangeText={text => setNewThreadTitle(text)}
              />
              <NewThreadContent
                multiline
                placeholder="Thread Content"
                value={newThreadContent}
                onChangeText={text => setNewThreadContent(text)}
              />
              <TouchableOpacity onPress={handleAddThread}>
                <Text
                  style={{color: '#007BFF', fontSize: 18, textAlign: 'center'}}>
                  Create Thread
                </Text>
              </TouchableOpacity>
            </NewThreadForm>
          }
        />
      </AvoidSoftInputView>
    </Container>
  );
};


export default Threads;
