import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {FaBars} from 'react-icons/fa';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

const SiteHeader = styled.View`
  padding: 0px;
  height: 100px;
`;

const Navul = styled.View`
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0px;
  align-items: center;
`;

const Navli = styled.View`
  padding: 12px;
  width: 100px;
  margin: 16px;
  height: 44px;
  font-size: 32px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const P = styled.Text``;

function Header({navigation, handleLogout}) {
  const [useHam, setUseHam] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const handleHam = e => {
    setUseHam(!useHam);
    setHasOpened(true);
    setIsClosing(true);
    setTimeout(function () {
      setIsClosing(false);
    }, 1000);
  };

  return (
    <SiteHeader>
      <Navul>
        <Navli onStartShouldSetResponder={() => navigation.navigate('Home')}>
          <P>Home</P>
        </Navli>
        <Navli
          name="Threads"
          onStartShouldSetResponder={() => navigation.navigate('Threads')}>
          <P>Threads</P>
        </Navli>
        <Navli
          name="Contact"
          onStartShouldSetResponder={() => navigation.navigate('Contact')}>
          <P>Contact</P>
        </Navli>
        <Navli
          name="About"
          onStartShouldSetResponder={() => navigation.navigate('About')}>
          <P>About</P>
        </Navli>
        <Navli name="Logout" onStartShouldSetResponder={() => handleLogout()}>
          <P>Logout</P>
        </Navli>
      </Navul>
    </SiteHeader>
  );
}

export default Header;
