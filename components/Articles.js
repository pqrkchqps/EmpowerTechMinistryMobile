import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

import {AvoidSoftInput, AvoidSoftInputView} from 'react-native-avoid-softinput';

import styled from 'styled-components/native';
import axios from '../utils/axios';
import config from '../utils/env';
const {API_URL} = config;
import RedirectNavigator from './RedirectNavigator';
import {ArticleContext} from './ArticleContext';
import {useFocusEffect} from '@react-navigation/native';

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

const ArticleItem = styled.View`
  margin-bottom: 60px;
`;

const ArticleTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const ArticleContent = styled.Text`
  color: #666;
`;

const ArticleAuthorDetails = styled.Text`
  color: #700;
  margin: 5px 5px 5px 0px;
`;

const ArticleDateDetails = styled.Text`
  color: #888;
  margin: 5px;
`;

const HeadingContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const NewArticleForm = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 10px;
`;

const NewArticleTitle = styled.TextInput`
  font-size: 18px;
  color: #555;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const NewArticleContent = styled.TextInput`
  color: #666;
  padding: 10px;
  border: 1px solid #ccc;
  height: 100px;
`;

// Articles Component
const Articles = ({navigation, scrollToId}) => {
  const {socketArticle, setArticleId} = useContext(ArticleContext);
  const [articles, setArticles] = useState([]);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');

  useEffect(() => {
    if (socketArticle) {
      setArticles(state => [...state, socketArticle]);
    }
  }, [socketArticle]);

  useEffect(() => {
    const promise = axios.get(API_URL + '/api/article');
    promise.then(response => {
      setArticles(response.data.articles);
    });
  }, []);

  const handleAddArticle = async () => {
    if (newArticleTitle.trim() === '') {
      return;
    }

    const newArticle = {
      title: newArticleTitle,
      content: newArticleContent,
    };

    const response = await axios.post(API_URL + '/api/article', newArticle);

    setNewArticleTitle('');
    setNewArticleContent('');
  };

  const handleClickArticle = async articleId => {
    setArticleId(articleId);
    navigation.navigate('Article Details');
  };

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setEnabled(true);
    return () => {
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const renderItem = ({item: article}) => (
    <TouchableOpacity
      id={`${article.id}`}
      onPress={handleClickArticle.bind(this, article.id)}>
      <ArticleItem>
        <ArticleTitle>{article.title}</ArticleTitle>
        <HeadingContainer>
          <ArticleAuthorDetails>{article.username}</ArticleAuthorDetails>
          <ArticleDateDetails>{article.time}</ArticleDateDetails>
        </HeadingContainer>
        <Image
          source={{uri: article.image}}
          style={{width: '100%', height: 200}}
        />
        {scrollToId == article.id && console.log(article.id)}
      </ArticleItem>
    </TouchableOpacity>
  );

  return (
    <Container>
      <AvoidSoftInputView>
        <RedirectNavigator />
        <FlatList
          ListHeaderComponent={<Title>Articles</Title>}
          data={articles.reverse()}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'key-' + item.id}
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

export default Articles;
