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
  Alert,
} from 'react-native';
import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';
import {CommentContext} from './CommentContext';
import {ThreadContext} from './ThreadContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styled from 'styled-components/native';
import axios from '../utils/axios';
import config from '../utils/env';
const {API_URL} = config;
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const CenterContent = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

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
  border-left-width: 0px;
  border-bottom-width: 0px;
  padding: 10px 0px 0px 10px;
  margin-top: 10px;
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

const NewCommentInput = styled.TextInput.attrs({
  placeholderTextColor: 'gray',
})`
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
  const [userId, setUserId] = useState();

  useEffect(() => {
    AsyncStorage.getItem('userId', userId).then(value => {
      setUserId(value);
    });
  }, []);

  const {socketComments, scrollToId, setScrollToId} =
    useContext(CommentContext);

  const {threadId} = useContext(ThreadContext);
  const [isLoading, setIsLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [rootThread, setRootThread] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingTo, setEditingTo] = useState(null);
  const [isDisabledPostReply, setIsDisabledPostReply] = useState(false);
  const [isDisabledDeleteComment, setIsDisabledDeleteComment] = useState(false);
  const [isDisabledEditComment, setIsDisabledEditComment] = useState(false);
  const [isEditAlreadyUpdated, setIsEditAlreadyUpdated] = useState(false);
  const [isEditTitleAlreadyUpdated, setIsEditTitleAlreadyUpdated] =
    useState(false);
  const [editThreadTitle, setEditThreadTitle] = useState(false);

  const scrollFromRef = useRef(null);

  const scrollToRef = useCallback(
    node => {
      setTimeout(() => {
        if (!isLoading) {
          console.log('ready to scroll');

          if (node && scrollFromRef && scrollFromRef.current) {
            console.log('scrolling');
            setReplyingTo(scrollToId);
            scrollFromRef.current.scrollTo({x: 0, y: 0, animated: false});
            setIsLoading(false);
            setTimeout(() => {
              node.measure((x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
                scrollFromRef.current.scrollTo({
                  x: 0,
                  y: pageY - 100 - 100,
                  animated: true,
                });
              });
            }, 10);
            setScrollToId(null);
          }
        }
      }, 200);
    },
    [isLoading],
  );
  function addCommentsToRootThread(newComments) {
    if (rootThread) {
      for (const newComment of newComments) {
        if (newComment.rootid == rootThread.id) {
          if (newComment.parentid == -1) {
            const commentAlreadyThere = rootThread.children.filter(
              c => c.id == newComment.id,
            );
            if (commentAlreadyThere.length == 0) {
              rootThread.children.push(newComment);
            }
          } else {
            let chs = rootThread.children;
            console.log('chs', chs);
            let queue = [...rootThread.children];
            while (queue.length > 0) {
              let currentComment = queue.shift();
              if (currentComment) {
                if (currentComment.id == newComment.parentid) {
                  const commentAlreadyThere = currentComment.children.filter(
                    c => c.id == newComment.id,
                  );
                  if (commentAlreadyThere.length == 0) {
                    currentComment.children.push(newComment);
                  }
                  break;
                } else {
                  currentComment.children.map(comment => {
                    queue.push(comment);
                  });
                }
              }
            }
          }
        }
      }
      let newRootThread = JSON.parse(JSON.stringify(rootThread));
      setRootThread(newRootThread);
    }
  }

  function deleteCommentToRootThread(comment) {
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
            if (currentComment.id == comment.id) {
              currentComment.content = 'deleted';
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

  function updateCommentToRootThread(comment) {
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
            if (currentComment.id == comment.id) {
              currentComment.content = comment.content;
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

  function updateRootThread(thread) {
    if (rootThread) {
      rootThread.title = editThreadTitle;
      rootThread.content = editCommentText;
      let newRootThread = JSON.parse(JSON.stringify(rootThread));
      setRootThread(newRootThread);
    }
  }

  useEffect(() => {
    if (threadId) {
      setIsLoading(true);
      const promise = axios.get(API_URL + '/api/thread/' + threadId);
      promise.then(response => {
        setRootThread(response.data.thread);
        setIsLoading(false);
      });
    }
  }, [threadId]);

  useEffect(() => {
    console.log('Socket comment', socketComments);
    if (socketComments) {
      addCommentsToRootThread(socketComments);
    }
  }, [socketComments]);

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setEnabled(true);
    return () => {
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const handleAddComment = async () => {
    if (!isDisabledPostReply) {
      const comment = {
        content: replyingTo !== null ? newReply : newComment,
        rootid: threadId,
        parentid: replyingTo !== null ? replyingTo : -1,
      };
      if (comment.content.trim() == '') {
        return;
      }
      setIsDisabledPostReply(true);
      await axios.post(API_URL + '/api/comment/thread', comment);
      setIsDisabledPostReply(false);

      setReplyingTo(null);

      setNewComment('');
      setNewReply('');
    }
  };

  const handleCancelReply = async () => {
    if (!isDisabledPostReply) {
      setReplyingTo(null);

      setNewComment('');
      setNewReply('');
    }
  };

  const handleSubmitEditComment = async () => {
    if (!isDisabledEditComment) {
      const comment = {
        content: editCommentText,
        id: editingTo,
      };
      if (comment.content.trim() == '') {
        return;
      }
      setIsDisabledEditComment(true);
      await axios.patch(API_URL + '/api/comment/thread/' + editingTo, comment);
      updateCommentToRootThread(comment);
      setIsDisabledEditComment(false);

      setEditingTo(null);

      setEditCommentText('');

      setIsEditAlreadyUpdated(false);
    }
  };

  const handleSubmitEditThread = async () => {
    if (!isDisabledEditComment) {
      const thread = {
        title: editThreadTitle,
        content: editCommentText,
        id: rootThread.id,
      };
      if (thread.title.trim() == '') {
        return;
      }
      setIsDisabledEditComment(true);
      await axios.patch(API_URL + '/api/thread/' + rootThread.id, thread);
      updateRootThread(thread);
      setIsDisabledEditComment(false);

      setEditingTo(null);

      setEditCommentText('');
      setEditThreadTitle('');

      setIsEditAlreadyUpdated(false);
      setIsEditTitleAlreadyUpdated(false);
    }
  };

  const handleCancelEditComment = async () => {
    if (!isDisabledEditComment) {
      setEditingTo(null);

      setEditCommentText('');
      setEditThreadTitle('');

      setIsEditAlreadyUpdated(false);
      setIsEditTitleAlreadyUpdated(false);
    }
  };

  const handleDeleteComment = async comment => {
    console.log('comment');
    console.log(comment);
    if (!isDisabledDeleteComment) {
      setIsDisabledDeleteComment(true);
      Alert.alert(
        'Delete?',
        'Are you sure you want to delete the comment that contains "' +
          comment.content.substring(0, 15) +
          '"?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              axios
                .delete(API_URL + '/api/comment/thread/' + comment.id)
                .then(res => {
                  deleteCommentToRootThread(comment);
                  console.log('Comment ' + comment.id + ' deleted');
                })
                .catch(e => {
                  console.log(
                    'Comment ' + comment.id + ' has error ' + e.message,
                  );
                });
            },
            style: 'cancel',
          },
        ],
      );
      setIsDisabledDeleteComment(false);
    }
  };

  function setOnceEditCommentText(text) {
    if (!isEditAlreadyUpdated) {
      setEditCommentText(text);
      setIsEditAlreadyUpdated(true);
    }
    return true;
  }

  function setOnceEditArticleTitle(text) {
    if (!isEditTitleAlreadyUpdated) {
      setEditThreadTitle(text);
      setIsEditTitleAlreadyUpdated(true);
    }
    return true;
  }

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
      <CommentText>
        {editingTo == item.id && setOnceEditCommentText(item.content) ? (
          <CommentForm>
            <NewCommentInput
              placeholder="Edit this comment"
              value={editCommentText}
              onChangeText={text => setEditCommentText(text)}
            />
          </CommentForm>
        ) : (
          item.content
        )}
      </CommentText>
      {!editingTo && (
        <>
          {replyingTo == item.id ? (
            <CommentForm>
              <NewCommentInput
                placeholder="Reply to this comment"
                value={newReply}
                onChangeText={text => setNewReply(text)}
              />
              <CommentButton
                disabled={isDisabledPostReply}
                onPress={handleAddComment}>
                <CommentButtonText>Post Reply</CommentButtonText>
              </CommentButton>
              <CommentButton
                disabled={isDisabledPostReply}
                onPress={handleCancelReply}>
                <CommentButtonText>Cancel Reply</CommentButtonText>
              </CommentButton>
            </CommentForm>
          ) : (
            <CommentButton onPress={() => setReplyingTo(item.id)}>
              <CommentButtonText>Reply</CommentButtonText>
            </CommentButton>
          )}
        </>
      )}
      {item.userid.toString() == userId && !replyingTo && (
        <>
          {editingTo == item.id ? (
            <>
              <CommentButton
                disabled={isDisabledEditComment}
                onPress={handleSubmitEditComment}>
                <CommentButtonText>Submit Edit</CommentButtonText>
              </CommentButton>
              <CommentButton
                disabled={isDisabledEditComment}
                onPress={handleCancelEditComment}>
                <CommentButtonText>Cancel Edit</CommentButtonText>
              </CommentButton>
            </>
          ) : (
            <CommentButton onPress={() => setEditingTo(item.id)}>
              <CommentButtonText>Edit</CommentButtonText>
            </CommentButton>
          )}
        </>
      )}
      {item.userid.toString() == userId &&
        !editingTo &&
        !replyingTo &&
        item.content !== 'deleted' && (
          <CommentButton
            disabled={isDisabledDeleteComment}
            onPress={() => handleDeleteComment(item)}>
            <CommentButtonText>Delete</CommentButtonText>
          </CommentButton>
        )}
      {/* Display nested comments (replies) */}
      {item.children.map(item => renderItem(item))}
    </CommentContainer>
  );

  return (
    <Container>
      {isLoading ? (
        <CenterContent>
          <LottieView
            source={require('../images/rocket-loader.json')}
            style={{
              width: 250,
              height: 250,
            }}
            autoPlay
            loop
          />
        </CenterContent>
      ) : (
        <AvoidSoftInputView>
          {/* Display thread comments */}
          <ScrollView ref={scrollFromRef}>
            <ThreadTitle>
              {editingTo == -1 &&
              rootThread &&
              setOnceEditArticleTitle(rootThread.title) ? (
                <CommentForm>
                  <NewCommentInput
                    placeholder="Edit this title"
                    value={editThreadTitle}
                    onChangeText={text => setEditThreadTitle(text)}
                  />
                </CommentForm>
              ) : (
                rootThread && rootThread.title
              )}
            </ThreadTitle>
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
            <ThreadContent>
              {editingTo == -1 &&
              rootThread &&
              setOnceEditCommentText(rootThread.content) ? (
                <CommentForm>
                  <NewCommentInput
                    placeholder="Edit this comment"
                    value={editCommentText}
                    onChangeText={text => setEditCommentText(text)}
                  />
                </CommentForm>
              ) : (
                rootThread && rootThread.content
              )}
            </ThreadContent>
            {rootThread && rootThread.userid.toString() == userId && (
              <>
                {editingTo == -1 ? (
                  <>
                    <CommentButton
                      disabled={isDisabledEditComment}
                      onPress={handleSubmitEditThread}>
                      <CommentButtonText>Submit Edit</CommentButtonText>
                    </CommentButton>
                    <CommentButton
                      disabled={isDisabledEditComment}
                      onPress={handleCancelEditComment}>
                      <CommentButtonText>Cancel Edit</CommentButtonText>
                    </CommentButton>
                  </>
                ) : (
                  <CommentButton onPress={() => setEditingTo(-1)}>
                    <CommentButtonText>Edit</CommentButtonText>
                  </CommentButton>
                )}
              </>
            )}
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
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThreadDetails;
