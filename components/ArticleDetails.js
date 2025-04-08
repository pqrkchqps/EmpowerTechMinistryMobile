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
  Image,
} from 'react-native';
import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';
import {CommentContext} from './CommentContext';
import {ArticleContext} from './ArticleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styled from 'styled-components/native';
import axios from '../utils/axios';
import config from '../utils/env';
const {API_URL} = config;
import {useFocusEffect} from '@react-navigation/native';

// Styled components
const Container = styled.View`
  display: flex;
  background-color: #ffffff;
  height: 100%;
  padding: 20px;
`;

const ArticleTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: ${props => (props.index > 0 ? '40px' : '5px')};
  margin-bottom: 10px;
`;

const SectionParagraph = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const ArticleContent = styled.Text`
  font-size: 16px;
  color: #666;
  margin: 5px;
`;

const ArticleAuthorDetails = styled.Text`
  font-size: 16px;
  color: #700;
  margin: 5px;
  margin-right: 30px;
`;

const ArticleDateDetails = styled.Text`
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
  flex-direction: column;
`;

const BodyContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

const MetaDataContainer = styled.View`
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
  margin-top: 10px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 20px;
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

// ArticleDetails Component
const ArticleDetails = () => {
  const [userId, setUserId] = useState();

  useEffect(() => {
    AsyncStorage.getItem('userId', userId).then(value => {
      setUserId(value);
    });
  }, []);

  const {socketComments, scrollToId, setScrollToId} =
    useContext(CommentContext);
  const {articleId} = useContext(ArticleContext);
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
  const [editCommentText, setEditCommentText] = useState('');
  const [rootArticle, setRootArticle] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingTo, setEditingTo] = useState(null);
  const [isDisabledPostReply, setIsDisabledPostReply] = useState(false);
  const [isDisabledDeleteComment, setIsDisabledDeleteComment] = useState(false);
  const [isDisabledEditComment, setIsDisabledEditComment] = useState(false);
  const [isEditAlreadyUpdated, setIsEditAlreadyUpdated] = useState(false);
  const [isEditTitleAlreadyUpdated, setIsEditTitleAlreadyUpdated] =
    useState(false);
  const [editArticleTitle, setEditArticleTitle] = useState(false);

  function addCommentsToRootArticle(newComments) {
    if (rootArticle) {
      for (const newComment of newComments) {
        if (newComment.parentid == -1) {
          rootArticle.children.push(newComment);
        } else {
          let chs = rootArticle.children;
          console.log('chs', chs);
          let queue = [...rootArticle.children];
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
      }
      let newRootArticle = JSON.parse(JSON.stringify(rootArticle));
      setRootArticle(newRootArticle);
    }
  }

  function deleteCommentToRootArticle(comment) {
    if (rootArticle) {
      if (newComment.parentid == -1) {
        rootArticle.children.push(newComment);
      } else {
        let chs = rootArticle.children;
        console.log('chs', chs);
        let queue = [...rootArticle.children];
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
      let newRootArticle = JSON.parse(JSON.stringify(rootArticle));
      setRootArticle(newRootArticle);
    }
  }

  function updateCommentToRootArticle(comment) {
    if (rootArticle) {
      if (newComment.parentid == -1) {
        rootArticle.children.push(newComment);
      } else {
        let chs = rootArticle.children;
        console.log('chs', chs);
        let queue = [...rootArticle.children];
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
      let newRootArticle = JSON.parse(JSON.stringify(rootArticle));
      setRootArticle(newRootArticle);
    }
  }

  function updateRootArticle(article) {
    if (rootArticle) {
      rootArticle.title = editArticleTitle;
      rootArticle.content = editCommentText;
      let newRootArticle = JSON.parse(JSON.stringify(rootArticle));
      setRootArticle(newRootArticle);
    }
  }

  useEffect(() => {
    if (articleId) {
      const promise = axios.get(API_URL + '/api/article/' + articleId);
      promise.then(response => {
        setRootArticle(response.data.article);
      });
    }
  }, [articleId]);

  useEffect(() => {
    console.log('Socket comment', socketComments);
    if (socketComments && socketComments.length > 0) {
      addCommentsToRootArticle(socketComments);
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
        rootid: articleId,
        parentid: replyingTo !== null ? replyingTo : -1,
      };
      if (comment.content.trim() === '') {
        return;
      }
      setIsDisabledPostReply(true);
      await axios.post(API_URL + '/api/comment/article', comment);
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
      if (comment.content.trim() === '') {
        return;
      }
      setIsDisabledEditComment(true);
      await axios.patch(API_URL + '/api/comment/article/' + editingTo, comment);
      updateCommentToRootArticle(comment);
      setIsDisabledEditComment(false);

      setEditingTo(null);

      setEditCommentText('');

      setIsEditAlreadyUpdated(false);
    }
  };

  const handleSubmitEditArticle = async () => {
    if (!isDisabledEditComment) {
      const article = {
        title: editArticleTitle,
        content: editCommentText,
        id: rootArticle.id,
      };
      if (article.title.trim() === '') {
        return;
      }
      setIsDisabledEditComment(true);
      await axios.patch(API_URL + '/api/article/' + rootArticle.id, article);
      updateRootArticle(article);
      setIsDisabledEditComment(false);

      setEditingTo(null);

      setEditCommentText('');
      setEditArticleTitle('');

      setIsEditAlreadyUpdated(false);
      setIsEditTitleAlreadyUpdated(false);
    }
  };

  const handleCancelEditComment = async () => {
    if (!isDisabledEditComment) {
      setEditingTo(null);

      setEditCommentText('');
      setEditArticleTitle('');

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
                .delete(API_URL + '/api/comment/article/' + comment.id)
                .then(res => {
                  deleteCommentToRootArticle(comment);
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
      setEditArticleTitle(text);
      setIsEditTitleAlreadyUpdated(true);
    }
    return true;
  }

  const renderParagraph = (paragraph, index) => (
    <SectionParagraph key={index}>{paragraph}</SectionParagraph>
  );

  const renderSection = (section, index) => (
    <View key={index}>
      <SectionTitle index={index}>{section.title}</SectionTitle>
      {section?.paragraphs.map(renderParagraph)}
    </View>
  );

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
        {editingTo === item.id && setOnceEditCommentText(item.content) ? (
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
          {replyingTo === item.id ? (
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
      {item.userid.toString() === userId && !replyingTo && (
        <>
          {editingTo === item.id ? (
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
      {item.userid.toString() === userId &&
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
      <AvoidSoftInputView>
        {/* Display article comments */}
        <ScrollView ref={scrollFromRef}>
          <ArticleTitle>
            {editingTo === -1 &&
            rootArticle &&
            setOnceEditArticleTitle(rootArticle.title) ? (
              <CommentForm>
                <NewCommentInput
                  placeholder="Edit this title"
                  value={editArticleTitle}
                  onChangeText={text => setEditArticleTitle(text)}
                />
              </CommentForm>
            ) : (
              rootArticle && rootArticle.title
            )}
          </ArticleTitle>
          <HeadingContainer>
            {rootArticle && (
              <Image 
                source={{uri: rootArticle.image}} 
                style={{width: '100%', height: 300}}
              />
            )}
            <MetaDataContainer>
              <ArticleAuthorDetails>
                {rootArticle && rootArticle.username}
              </ArticleAuthorDetails>
              <ArticleDateDetails>
                {rootArticle && rootArticle.time}
              </ArticleDateDetails>
            </MetaDataContainer>
          </HeadingContainer>
          <BodyContainer>
            {rootArticle?.sections.map(renderSection)}
          </BodyContainer>
          <ArticleContent>
            {editingTo === -1 &&
            rootArticle &&
            setOnceEditCommentText(rootArticle.content) ? (
              <CommentForm>
                <NewCommentInput
                  placeholder="Edit this comment"
                  value={editCommentText}
                  onChangeText={text => setEditCommentText(text)}
                />
              </CommentForm>
            ) : (
              rootArticle && rootArticle.content
            )}
          </ArticleContent>
          {rootArticle && rootArticle.userid.toString() === userId && (
            <>
              {editingTo === -1 ? (
                <>
                  <CommentButton
                    disabled={isDisabledEditComment}
                    onPress={handleSubmitEditArticle}>
                    <CommentButtonText>Submit Edit</CommentButtonText>
                  </CommentButton>
                  <CommentButton
                    disabled={isDisabledEditComment}
                    onPress={handleCancelEditComment}>
                    <CommentButtonText>Cancel Edit</CommentButtonText>
                  </CommentButton>
                </>
              ) : (
                null
              )}
            </>
          )}
          {rootArticle &&
            rootArticle.children.map(comment => renderItem(comment))}
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

export default ArticleDetails;
