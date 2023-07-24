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

const toastMessages = [
  "Currently offline!", // 0
  "Multiple faces detected. Only one is allowed", // 1
  "No face detected", // 2
  "Verify", // 3
];

export default function CameraComponent() {
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [faces, setFaces] = useState([]); // an array of objects with face locations
  const [isProcessingShot, setIsProcessingShot] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [singleFaceDetected, setSingleFaceDetected] = useState(false);
  const [recognitionData, setRecognitionData] = useState({});
  const [noDataReturned, setNoDataReturned] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // network status
  const isOnline = useNetworkStatus();

  const cameraRef = useRef(null);

  useEffect(() => {
    setNoDataReturned(Object.keys(recognitionData).length === 0);
  }, [recognitionData]);

  useEffect(() => {
    const numOfFaces = faces.length;

    setToastMessage(
      !isOnline
        ? toastMessages[0] // offline
        : numOfFaces === 0
        ? toastMessages[2] // no face detected
        : numOfFaces === 1
        ? toastMessages[3] // verify
        : toastMessages[1] // multiple faces detected
    );

    if (numOfFaces === 1) setSingleFaceDetected(true);
    else setSingleFaceDetected(false);
  }, [faces]);

  const sendImageData = async (base64) => {
    setIsProcessingShot(true);
    const timeoutId = setTimeout(() => {
      setIsTimedOut(true);
      setIsProcessingComplete(true);
    }, 10000);

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

      clearTimeout(timeoutId);
      setIsProcessingComplete(true);
      setRecognitionData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFacesDetected = async ({ faces }) => {
    setFaces(faces);

    // console.log(
    //   "isOnline: ",
    //   isOnline,
    //   "single face detected: ",
    //   singleFaceDetected
    // );
  };

  const handleShot = async () => {
    console.log("taking shot...");

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
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {isProcessingShot ? (
        <Results
          recognitionData={recognitionData}
          noDataReturned={noDataReturned}
          isProcessingComplete={isProcessingComplete}
          isTimedOut={isTimedOut}
          setIsTimedOut={setIsTimedOut}
          setIsProcessingShot={setIsProcessingShot}
          setRecognitionData={setRecognitionData}
          setIsProcessingComplete={setIsProcessingComplete}
        />
      ) : (
        <Camera
          ref={cameraRef}
          type={cameraType}
          style={styles.camera}
          ratio="16:9"
          flashMode={FlashMode.on}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            landmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
          }}
        >
          {/* <View style={styles.flipBtn}>
          <Button title="flip cam" onPress={toggleCameraType} />
        </View> */}

          {/* show verification and bounding boxes when no shot is being processed */}

          <View style={styles.verify}>
            <Button
              title={toastMessage}
              onPress={handleShot}
              disabled={!(singleFaceDetected && isOnline)}
            />
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
      )}
    </View>
  );
}

function Results({
  recognitionData,
  noDataReturned,
  isTimedOut,
  setIsTimedOut,
  isProcessingComplete,
  setIsProcessingShot,
  setRecognitionData,
  setIsProcessingComplete,
}) {
  console.log("isProcessingComplete: ", isProcessingComplete);

  const handleCloseResults = () => {
    setIsProcessingShot(false);
    setRecognitionData({});
    setIsProcessingComplete(false);
    setIsTimedOut(false);
  };

  console.log("isTimedOut: ", isTimedOut);

  return (
    <View style={styles.resultsContainer}>
      {!isProcessingComplete ? ( // while processing is ongoing...
        <View style={styles.processingMessageContainer}>
          <Text style={styles.processingMessage}>Processing...</Text>
        </View>
      ) : isTimedOut ? ( // if timeout...
        <View style={styles.processingMessageContainer}>
          <Text style={styles.processingMessage}>Request Timed out!</Text>
          <CloseResultsBtn handleCloseResults={handleCloseResults} />
        </View>
      ) : noDataReturned ? ( // if processing is complete and no match is found...
        <View style={styles.processingMessageContainer}>
          <Text style={styles.processingMessage}>No match found!</Text>
          <CloseResultsBtn handleCloseResults={handleCloseResults} />
        </View>
      ) : (
        // if a match is found...
        <>
          <View style={styles.matchImageContainer}>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${recognitionData?.image}`,
              }}
              style={styles.matchImage}
            />
          </View>

          <Text style={styles.details}>{recognitionData?.name}</Text>
          <Text style={styles.details}>{recognitionData?.index_no}</Text>
          <Text style={styles.details}>{recognitionData?.programme}</Text>

          {/* <TouchableOpacity
            style={styles.hideResultsComponent}
            onPress={handleCloseResults}
          >
            <Text style={styles.times}>&times;</Text>
          </TouchableOpacity> */}
          <CloseResultsBtn handleCloseResults={handleCloseResults} />
        </>
      )}
    </View>
  );
}

function CloseResultsBtn({ handleCloseResults }) {
  return (
    <TouchableOpacity
      style={styles.hideResultsComponent}
      onPress={handleCloseResults}
    >
      <Text style={styles.times}>&times;</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    aspectRatio: "9/16",
    // justifyContent: "center",
    // alignItems: "center",
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#F0F0F0",
    width: "90%",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
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
  hideResultsComponent: {
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
  matchImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  matchImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  processingMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  processingMessage: {
    textAlign: "center",
    width: "90%",
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 5,
    backgroundColor: "black",
    color: "white",
  },
  resultsContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  times: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  verify: {
    position: "absolute",
    alignSelf: "center",
    bottom: 10,
    width: "90%",
    borderRadius: 5,
    backfaceVisibility: "hidden",
  },
});
