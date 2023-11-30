import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';

import styled from 'styled-components/native';
import RedirectNavigator from './RedirectNavigator';

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

const EmailText = styled.Text`
  font-size: 16px;
  color: tomato;
`;

const MeetingText = styled.Text`
  font-size: 26px;
  color: tomato;
`;



// Contact Component
const Contact = ({navigation}) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@empowertechministry.com')
  };

  const handleMeetingPress = () => {
    navigation.navigate('Meeting')
  };

  return (
    <Container>
      <RedirectNavigator />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Title>Contact Us</Title>
          <ContactInfo>
            <ContactItem>
              <TouchableOpacity onPress={handleEmailPress}>
                <EmailText>Email: info@empowertechministry.com</EmailText>
              </TouchableOpacity>
            </ContactItem>
            <ContactItem>
              <TouchableOpacity onPress={handleMeetingPress}>
                <MeetingText>Schedule a Google Meet</MeetingText>
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
