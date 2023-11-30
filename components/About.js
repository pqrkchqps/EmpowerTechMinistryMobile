import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import RedirectNavigator from './RedirectNavigator';


// Styled components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const Brand = styled.View`
  align-items: center;
  margin-bottom: 20px;
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

const Section = styled.View`
  margin-top: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SectionDescription = styled.Text`
  font-size: 16px;
  color: #333;
  line-height: 24px;
  margin-bottom: 20px;
`;

// About Component
const About = ({}) => {
  return (
    <Container>
      <RedirectNavigator/>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Brand>
            <Title>Empower Tech Ministry</Title>
            <Subtitle>Igniting Your Digital Potential</Subtitle>
          </Brand>

          <Section>
            <SectionTitle>Why Choose Empower Tech Ministry?</SectionTitle>
            <SectionDescription>
              At Empower Tech Ministry, we are driven by a singular vision: to
              empower individuals like you to excel in the world of web
              development and digital entrepreneurship. We believe that technology
              has the power to transform careers and launch businesses, and we're
              here to make that transformation a reality for you.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Experience the Power of Empowerment</SectionTitle>
            <SectionDescription>
              We understand the challenges and opportunities of the digital age.
              Our mission is to equip you with the skills, knowledge, and support
              you need to succeed. Whether you're looking to launch a new career in
              coding or elevate your business through cutting-edge web services,
              we're committed to your success.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Our Services</SectionTitle>
            <SectionDescription>
              - Coding Career Launch: Unlock your coding potential with our Coding
              Career Launch program. We offer a transformative journey into the
              world of web development, guaranteeing job placement upon completion.
              {'\n'}- Web Services for Business Growth: Elevate your online
              presence and business potential with our comprehensive web services.
              We craft websites, mobile apps, and data-driven solutions that are
              not just visually stunning but strategically optimized for success.
              {'\n'}- Digital Marketing Mastery: Stay ahead in the digital
              landscape with our expert digital marketing strategies. We'll help
              you reach your target audience through platforms like Google and
              Facebook.
            </SectionDescription>
          </Section>
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

export default About;
