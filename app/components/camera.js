import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import useNetworkStatus from "./networkStatus";

export default function CameraComponent() {
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [faces, setFaces] = useState([]); // an array of objects with face locations
  /* 
    Counts the number of times a face(s) is detected for accuracy sake
    Note: It does not store a count of the detected faces
  */
  const [detectionCount, setDetectionCount] = useState(0);
  const [isProcessingShot, setIsProcessingShot] = useState(true);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [singleFaceDetected, setSingleFaceDetected] = useState(false);
  const [recognitionData, setRecognitionData] = useState({});
  const [takeShot, setTakeShot] = useState(false);
  // network status
  const isOnline = useNetworkStatus();

  const cameraRef = useRef(null);

  useEffect(() => {
    if (detectionCount >= 3) {
      setTakeShot(true);
    }
  }, [detectionCount]);

  useEffect(() => {
    if (faces.length === 1) setSingleFaceDetected(true);
    else setSingleFaceDetected(false);
  }, [faces]);

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

    if (faces.length === 1 && !takeShot && !isProcessingShot)
      setDetectionCount((current) => ++current);
    if (takeShot) handleShot();
  };

  const handleShot = async () => {
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
  };

  const handleCloseProcessingOutput = () => {
    setIsProcessingShot(false);
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

        {/* Results screen after face is processed */}
        <View style={styles.toastContainer}>
          <Toast
            faces={faces}
            isProcessingShot={isProcessingShot}
            isOnline={isOnline}
          />
        </View>
      </Camera>
    </View>
  );
}

// <Results
//   data={recognitionData}
//   handleCloseProcessingOutput={handleCloseProcessingOutput}
// />

function Results({ data, handleCloseProcessingOutput }) {
  return (
    <View style={styles.processingOutput}>
      <View style={styles.matchImageContainer}>
        <Image
          source={require("../../assets/login_bg.jpg")}
          style={styles.matchImage}
        />
      </View>

      <Text style={styles.details}>{data.name}</Text>
      <Text style={styles.details}>{data.index}</Text>
      <Text style={styles.details}>{data.programme}</Text>

      <TouchableOpacity
        style={styles.closeProcessingOutput}
        onPress={handleCloseProcessingOutput}
      >
        <Text style={styles.times}>&times;</Text>
      </TouchableOpacity>
    </View>
  );
}

function Toast({ faces, isProcessingShot, isOnline }) {
  const toastMessage = [
    "Currently offline!", // 0
    "Multiple faces detected. Only one is allowed", // 1
    "No face detected", // 2
    "Processing...", // 3
  ];

  const numOfFaces = faces.length;

  return (
    <View>
      <Text style={[styles.toastMessage, !isOnline ? { color: "red" } : {}]}>
        {
          !isOnline
            ? toastMessage[0] // offline
            : numOfFaces === 0
            ? toastMessage[2] // no face detected
            : numOfFaces === 1 && isProcessingShot
            ? toastMessage[3] // processing
            : toastMessage[1] // multiple faces detected
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    aspectRatio: "9/16",
  },
  closeProcessingOutput: {
    position: "absolute",
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 5,
    backgroundColor: "#2196F3",
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: "#F0F0F0",
    width: "90%",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
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
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  matchImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#666666",
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  processingOutput: {
    position: "absolute",
    alignItems: "center",
    height: "60%",
    padding: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  times: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  toastContainer: {
    bottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    backgroundColor: "#666666AA",
    borderRadius: 5,
  },
  toastMessage: {
    color: "white",
  },
});
