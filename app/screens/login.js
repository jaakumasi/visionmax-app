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

export default function LoginScreen({ navigation, route }) {
  const handleLogin = () => {
    navigation.navigate(SCREENS.MENU);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.authenticationLabel}>Authentication</Text>
      <TextInput style={styles.input} placeholder="Staff ID" />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry={true}
      />
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          Please login to access certain features, otherwise{" "}
          <TouchableOpacity>
            <Text style={styles.continue}>continue</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  authenticationLabel: {
    fontSize: 30,
    marginBottom: 40,
  },
  continue: {
    textDecorationLine: "underline",
    color: "#00BFA5",
  },
  info: {
    textAlign: "center",
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 80,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    backgroundColor: "#CFD8DC",
  },
  input: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#00BFA5",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    width: "80%",
    fontSize: 16,
  },
  loginButtonContainer: {
    width: "80%",
    padding: 10,
    backgroundColor: "#00BFA5",
    borderRadius: 10,
  },
  loginButton: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
});
