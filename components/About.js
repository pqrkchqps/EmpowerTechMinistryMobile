import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import styled from 'styled-components/native';
import Header from './Header';

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
  margin-bottom: 20px;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: #555;
`;

// About Component
const About = ({navigation}) => {
  return (
    <Container>
      <Header navigation={navigation} />
      <Title>About Empower Tech Ministry</Title>
      <Subtitle>Our Vision: Assisting You in Reaching Your Dreams</Subtitle>
      <Description>
        At Empower Tech Ministry, we firmly believe that technology has the
        power to transform businesses and turn dreams into reality. Our vision
        is to be the driving force behind your success, providing you with the
        tools and expertise needed to achieve your goals.
      </Description>
      <Description>
        Our journey began with a small group of passionate tech enthusiasts who
        wanted to make a difference in the world of business. We realized that
        many businesses were struggling to keep up with the rapidly evolving
        digital landscape, and they needed a reliable partner to guide them
        through this transformative journey.
      </Description>
      <Description>
        With a shared passion for innovation and a customer-centric approach,
        Empower Tech Ministry was born. Since our inception, we have been
        committed to empowering businesses with cutting-edge tech solutions and
        expert guidance. We have witnessed numerous success stories, and nothing
        brings us more joy than seeing our customers reach their dreams and
        thrive in the digital age.
      </Description>
      <Description>
        Our team of skilled developers, designers, and digital marketing experts
        work collaboratively with you to understand your unique needs and
        challenges. We believe in forging strong partnerships with our clients,
        aligning our goals with yours, and celebrating your victories as if they
        were our own.
      </Description>
      <Description>
        Together, let's embark on a journey of growth and transformation. With
        Empower Tech Ministry by your side, the possibilities are endless, and
        your dreams are within reach.
      </Description>
    </Container>
  );
};

export default About;
