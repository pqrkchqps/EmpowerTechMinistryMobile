import React from "react";
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

function Footer() {
  const {width} = useWindowDimensions();
  const source = {
    html: `<footer>
      <h2>Empower Tech Ministry</h2>
      <div id="contact">
        <p>Address: 123 Legendary Street, Cityville, Country</p>
        <p>Phone: (555) 123-4567 </p>
        <p>Email: info@empowertechministry.com Social Media</p>
        <p>Icons: Facebook, Twitter, LinkedIn, Instagram</p>
      </div>
    </footer>
    `,
  };
  return <RenderHtml contentWidth={width} source={source} />;
}
export default Footer;
