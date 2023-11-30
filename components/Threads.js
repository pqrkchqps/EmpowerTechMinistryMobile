import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  wrapScrollView,
  useScrollIntoView,
} from 'react-native-scroll-into-view';

import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
import RedirectNavigator from './RedirectNavigator';

const {API_URL} = Config;

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
  margin-bottom: 10px;
`;

const ThreadItem = styled.View`
  margin-bottom: 10px;
`;

const ThreadTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const ThreadContent = styled.Text`
  color: #666;
`;

const NewThreadForm = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 10px;
`;

const NewThreadTitle = styled.TextInput`
  font-size: 18px;
  color: #555;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const NewThreadContent = styled.TextInput`
  color: #666;
  padding: 10px;
  border: 1px solid #ccc;
  height: 100px;
`;


// Threads Component
const Threads = ({navigation, newThread, scrollToId}) => {
  const scrollIntoView = useScrollIntoView();
  const viewRef = useRef();

  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  useEffect(() => {
    console.log("newThread", newThread)
    if (newThread) {
      setThreads(state => [...state, newThread]);
    }
  }, [newThread]);

  useEffect(() => {
    const promise = axios.get(API_URL + '/api/thread');
    promise.then(response => {
      setThreads(response.data.threads);
    });
  }, []);


  useEffect(() => {
    if (threads.length > 0){
      scrollIntoView(viewRef.current);
    }
  }, [scrollToId]);


  const handleAddThread = async () => {
    if (newThreadTitle.trim() === '' || newThreadContent.trim() === '') {
      return;
    }

    const newThread = {
      title: newThreadTitle,
      content: newThreadContent,
    };

    const response = await axios.post(API_URL + '/api/thread', newThread);

    setThreads([...threads, response.data.thread]);
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  console.log("scrollToId", scrollToId)
  return (
    <Container>
      <RedirectNavigator/>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Title>Threads</Title>

          {/* Display list of threads */}
          {threads.map((thread, index) => ( 
            <TouchableOpacity
              key={index}
              ref={scrollToId == thread.id ? viewRef : null}
              onPress={() => navigation.navigate('Talk Details', {id: thread.id})}>
              <ThreadItem>
                <ThreadTitle>{thread.title}</ThreadTitle>
                <ThreadContent>{thread.content}</ThreadContent>
                {scrollToId == thread.id && console.log(thread.id)}
              </ThreadItem>
            </TouchableOpacity>
            
          ))}

          {/* Form to create a new thread */}
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
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Threads;
