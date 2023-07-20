import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CameraPermission({ handleGrantPermission }) {
  return (
    <View style={styles.container}>
      <View style={styles.grantPermissionContainer}>
        <Text style={[styles.permissionText, { fontWeight: "bold" }]}>
          To use feature, please grant permission
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={handleGrantPermission}
        >
          <Text style={styles.permissionText}>Grant permission</Text>
        </TouchableOpacity>
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
    width: "100%",
  },
  grantPermissionContainer: {
    backgroundColor: "#C0C0C0",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  permissionBtn: {
    width: "100%",
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: "#388E3C",
    marginTop: 20,
    borderRadius: 5,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
  },
});
