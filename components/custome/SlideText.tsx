import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

import {
  Dimensions
} from "react-native"

const width=Dimensions.get("screen").width;


export default function SlideText({value}:{value:string}){
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withRepeat(
          withSequence(
            withTiming(300, { duration: 1000 }), // Slide up
            withDelay(0, withTiming(200, { duration: 1000 })), // Slide down
            withDelay(0, withTiming(100, { duration: 1000 })),
            withDelay(0, withTiming(0, { duration: 1000 })),
            withDelay(0, withTiming(-100, { duration: 1000 })),
            withDelay(0, withTiming(-200, { duration: 1000 })),
            withDelay(0, withTiming(-300, { duration: 1000 })),
            withDelay(0, withTiming(-400, { duration: 1000 })),
            withDelay(0, withTiming(-500, { duration: 1000 })),
            // withDelay(1000, withTiming(0, { duration: 500 }))  // Return to start
          ),
          -1 // Repeat indefinitely
          ,false
        ),
      },
    ],
  }));

  return (
    <Animated.Text style={[{ width:"200%",color:"white",fontSize:20,fontWeight:"bold"},animatedStyles]}>
      {value}
    </Animated.Text>
  );
};