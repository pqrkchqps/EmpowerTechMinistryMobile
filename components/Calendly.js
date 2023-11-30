const { useWindowDimensions } = require("react-native");
import { WebView } from 'react-native-webview';
import RedirectNavigator from './RedirectNavigator';


const Calendly = ({navigation, route}) => {
    let { width, height, scale } = useWindowDimensions();
    width = width
    height = height
    const calendly = {html: `
    <div class="calendly-inline-widget" data-url="https://calendly.com/johnacreps/60min" style="width:${width}px;height:${height}px;"></div>
    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
    `};

    const handleEmailPress = () => {
        // Implement email sending functionality here
    };

    const handleMeetingPress = () => {
        // Implement email sending functionality here
    };

    return (
        <>
            <RedirectNavigator/>
            <WebView
                scalesPageToFit={true}
                bounces={false}
                javaScriptEnabled
                style={{height: height, width: width*scale*1.3}}
                source={calendly}
                automaticallyAdjustContentInsets={false}
            />
        </>
    );
};

export default Calendly;