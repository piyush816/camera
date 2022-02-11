import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
// import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const Button = ({ children, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...style }}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [focus, setFocus] = useState(Camera.Constants.AutoFocus.off);
  const [zoom, setZoom] = useState(0);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const capturePhoto = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      setPhoto(photo.uri);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        MediaLibrary.saveToLibraryAsync(photo.uri);
      } else {
        Alert.alert("Please give access to save images!");
      }
    }
  };

  const i = 1;

  return (
    <View style={styles.container}>
      <Camera
        ratio="16:9"
        style={styles.camera}
        zoom={zoom}
        autoFocus={focus}
        flashMode={flash}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>
              flash === Camera.Constants.FlashMode.off
                ? setFlash(Camera.Constants.FlashMode.torch)
                : setFlash(Camera.Constants.FlashMode.off)
            }
          >
            {flash === Camera.Constants.FlashMode.off ? (
              <Ionicons name="flash-off" size={34} color="white" />
            ) : (
              <Ionicons name="flash" size={34} color="white" />
            )}
          </Button>
          <Button
            style={styles.zoomButton}
            onPress={() => (zoom >= 1 ? setZoom(0) : setZoom(zoom + 0.2))}
          >
            <Text numberOfLines={1} style={styles.text}>
              {zoom + 1}X
            </Text>
          </Button>

          <Button onPress={capturePhoto} style={styles.capButton}>
            <View style={styles.capButtonInner}></View>
          </Button>

          <Button
            onPress={() =>
              focus === Camera.Constants.AutoFocus.off
                ? setFocus(Camera.Constants.AutoFocus.on)
                : setFocus(Camera.Constants.AutoFocus.off)
            }
          >
            {focus === Camera.Constants.AutoFocus.off ? (
              <MaterialIcons name="center-focus-weak" size={34} color="white" />
            ) : (
              <MaterialIcons
                name="center-focus-strong"
                size={34}
                color="white"
              />
            )}
          </Button>

          <Button
            onPress={() =>
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }
          >
            <Ionicons name="camera-reverse" size={34} color="white" />
          </Button>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  camera: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: -100,
    height: 100,
  },
  zoomButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    padding: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    color: "white",
  },
  capButton: {
    width: 70,
    height: 70,
    borderColor: "white",
    borderWidth: 2,
    margin: 2,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  capButtonInner: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
  },
});
