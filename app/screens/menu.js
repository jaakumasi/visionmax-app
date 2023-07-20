import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGGED_IN, SCREENS } from "../_shared/constants";
import MenuOptions from "../components/menuOptions";

export default function MenuScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   console.log(isLoggedIn);
  // }, [isLoggedIn]);

  useEffect(() => {
    (async () => {
      const logInValue = await AsyncStorage.getItem(LOGGED_IN);
      setIsLoggedIn(logInValue === "1" ? true : false);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <MenuOptions isLoggedIn={isLoggedIn} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background: "linear-gradient(45deg, 'red', 'yellow')",
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
  },
});
