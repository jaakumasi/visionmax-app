// import React from "react";
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { showProfileMenu_atom } from "../_shared/state";

export default function HeaderComponent() {
  const [showProfileMenu, setShowProfileMenu] = useAtom(showProfileMenu_atom);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.menuText}>Menu</Text>
      <TouchableOpacity
        style={styles.user}
        onPress={() => setShowProfileMenu(!showProfileMenu)}
      >
        <FontAwesome5 name="user" size={22} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: Dimensions.get("screen").width / 9,
    paddingLeft: 5,
  },
  menuText: {
    fontSize: 18,
  },
  user: {},
});
