import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
const {API_URL} = Config;

// Styled components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
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
  const {thread} = route.params;
  const [newComment, setNewComment] = useState('');
  const [rootThread, setRootThread] = useState(thread);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const promise = axios.get(API_URL + '/api/thread/' + thread.id);
    promise.then(response => {
      setRootThread(response.data.thread);
    });
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    const comment = {
      content: newComment,
      rootid: rootThread.id,
      parentid: replyingTo !== null ? replyingTo : -1,
    };
    await axios.post(API_URL + '/api/comment/thread', comment);
    const response = await axios.get(API_URL + '/api/thread/' + thread.id);

    setRootThread(response.data.thread);
    setReplyingTo(null);

    setNewComment('');
  };

  const renderItem = ({item}) => (
    <CommentContainer>
      <CommentText>{item.content}</CommentText>
      {/* Show input for posting replies only when replyingTo matches the comment id */}
      {replyingTo === item.id ? (
        <CommentForm>
          <NewCommentInput
            placeholder="Reply to this comment"
            value={newComment}
            onChangeText={text => setNewComment(text)}
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
      <SafeAreaView style={styles.container}>
        <BackButton onPress={() => navigation.goBack()}>
          <Text style={{color: '#007BFF', fontSize: 18}}>Back to Threads</Text>
        </BackButton>

        <ThreadTitle>{rootThread.title}</ThreadTitle>
        <ThreadContent>{rootThread.content}</ThreadContent>

        {/* Display thread comments */}
        <FlatList
          data={rootThread.children}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThreadDetails;
