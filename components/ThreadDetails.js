import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';

import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
import RedirectNavigator from './RedirectNavigator';

const {API_URL} = Config;

// Styled components
const Container = styled.View`
  display: flex;
  background-color: #ffffff;
  height: 100%;
  padding: 20px;
`;

const ThreadTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ThreadContent = styled.Text`
  font-size: 16px;
  color: #666;
`;

const CommentContainer = styled.View`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

const CommentText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const CommentForm = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 10px;
`;

const NewCommentInput = styled.TextInput`
  font-size: 14px;
  color: #333;
  padding: 8px;
  border: 1px solid #ccc;
`;

const CommentButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

const CommentButtonText = styled.Text`
  color: #007bff;
  font-size: 16px;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 20px;
`;

// ThreadDetails Component
const ThreadDetails = ({navigation, route}) => {
  console.log("ROUTE PARAMS", route.params)
  const {id} = route.params;
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [rootThread, setRootThread] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const promise = axios.get(API_URL + '/api/thread/' + id);
    promise.then(response => {
      setRootThread(response.data.thread);
    });
  }, []);

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const handleAddComment = async () => {
    const comment = {
      content: replyingTo !== null ? newReply : newComment,
      rootid: rootThread.id,
      parentid: replyingTo !== null ? replyingTo : -1,
    };
    if (comment.content.trim() === '') {
      return;
    }
    await axios.post(API_URL + '/api/comment/thread', comment);
    const response = await axios.get(API_URL + '/api/thread/' + id);

    setRootThread(response.data.thread);
    setReplyingTo(null);

    setNewComment('');
    setNewReply('');
  };

  const renderItem = ({item}) => (
    <CommentContainer key={item.id}>
      <CommentText>{item.content}</CommentText>
      {/* Show input for posting replies only when replyingTo matches the comment id */}
      {replyingTo === item.id ? (
        <CommentForm>
          <NewCommentInput
            placeholder="Reply to this comment"
            value={newReply}
            onChangeText={text => setNewReply(text)}
          />
          <CommentButton onPress={handleAddComment}>
            <CommentButtonText>Post Reply</CommentButtonText>
          </CommentButton>
        </CommentForm>
      ) : (
        <TouchableOpacity onPress={() => setReplyingTo(item.id)}>
          <Text style={{color: '#007BFF', fontSize: 16}}>Reply</Text>
        </TouchableOpacity>
      )}
      {/* Display nested comments (replies) */}
      {item.children.map(item => renderItem({item}))}
    </CommentContainer>
  );

  return (
    <Container>
      <RedirectNavigator/>
      <AvoidSoftInputView>
        {/* Display thread comments */}
        <FlatList
          data={rootThread && rootThread.children}
          renderItem={renderItem}
          ListHeaderComponent={
            <>
              <ThreadTitle>{rootThread && rootThread.title}</ThreadTitle>
              <ThreadContent>{rootThread && rootThread.content}</ThreadContent>
            </>
          }
          ListFooterComponent={
            <CommentForm>
              <NewCommentInput
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={text => setNewComment(text)}
              />
              <CommentButton onPress={handleAddComment}>
                <CommentButtonText>Post Comment</CommentButtonText>
              </CommentButton>
            </CommentForm>
          }
        />
      </AvoidSoftInputView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThreadDetails;
