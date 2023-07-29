import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function No_Auth_Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>...no auth menu...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
