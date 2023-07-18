import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function Verification({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [faces, setFaces] = useState([]);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      setHasPermission((await Camera.requestCameraPermissionsAsync()).granted);
    })();
  }, []);

  useEffect(() => {}, []);

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const sendImageData = async (base64) => {
    try {
      const response = await fetch(
        // "https://fastapi-demo-ty9z.onrender.com/image",
        "http://192.168.43.11:8000/image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64_image: base64,
          }),
        }
      );
      const data = await response.json();
      console.log("server: ", data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFacesDetected = async ({ faces }) => {
    setFaces(faces);

    if (faces.length > 0) {
      const face = faces[0];
      const faceBounds = face.bounds;
      const {
        origin: { x, y },
        size: { width, height },
      } = faceBounds;

      // try {
      //   const shot = await cameraRef.current.takePictureAsync({
      //     quality: 0.5,
      //     skipProcessing: true,
      //     base64: true
      //   });

      // const cropResult = await manipulateAsync(
      //   shot.uri,
      //   [
      //     {
      //       crop: {
      //         originX: x,
      //         originY: y,
      //         width: width,
      //         height: height,
      //       },
      //     },
      //   ],
      //   { compress: 1, format: SaveFormat.JPEG, base64: true }
      // );

      // console.log('shot uri: ', shot.base64);

      //   sendImageData(cropResult.base64);
      // } catch (error) {
      //   console.log(error.message);
      // }
    }
  };

  const handleShot = async () => {
    try {
      const shot = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
        base64: true,
      });

      sendImageData(shot.base64);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        type={cameraType}
        style={styles.camera}
        // flashMode={FlashMode.off}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          landmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        }}
      >
        {/* <View style={styles.flipBtn}>
          <Button title="flip cam" onPress={toggleCameraType} />
        </View> */}
        {/* <View style={styles.flipBtn}>
          <Button title="take shot" onPress={handleShot} />
        </View> */}
        <View style={styles.facesContainer}>
          {faces.map((face, index) => (
            <View
              key={index}
              style={[
                styles.face,
                {
                  left: face.bounds.origin.x,
                  top: face.bounds.origin.y,
                  width: face.bounds.size.width,
                  height: face.bounds.size.height,
                },
              ]}
            />
          ))}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: "9/16",
    // justifyContent: "center",
    // alignItems: "center",
  },
  flipBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
  },
  facesContainer: {
    flex: 1,
    // position: "absolute",
    // bottom: 0,
    // right: 0,
    // left: 0,
    // top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  face: {
    borderWidth: 2,
    borderColor: "cyan",
    position: "absolute",
    backgroundColor: "transparent",
  },
});
