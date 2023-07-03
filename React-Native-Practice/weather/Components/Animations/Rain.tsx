import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

export default function Rain() {
  const rainFall = useRef(new Animated.Value(0)).current;
  const rainFallInterpolate = rainFall.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get("window").height],
  });

  const rainSwing = useRef(new Animated.Value(0)).current;
  const rainSwingInterpolate = rainSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: [0, 0],
  });

  const xPosition = `${getRandomInt(0, 100)}%`;

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const runAnimation = () => {
    Animated.sequence([
      Animated.timing(rainFall, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
        rainFall.setValue(0);
        runAnimation();
    });
  };

  useEffect(() => {
    runAnimation();
  }, []);

  const rainStyle = {
    left: xPosition,
    transform: [
      { translateY: rainFallInterpolate },
      { translateX: rainSwingInterpolate },
    ],
  };

  return <Animated.View style={[styles.rain, rainStyle]} />;
}

const styles = StyleSheet.create({
  rain: {
    position: "absolute",
    top: 0,
    width: 1,
    height: 30,
    backgroundColor: "#ffffff",
  },
});
