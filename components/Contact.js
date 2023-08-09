import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
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

const ContactInfo = styled.View`
  margin-top: 20px;
`;

const ContactItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ContactIcon = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const ContactText = styled.Text`
  font-size: 16px;
  color: #555;
`;

// Contact Component
const Contact = ({navigation, route}) => {
  const {handleLogout} = route.params;
  const handlePhonePress = () => {
    // Implement phone call functionality here
  };

  const handleEmailPress = () => {
    // Implement email sending functionality here
  };

  return (
    <Container>
      <Header navigation={navigation} handleLogout={handleLogout} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Title>Contact Us</Title>
          <ContactInfo>
            <ContactItem>
              <TouchableOpacity onPress={handlePhonePress}>
                <ContactText>Phone: (507) 621-2111</ContactText>
              </TouchableOpacity>
            </ContactItem>
            <ContactItem>
              <TouchableOpacity onPress={handleEmailPress}>
                <ContactText>Email: info@empowertechministry.com</ContactText>
              </TouchableOpacity>
            </ContactItem>
          </ContactInfo>
          <Text>
            Have questions or need more information? Feel free to reach out to
            us using the contact details above. We'd love to hear from you and
            assist you in any way we can.
          </Text>
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

export default Contact;
