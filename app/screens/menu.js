import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAtom } from "jotai";
import { DATA, SCREENS } from "../_shared/constants";
import MenuOptions from "../components/menuOptions";
import { showProfileMenu_atom } from "../_shared/state";

export default function MenuScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useAtom(showProfileMenu_atom);

  useEffect(() => {
    (async () => {
      const data = JSON.parse(await AsyncStorage.getItem(DATA));
      setUser(data.data.name);
      setIsLoggedIn(data.data.logged_in === "1" ? true : false);
    })();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem(DATA);
    setShowProfileMenu(false);
    navigation.navigate(SCREENS.LOGIN);
  };

  return (
    <ImageBackground
      source={require("../../assets/login_bg.jpg")}
      style={styles.container}
    >
      <MenuOptions isLoggedIn={isLoggedIn} navigation={navigation} />

      {/* profile menu */}
      {showProfileMenu ? (
        <View style={styles.profileMenu}>
          <Text style={styles.profileOption}>{user}</Text>
          <Text style={styles.profileOption} onPress={handleSignOut}>
            Sign out {"  "}
            <FontAwesome name="sign-out" color="red" size={15} />
          </Text>
        </View>
      ) : (
        <></>
      )}
    </ImageBackground>
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
  profileMenu: {
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    right: 20,
    borderRadius: 5,
  },
  profileOption: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#BDBDBDAA",
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 40,
  },
});
