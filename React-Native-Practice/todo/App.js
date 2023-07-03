import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";

import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const travel = async () => {
    setWorking(false);

    try {
      const jsonValue = JSON.stringify(working);
      
      await AsyncStorage.setItem("@working", jsonValue);
      console.log(jsonValue, "has to be false");
    } catch (e) {
      console.log(e);
    }
  };
  const work = async () => {
    setWorking(true);

    try {
      const jsonValue = JSON.stringify(working);
      
      await AsyncStorage.setItem("@working", jsonValue);
      console.log(jsonValue, "has to be true");
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeText = (payload) => setText(payload);
  const addTodo = async () => {
    if (text === "") return;

    const newTodos = { ...todos, [Date.now()]: { text, working, completed: false } };
    setTodos(newTodos);
    await storeData(newTodos);

    setText("");
  };
  const deleteTodo = async (id) => {
    Alert.alert("Delete Todo", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await storeData(newTodos);
        },
      },
    ]);
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@todos", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@todos");
      setTodos(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.log(e);
    }
    try {
      const jsonValue = await AsyncStorage.getItem("@working");
      console.log("saved", jsonValue)
      setWorking(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleDone = async (id) => {
    const newTodos = { ...todos };
    newTodos[id].completed = !newTodos[id].completed;
    setTodos(newTodos);
    await storeData(newTodos);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.buttonText,
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.buttonText,
              color: working ? theme.grey : "white",
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        onChangeText={onChangeText}
        returnKeyType="done"
        onSubmitEditing={addTodo}
      />
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View key={key} style={styles.todo}>
              {todos[key].completed ? (
                <Text
                  style={{
                    ...styles.todoText,
                    textDecorationLine: "line-through",
                    color: theme.grey,
                  }}
                >
                  {todos[key].text}
                </Text>
              ) : (
                <Text
                  style={styles.todoText}
                >
                  {todos[key].text}
                </Text>
              )}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => toggleDone(key)}
                  style={{ marginEnd: 10 }}
                >
                  <Fontisto name="check" size={18} color={theme.grey} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => {}}/>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  buttonText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 30,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.todoBackground,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
