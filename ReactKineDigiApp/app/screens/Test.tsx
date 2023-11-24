import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  let cameraRef = useRef<Camera>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | undefined>(undefined);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<{ uri: string } | undefined>();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>;
  }

  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: "720p",
      maxDuration: 60,
      mute: false
    };

    if (cameraRef.current) {
      const recordedVideo = await cameraRef.current.recordAsync(options);
      setVideo(recordedVideo);
      setIsRecording(false);
    }
  };

  let stopRecording = () => {
    setIsRecording(false);
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (video) {
    let shareVideo = () => {
      if (video.uri) {
        shareAsync(video.uri).then(() => {
          setVideo(undefined);
        });
      }
    };

    let saveVideo = () => {
      if (video.uri && hasMediaLibraryPermission) {
        MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
          setVideo(undefined);
        });
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
        />
        <Button title="Share" onPress={shareVideo} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef} ratio="16:9">
      <View style={styles.buttonContainer}>
        <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
});

export default Test;
