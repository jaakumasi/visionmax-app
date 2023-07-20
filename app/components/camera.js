import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Button, StatusBar } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function CameraComponent() {
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [faces, setFaces] = useState([]);
  /* 
    Counts the number of times a face(s) is detected for accuracy sake
    Note: It does not store a count of the detected faces
  */
  const [detectionCount, setDetectionCount] = useState(0);
  const [isProcessingShot, setIsProcessingShot] = useState(false);
  const [takeShot, setTakeShot] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    if (detectionCount >= 3) {
      setTakeShot(true);
    }
  }, [detectionCount]);

  const sendImageData = async (base64) => {
    setIsProcessingShot(true);

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
      setIsProcessingShot(false);

      const data = await response.json();
      //   console.log("server: ", data);
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
    }

    if (!takeShot && !isProcessingShot)
      setDetectionCount((current) => ++current);
    else takeShot;
  };

  const handleShot = async () => {
    if (takeShot) {
      try {
        const shot = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          skipProcessing: true,
          base64: true,
        });
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

        setTakeShot(false);
        sendImageData(shot.base64);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <View>
      <Camera
        ref={cameraRef}
        type={cameraType}
        style={styles.camera}
        ratio="16:9"
        flashMode={FlashMode.off}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          landmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        }}
      >
        {/* <View style={styles.flipBtn}>
          <Button title="flip cam" onPress={toggleCameraType} />
        </View> */}
        <View style={styles.flipBtn}>
          <Button title="take shot" onPress={handleShot} />
        </View>
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
  camera: {
    flex: 1,
    aspectRatio: "9/16",
  },
  flipBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
  },
  facesContainer: {
    flex: 1,
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
