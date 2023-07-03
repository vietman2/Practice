import { StyleSheet, View, Text, Button } from "react-native";
import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [specialCount, setSpecialCount] = useState(0);

  useEffect(() => {
    console.log("count값 변경됨.");
  }, [count]);

  return (
    <View style={styles.container}>
      <Text>Count: {count}</Text>
      <Text>Special Count: {specialCount}</Text>
      <Button title="증가" onPress={() => setCount(count + 1)} />
      <Button title="감소" onPress={() => setCount(count - 1)} />
      <Button title="초기화" onPress={() => setCount(0)} />
      <Button title="Special" onPress={() => setSpecialCount(specialCount + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
