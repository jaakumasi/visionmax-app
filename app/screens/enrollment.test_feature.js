import React, { useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useNetworkStatus from "../components/networkStatus";
import { SERVER_URL, TOAST_MESSAGES } from "../_shared/constants";

export default function Enrollment() {
  const [index, setIndex] = useState(null);
  const [name, setName] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [invalidIndexInputMessage, setInvalidIndexInputMessage] = useState("");
  const [invalidNameInputMessage, setInvalidNameInputMessage] = useState("");
  const [invalidProgrammeInputMessage, setInvalidProgrammeInputMessage] =
    useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [showShotTaken, setShowShotTaken] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const isOnline = useNetworkStatus();

  const cameraRef = useRef(null);
  const nameInputRef = useRef(null);
  const indexInputRef = useRef(null);
  const programmeInputRef = useRef(null);

  const handleSubmit = async () => {
    if (index && name && programme && !isSubmitting) {
      setIsSubmitting(true);
      await fetch(`${SERVER_URL}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64_image: base64Image,
          name,
          index,
          programme,
        }),
      });

      ToastAndroid.show("Success", ToastAndroid.SHORT);
      resetToDefaults();
      setIsSubmitting(false);
    } else if (!isOnline) {
      // if offline
      ToastAndroid.show(TOAST_MESSAGES.OFFLINE, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(TOAST_MESSAGES.FILL_ALL_FIELDS, ToastAndroid.SHORT);
    }
  };

  const resetToDefaults = () => {
    setBase64Image("");
    setShowShotTaken(false);
    setName(null);
    setIndex(null);
    setProgramme(null);
    nameInputRef.current.clear();
    indexInputRef.current.clear();
    programmeInputRef.current.clear();
  };

  const handleTakeShot = async () => {
    const shot = await cameraRef.current.takePictureAsync({
      quality: 0.5,
      skipProcessing: true,
      base64: true,
    });
    // console.log(shot.base64);

    setBase64Image(shot.base64);
    setShowShotTaken(true);
    setShowCamera(false);
  };

  const handleIndexChange = (newIndex) => {
    setIndex(null);

    if (!newIndex) setInvalidIndexInputMessage("required");
    else if (newIndex && newIndex.toString().length != 7)
      setInvalidIndexInputMessage("must be equal to 7 digits");
    else {
      setInvalidIndexInputMessage("");
      setIndex(newIndex);
    }
  };

  const handleNameChange = (newName) => {
    setName(null);

    if (!newName) setInvalidNameInputMessage("required");
    else {
      setInvalidNameInputMessage("");
      setName(newName);
    }
  };

  const handleProgrammeChange = (newProgramme) => {
    setProgramme(null);

    if (!newProgramme) setInvalidProgrammeInputMessage("required");
    else {
      setInvalidProgrammeInputMessage("");
      setProgramme(newProgramme);
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  return (
    <>
      {showCamera ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          ratio="16:9"
          flashMode={FlashMode.off}
          type={cameraType}
        >
          <View style={styles.switchCam}>
            <FontAwesome
              name="camera"
              size={20}
              color="#0091EA"
              onPress={toggleCameraType}
            />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#00BFA5",
            }}
          >
            <TouchableOpacity onPress={handleTakeShot}>
              <View>
                <FontAwesome name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <ImageBackground
          style={styles.container}
          source={require("../../assets/login_bg.jpg")}
        >
          <View style={styles.overlay} />
          <Text style={styles.enrollLabel}>Enroll</Text>

          {/* if showCamera === true, show take shot button, else show shot taken */}
          {showShotTaken ? (
            <View>
              <View style={styles.matchImageContainer}>
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${base64Image}`,
                  }}
                  style={styles.matchImage}
                />
              </View>
              {/* remove image button*/}
              <View style={{ position: "absolute", bottom: 20, right: 40 }}>
                <TouchableOpacity
                  onPress={() => {
                    setBase64Image("");
                    setShowShotTaken(false);
                  }}
                  style={styles.removeShotContainer}
                >
                  <Text style={styles.removeShot}>&times;</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.takeShotContainer}>
              <TouchableOpacity
                onPress={() => setShowCamera(true)}
                style={{ flexDirection: "row" }}
              >
                <View style={{ marginRight: 10 }}>
                  <FontAwesome name="camera" size={20} color="white" />
                </View>
                <Text style={styles.takeShotButton}>Take shot</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* student's name input */}
          <TextInput
            ref={nameInputRef}
            style={[
              styles.input,
              !invalidNameInputMessage ? {} : styles.nullInput,
            ]}
            placeholder="full name"
            onChangeText={handleNameChange}
          />
          {/* invalid input message */}
          <Text style={styles.invalidInputText}>{invalidNameInputMessage}</Text>

          {/* student's index input */}
          <TextInput
            ref={indexInputRef}
            style={[
              styles.input,
              !invalidIndexInputMessage ? {} : styles.nullInput, // flag input as red if input is null or has digits != 7
            ]}
            placeholder="index no."
            keyboardType="numeric"
            onChangeText={handleIndexChange}
          />
          {/* invalid input message */}
          <Text style={styles.invalidInputText}>
            {invalidIndexInputMessage}
          </Text>

          {/* student's programme input */}
          <TextInput
            ref={programmeInputRef}
            style={[
              styles.input,
              !invalidProgrammeInputMessage ? {} : styles.nullInput,
            ]}
            placeholder="programme"
            onChangeText={handleProgrammeChange}
          />
          {/* invalid input message */}
          <Text style={styles.invalidInputText}>
            {invalidProgrammeInputMessage}
          </Text>

          {/* submit button */}
          <View
            style={[
              styles.submitButtonContainer,
              isSubmitting ? styles.submitButtonContainerSubmitting : {},
            ]}
          >
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.submitButton}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    aspectRatio: "9/16",
    marginLeft: -15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continue: {
    textDecorationLine: "underline",
    color: "#00BFA5",
  },
  divider: {
    width: "85%",
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "#BDBDBDAA",
    marginTop: 40,
  },
  enrollLabel: {
    fontSize: 30,
    marginBottom: 20,
  },
  info: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
  infoContainer: {
    marginTop: 40,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    backgroundColor: "#BDBDBD",
  },
  input: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#00BFA5",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    width: "80%",
    fontSize: 16,
    backgroundColor: "white",
  },
  invalidInputText: {
    width: "75%",
    textAlign: "left",
    marginBottom: 10,
    color: "#D50000",
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
  nullInput: {
    borderColor: "#D50000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  removeShotContainer: {
    backgroundColor: "#00BFA5",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  removeShot: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  submitButtonContainerSubmitting: {
    backgroundColor: "#AAAAAA",
  },
  submitButtonContainer: {
    width: "80%",
    padding: 10,
    backgroundColor: "#00BFA5",
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
  switchCam: {
    position: "absolute",
    top: 50,
    right: 45,
  },
  takeShotButton: {
    color: "white",
  },
  takeShotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 5,
    marginBottom: 30,
  },
});
