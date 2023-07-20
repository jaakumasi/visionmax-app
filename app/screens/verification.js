import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { Camera } from "expo-camera";
import CameraComponent from "../components/camera";
import CameraPermission from "../components/cameraPermission";

export default function Verification({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);

  const handleGrantPermission = async () => {
    setHasPermission((await Camera.requestCameraPermissionsAsync()).granted);
  };

  useEffect(() => {
    handleGrantPermission();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <CameraComponent />
      ) : (
        <CameraPermission handleGrantPermission={handleGrantPermission} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight + 10,
  },
});
