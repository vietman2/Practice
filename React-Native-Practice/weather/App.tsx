import { StyleSheet, View } from "react-native";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useState, useEffect } from "react";

import Weather from "./Components/Weather";

const API_KEY_2 = "";

export default function App() {
  const [permission, setPermission] = useState<boolean>(false);

  const getPermission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("위치 정보를 허용해주세요.");
      return;
    } else {
      setPermission(true);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  if (!permission) return null;
  else {
    return (
      <View style={styles.container}>
        <Weather API_KEY={API_KEY_2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
});
