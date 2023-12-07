import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import 'firebase/storage';
import 'firebase/storage/dist/index.cjs'; // or 'firebase/storage/dist/index.esm' for ES modules
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { getAuth } from 'firebase/auth';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  let cameraRef = useRef<Camera>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<{ uri: string; duration: number } | undefined>();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [tests, setTests] = useState<string[]>([]);
  const [patients, setPatients] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | undefined>();
  const currentUser = getAuth().currentUser;
  const [loading, setLoading] = useState(false);
  const [processingVideo, setProcessingVideo] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showLoadingPage, setShowLoadingPage] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Error', 'Camera permission is required to use this feature.');
      }
    };

    const requestPermissions = async () => {
      await requestCameraPermission();
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setTests(["Test1", "Test2", "Test3", "Test4"]);

      const fetchPatients = async () => {
        try {
          if (currentUser) {
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, `users/${currentUser.uid}/patients`));
            const patientsData: string[] = [];
            querySnapshot.forEach((doc) => {
              patientsData.push(doc.id);
            });
            setPatients(patientsData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des patients : ', error);
        }
      };

      fetchPatients();
    };

    fetchData();
  }, [currentUser]);

  const processVideo = async () => {
    try {
      setShowLoadingPage(true); // Show loading page
      if (recordedVideoUri && currentUser && selectedPatient && selectedTest) {
        const storage = getStorage();

        const videoBase64 = await FileSystem.readAsStringAsync(recordedVideoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const storagePath = `videos/${currentUser.uid}/${Date.now()}.mp4`;
        const storageRef = ref(storage, storagePath);

        const blob = await fetch(recordedVideoUri);
        const blobData = await blob.blob();

        await uploadBytes(storageRef, blobData, { contentType: 'video/mp4' });

        const downloadURL = await getDownloadURL(storageRef);

        const collectionName = `users/${currentUser.uid}/videoTest`;

        const videoData = {
          user: currentUser.uid,
          patient: selectedPatient,
          test: selectedTest,
          videoURL: downloadURL,
          timestamp: new Date(),
        };

        await addDoc(collection(FIRESTORE_DB, collectionName), videoData);

        console.log('Video added to database:', videoData);

        Alert.alert('Vidéo envoyée', 'La vidéo a bien été envoyée.');
      } else {
        console.error('Invalid parameters for video data');
      }
    } catch (error) {
      console.error('Error adding video to database:', error);
    } finally {
      setProcessingVideo(false);
      setShowLoadingPage(false); // Hide loading page
    }
  };

  useEffect(() => {
    if (processingVideo) {
      processVideo();
    }
  }, [recordedVideoUri, processingVideo]);

  const recordVideo = async () => {
    setIsRecording(true);
    setLoading(true);

    let options = {
      quality: '720p',
      maxDuration: 60,
      mute: false,
    };

    try {
      if (cameraRef.current) {
        const { uri } = await cameraRef.current.recordAsync(options);
        setRecordedVideoUri(uri);
      } else {
        console.error('cameraRef.current is null in recordVideo');
      }
    } catch (error) {
      console.error('Error recording video:', error);
    } finally {
      setLoading(false);
      setProcessingVideo(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setShowCamera(false);
  };

  const openVideoPlayer = () => {
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setVideo(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      {showLoadingPage ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : showCamera ? (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} ref={cameraRef} ratio="16:9">
            <View style={styles.buttonContainer}>
              <Button
                title={isRecording ? 'Stop Recording' : 'Record Video'}
                onPress={isRecording ? stopRecording : recordVideo}
              />
            </View>
          </Camera>
        </View>
      ) : (
        <View>
          <View style={styles.pickerContainer}>
            <Text style={styles.title}>Choisir un Test</Text>
            <Picker
              selectedValue={selectedTest}
              onValueChange={(itemValue: string | null) => {
                setSelectedTest(itemValue);
                setIsButtonDisabled(!itemValue || !selectedPatient);
              }}
            >
              <Picker.Item label="Sélectionner un test" value={null} />
              {tests.map((test, index) => (
                <Picker.Item key={index} label={test} value={test} />
              ))}
            </Picker>
            <Text style={styles.title}>Choisir un Patient</Text>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue: string | null) => {
                setSelectedPatient(itemValue);
                setIsButtonDisabled(!selectedTest || !itemValue);
              }}
            >
              <Picker.Item label="Sélectionner un patient" value={null} />
              {patients.map((patient, index) => (
                <Picker.Item key={index} label={patient} value={patient} />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Commencer la vidéo"
              onPress={() => setShowCamera(true)}
              disabled={isButtonDisabled}
            />
          </View>
        </View>
      )}

      {video && (
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{`Duration: ${video.duration} seconds`}</Text>
        </View>
      )}

      {video && (
        <View style={styles.shareContainer}>
          <Button title="Discard" onPress={() => setVideo(undefined)} />
          <Button title="Open Video" onPress={openVideoPlayer} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  pickerContainer: {
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  durationContainer: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
  },
  durationText: {
    color: 'white',
    fontSize: 16,
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Test;
