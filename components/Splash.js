import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Video from 'react-native-video';
import rocketTakeOff from '../images/rocket_takeoff.mp4';

import {Dimensions} from 'react-native';

const window = Dimensions.get('window');
const parentHeight =
  window.height > window.width ? window.height : window.width;

export function WithSplashScreen({children, isAppReady}) {
  return (
    <>
      <Splash isAppReady={isAppReady} children={children} />
    </>
  );
}

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export const Splash = ({isAppReady, children}) => {
  const position = useSharedValue(-9 * parentHeight);
  const opacityRocket = useSharedValue(0);
  const [state, setState] = useState(LOADING_IMAGE);

  const fadeInStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityRocket.value,
    };
  });

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      opacityRocket.value = withTiming(
        1,
        {
          duration: 500,
        },
        () => {
          runOnJS(setState)(WAIT_FOR_APP_TO_BE_READY);
        },
      );
    }
  }, [state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setTimeout(() => {
          setState(FADE_OUT);
        }, 4000);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      opacityRocket.value = withTiming(
        0,
        {
          duration: 500,
          easing: Easing.in(Easing.cubic),
        },
        () => {
          runOnJS(setState)(HIDDEN);
        },
      );
    }
  }, [state]);

  console.log(state);
  if (state === HIDDEN) return <>{children}</>;

  return (
    <View style={style.container}>
      <Animated.View
        collapsable={false}
        style={[style.imageContainer, fadeInStyle]}>
        <Video
          source={require('../images/rocket_takeoff2.mp4')}
          style={style.image}
          paused={false}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageRocket: {
    height: parentHeight,
    width: parentHeight,
  },
  imageContainer: {
    height: parentHeight,
    width: parentHeight,
  },
});
