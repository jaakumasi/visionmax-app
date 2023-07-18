import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { SCREENS } from "../_shared/constants";

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(SCREENS.VERIFICATION)}>
        <Text style={styles.menuItem}>Verification</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.menuItem}>Take Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
  },
});
