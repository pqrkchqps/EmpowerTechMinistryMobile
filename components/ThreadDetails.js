import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';
import {CommentContext} from './CommentContext';
import {ThreadContext} from './ThreadContext';

import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
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
  margin: 5px;
`;

const ThreadAuthorDetails = styled.Text`
  font-size: 16px;
  color: #700;
  margin: 5px;
`;

const ThreadDateDetails = styled.Text`
  font-size: 16px;
  color: #888;
  margin: 5px;
`;

const CommentContainer = styled.View`
  border: 1px solid #ccc;
  border-right-width: 0px;
  padding: 10px 0px 10px 10px;
  margin-bottom: 10px;
`;

const HeadingContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const CommentText = styled.Text`
  font-size: 14px;
  color: #333;
  margin: 5px;
`;

const CommentAuthorDetails = styled.Text`
  color: #700;
  margin: 5px;
`;

const CommentDateDetails = styled.Text`
  color: #888;
  margin: 5px;
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
  margin: 5px;
`;

const CommentButtonText = styled.Text`
  color: #007bff;
  font-size: 16px;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 20px;
`;

// ThreadDetails Component
const ThreadDetails = () => {
  const {socketComment, scrollToId, setScrollToId} = useContext(CommentContext);
  const {threadId} = useContext(ThreadContext);
  const scrollFromRef = useRef(null);
  function useHookWithRefCallback() {
    const ref = useRef(null);
    const setRef = useCallback(node => {
      if (ref.current) {
        // Make sure to cleanup any events/references added to the last instance
      }

      if (node && scrollFromRef && scrollFromRef.current) {
        setReplyingTo(scrollToId);
        scrollFromRef.current.scrollTo({x: 0, y: 0, animated: false});
        setTimeout(() => {
          node.measure((x, y, width, height, pageX, pageY) => {
            console.log(x, y, width, height, pageX, pageY);
            scrollFromRef.current.scrollTo({
              x: 0,
              y: pageY - 100 - 100,
              animated: true,
            });
          });
        }, 1000);
        setScrollToId(null);
      }

      // Save a reference to the node
      ref.current = node;
    }, []);

    return [setRef];
  }
  const [scrollToRef] = useHookWithRefCallback();

  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [rootThread, setRootThread] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [diablePostReply, setDiablePostReply] = useState(false);

  function addCommentToRootThread(newComment) {
    if (rootThread) {
      if (newComment.parentid == -1) {
        rootThread.children.push(newComment);
      } else {
        let chs = rootThread.children;
        console.log('chs', chs);
        let queue = [...rootThread.children];
        while (queue.length > 0) {
          let currentComment = queue.shift();
          if (currentComment) {
            if (currentComment.id == newComment.parentid) {
              currentComment.children.push(newComment);
              break;
            } else {
              currentComment.children.map(comment => {
                queue.push(comment);
              });
            }
          }
        }
      }
      let newRootThread = JSON.parse(JSON.stringify(rootThread));
      setRootThread(newRootThread);
    }
  }

  useEffect(() => {
    if (threadId) {
      const promise = axios.get(API_URL + '/api/thread/' + threadId);
      promise.then(response => {
        setRootThread(response.data.thread);
      });
    }
  }, [threadId]);

  useEffect(() => {
    console.log('Socket comment', socketComment);
    if (socketComment) {
      addCommentToRootThread(socketComment);
    }
  }, [socketComment]);

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const handleAddComment = async () => {
    if (!diablePostReply) {
      const comment = {
        content: replyingTo !== null ? newReply : newComment,
        rootid: rootThread.id,
        parentid: replyingTo !== null ? replyingTo : -1,
      };
      if (comment.content.trim() === '') {
        return;
      }
      setDiablePostReply(true);
      await axios.post(API_URL + '/api/comment/thread', comment);
      setDiablePostReply(false);

      setReplyingTo(null);

      setNewComment('');
      setNewReply('');
    }
  };

  const renderItem = item => (
    <CommentContainer
      ref={scrollToId == item.id ? scrollToRef : null}
      key={item.id}>
      <HeadingContainer>
        <CommentAuthorDetails>{item.username}</CommentAuthorDetails>
        <CommentDateDetails>
          {item.month}/{item.day}/{item.year}
        </CommentDateDetails>
      </HeadingContainer>
      <CommentText>{item.content}</CommentText>
      {replyingTo === item.id ? (
        <CommentForm>
          <NewCommentInput
            placeholder="Reply to this comment"
            value={newReply}
            onChangeText={text => setNewReply(text)}
          />
          <CommentButton disabled={diablePostReply} onPress={handleAddComment}>
            <CommentButtonText>Post Reply</CommentButtonText>
          </CommentButton>
        </CommentForm>
      ) : (
        <CommentButton onPress={() => setReplyingTo(item.id)}>
          <CommentButtonText>Reply</CommentButtonText>
        </CommentButton>
      )}
      {/* Display nested comments (replies) */}
      {item.children.map(item => renderItem(item))}
    </CommentContainer>
  );

  return (
    <Container>
      <AvoidSoftInputView>
        {/* Display thread comments */}
        <ScrollView ref={scrollFromRef}>
          <ThreadTitle>{rootThread && rootThread.title}</ThreadTitle>
          <HeadingContainer>
            <ThreadAuthorDetails>
              {rootThread && rootThread.username}
            </ThreadAuthorDetails>
            <ThreadDateDetails>
              {rootThread && rootThread.month}/{rootThread && rootThread.day}
              {'/'}
              {rootThread && rootThread.year}
            </ThreadDateDetails>
          </HeadingContainer>
          <ThreadContent>{rootThread && rootThread.content}</ThreadContent>
          {rootThread &&
            rootThread.children.map(comment => renderItem(comment))}
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
        </ScrollView>
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
