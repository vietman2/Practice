import { Animated, StyleSheet, Dimensions, Easing } from "react-native";
import { useEffect, useRef } from "react";

const SNOWFLAKE_TYPES = ["❄", "❆", "❇"];

export default function Snow() {
  const type = SNOWFLAKE_TYPES[getRandomInt(0, 3)];

  const snowFall = useRef(new Animated.Value(0)).current;
  const snowFallInterpolate = snowFall.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get("window").height],
  });

  const snowSwing = useRef(new Animated.Value(0)).current;
  const snowSwingInterpolate = snowSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: [-getRandomInt(0, 100), getRandomInt(0, 100)],
  });

  const snowRotate = useRef(new Animated.Value(0)).current;
  const snowRotateInterpolate = snowRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const opacity = getRandomInt(4, 10) / 10;
  const xPosition = `${getRandomInt(0, 100)}%`;
  const fallDuration = getRandomInt(5000, 15000);

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const runAnimation = () => {
    snowRotate.setValue(0);

    Animated.loop(
      Animated.timing(snowRotate, {
        toValue: 1,
        duration: getRandomInt(2000, 10000),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.sequence([
      Animated.timing(snowFall, {
        toValue: 1,
        duration: fallDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      snowFall.setValue(0);
      runAnimation();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(snowSwing, {
          toValue: 1,
          duration: getRandomInt(3000, 8000),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    runAnimation();
  }, []);

  const snowFallStyle = {
    left: xPosition,
    opacity: opacity,
    transform: [
      { translateY: snowFallInterpolate },
      { translateX: snowSwingInterpolate },
      { rotate: snowRotateInterpolate },
    ],
  };

  return (
    <Animated.Text style={[styles.snow, snowFallStyle]}>{type}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  snow: {
    color: "white",
    position: "absolute",
  },
});
