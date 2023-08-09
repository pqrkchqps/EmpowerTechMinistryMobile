import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
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
  margin-bottom: 10px;
`;

const ServiceItem = styled.View`
  margin-bottom: 10px;
`;

const ServiceTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const ServiceDescription = styled.Text`
  color: #666;
`;

// Services Component
const Services = ({navigation, route}) => {
  const {handleLogout} = route.params;
  return (
    <Container>
      <Header navigation={navigation} handleLogout={handleLogout} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Title>Our Services</Title>

          <ServiceItem>
            <ServiceTitle>Innovative Web Apps</ServiceTitle>
            <ServiceDescription>
              Experience the future of web applications with our innovative and
              dynamic solutions, designed to engage users and deliver seamless
              experiences.
            </ServiceDescription>
          </ServiceItem>

          <ServiceItem>
            <ServiceTitle>Mobile Apps that Wow</ServiceTitle>
            <ServiceDescription>
              Stand out in the app market with our striking and feature-rich
              mobile applications, built for various platforms to reach a
              broader audience.
            </ServiceDescription>
          </ServiceItem>

          <ServiceItem>
            <ServiceTitle>Web Development with Purpose</ServiceTitle>
            <ServiceDescription>
              Our websites are not just visually appealing; they are
              strategically optimized to drive traffic, generate leads, and
              convert visitors into loyal customers.
            </ServiceDescription>
          </ServiceItem>

          <ServiceItem>
            <ServiceTitle>Data-driven Solutions</ServiceTitle>
            <ServiceDescription>
              Harness the power of data with our analytics and business
              intelligence solutions, enabling you to make informed decisions
              and stay ahead of the competition.
            </ServiceDescription>
          </ServiceItem>

          <ServiceItem>
            <ServiceTitle>Digital Marketing Mastery</ServiceTitle>
            <ServiceDescription>
              Elevate your online presence with our expert digital marketing
              strategies, including targeted ads on platforms like Google and
              Facebook.
            </ServiceDescription>
          </ServiceItem>
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

export default Services;
