import { Dimensions, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HeaderComponent() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.menuText}>Menu</Text>
      <TouchableOpacity style={styles.user}>
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
