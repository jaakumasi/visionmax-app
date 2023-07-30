import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Keyboard,
} from "react-native";
import useNetworkStatus from "../components/networkStatus";
import {
  DATA,
  SCREENS,
  SERVER_URL,
  TOAST_MESSAGES,
} from "../_shared/constants";

export default function LoginScreen({ navigation }) {
  const [id, setID] = useState(null);
  const [password, setPassword] = useState(null);
  const [invalidIDInputMessage, setInvalidIDInputMessage] = useState("");
  const [invalidPasswordInputMessage, setInvalidPasswordInputMessage] =
    useState("");
  const [isLogginIn, setIsLoggingIn] = useState(false);
  // network access
  const isOnline = useNetworkStatus();

  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const handleContinue = async () => {
    await AsyncStorage.setItem(DATA, "0"); // 1 for logged in: 0 otherwise
    navigation.navigate(SCREENS.NO_AUTH_MENU);
  };

  const handleLogin = async () => {
    console.log('isOnline: ', isOnline)
    /* login button is only functional when there's no error messages, meaning Id & password are set
       and a login has not already been triggered
    */
    if (id && password && !isLogginIn) {
      setIsLoggingIn(true);
      Keyboard.dismiss();

      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "applicaion/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await response.json();

      if (data.success) {
        handleLoginSuccess(data);
      } else {
        ToastAndroid.show(TOAST_MESSAGES.INVALID_CRED, ToastAndroid.SHORT);
        setIsLoggingIn(false);
      }
    } else if (!isOnline) { // if offline
      ToastAndroid.show(TOAST_MESSAGES.OFFLINE, ToastAndroid.SHORT)
    } else {  
      ToastAndroid.show(TOAST_MESSAGES.FILL_ALL_FIELDS, ToastAndroid.SHORT);
    }
  };

  const handleLoginSuccess = async (data) => {
    data.logged_in = "1";
    await AsyncStorage.setItem(DATA, JSON.stringify(data)); // 1 for logged in: 0 otherwise

    navigation.navigate(SCREENS.MENU);
    setIsLoggingIn(false);
    setID(null);
    setPassword(null);
    idRef.current.clear();
    passwordRef.current.clear();
  };

  const handleIDChange = (newID) => {
    setID(null);

    if (!newID) setInvalidIDInputMessage("required");
    else if (newID && newID.toString().length != 7)
      setInvalidIDInputMessage("must be equal to 7 digits");
    else {
      setInvalidIDInputMessage("");
      setID(newID);
    }
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(null);

    if (!newPassword) setInvalidPasswordInputMessage("required");
    else if (newPassword && newPassword.length < 6)
      setInvalidPasswordInputMessage("password too short");
    else {
      setInvalidPasswordInputMessage("");
      setPassword(newPassword);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/login_bg.jpg")}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <Text style={styles.authenticationLabel}>Authentication</Text>
      {/* staff id input */}
      <TextInput
        ref={idRef}
        style={[
          styles.input,
          !invalidIDInputMessage ? {} : styles.nullInput, // flag input as red if input is null or has digits != 7
        ]}
        placeholder="staff ID"
        onChangeText={handleIDChange}
        keyboardType="numeric"
      />
      {/* invalid input message */}
      <Text style={styles.invalidInputText}>{invalidIDInputMessage}</Text>

      {/* password input */}
      <TextInput
        ref={passwordRef}
        style={[
          styles.input,
          !invalidPasswordInputMessage ? {} : styles.nullInput,
        ]}
        placeholder="password"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
      />
      {/* invalid input message */}
      <Text style={styles.invalidInputText}>{invalidPasswordInputMessage}</Text>
      {/* login button */}
      <View
        style={[
          styles.loginButtonContainer,
          isLogginIn ? styles.loginButtonContainerLogginIn : {},
        ]}
      >
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginButton}>
            {isLogginIn ? "Loggin in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* divider */}
      <View style={styles.divider}></View>

      {/* continue without login info */}
      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          {/* Please login to access certain features, otherwise{" "} */}
          Want to continue without logging in? Some features will be unavailable
        </Text>
      </View>
      {/* continue button */}
      <View
        style={[
          styles.loginButtonContainer,
          { marginTop: 20, backgroundColor: "#0091EA" },
        ]}
      >
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.loginButton}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authenticationLabel: {
    fontSize: 30,
    marginBottom: 40,
  },
  continue: {
    textDecorationLine: "underline",
    color: "#00BFA5",
  },
  divider: {
    width: "85%",
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "#BDBDBDAA",
    marginTop: 40,
  },
  info: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
  infoContainer: {
    marginTop: 40,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    backgroundColor: "#BDBDBD",
  },
  input: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#00BFA5",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    width: "80%",
    fontSize: 16,
    backgroundColor: "white",
  },
  invalidInputText: {
    width: "75%",
    textAlign: "left",
    marginBottom: 10,
    color: "#D50000",
  },
  loginButtonContainer: {
    width: "80%",
    padding: 10,
    backgroundColor: "#00BFA5",
    borderRadius: 5,
    marginTop: 30,
  },
  loginButton: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
  loginButtonContainerLogginIn: {
    backgroundColor: "#AAAAAA",
  },
  nullInput: {
    borderColor: "#D50000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
