import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function NoAuthHeaderComponent() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.menuText}>Menu</Text>
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
});
