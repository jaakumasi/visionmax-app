import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  Button,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { SCREENS } from "../_shared/constants";

/* 
    0: features only accessible after login
    1: features accessible without auth
*/
const noAuthoptions = [{ screen: SCREENS.HEADCOUNT, icon: "bars" }];
const authOptions = [
  { screen: SCREENS.VERIFICATION, icon: "check" },
  { screen: SCREENS.ATTENDANCE, icon: "clipboard" },
  ...noAuthoptions,
];

export default function MenuOptions({ isLoggedIn, navigation }) {
  //   const menuOptions = options[isLoggedIn ? 0 : 1].map((option, idx) => (
  // const options = isLoggedIn ? authOptions : noAuthoptions;
  const options = authOptions;
  const menuOptions = options.map((option, idx) => (
    <TouchableOpacity
      style={styles.menuOptionContainer}
      onPress={() => navigation.navigate(option.screen)}
      key={idx}
    >
      {/* menu option icon */}
      <View
        style={[
          styles.menuOptionIconContainer,
          option.screen === SCREENS.HEADCOUNT ? styles.headCountIcon : {},
        ]}
      >
        <FontAwesome5 name={option.icon} size={26} />
      </View>

      <Text style={styles.menuOptionText}>{option.screen}</Text>
    </TouchableOpacity>
  ));

  return <View style={styles.container}>{menuOptions}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headCountIcon: {
    transform: [{ rotate: "90deg" }],
  },
  menuOptionContainer: {
    width: "90%",
    padding: 15,
    marginTop: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#666666",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuOptionIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DFDFDF",
  },
  menuOptionText: {
    marginTop: 15,
    fontSize: 16,
  },
});
