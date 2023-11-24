import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { getAuth } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  let cameraRef = useRef<Camera>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<{ uri: string } | undefined>();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [tests, setTests] = useState<string[]>([]);
  const [patients, setPatients] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false); // New state to manage camera visibility
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");

      // Chargement des tests (exemple : "Test1", "Test2", "Test3", "Test4")
      setTests(["Test1", "Test2", "Test3", "Test4"]);

      // Chargement des patients de l'utilisateur connecté depuis la base de données
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
    })();
  }, [currentUser]);

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
    setShowCamera(false); // Hide the camera after stopping recording
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  let shareVideo = () => {
    if (video && video.uri) {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    }
  };

  let saveVideo = () => {
    if (video && video.uri) {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} ref={cameraRef} ratio="16:9">
            <View style={styles.buttonContainer}>
              <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
            </View>
          </Camera>
        </View>
      ) : (
        <View>
          <View style={styles.pickerContainer}>
            <Text style={styles.title}>Choisir un Test</Text>
            <Picker
              selectedValue={selectedTest}
              onValueChange={(itemValue: string | null) => setSelectedTest(itemValue)}
            >
              <Picker.Item label="Sélectionner un test" value={null} />
              {tests.map((test, index) => (
                <Picker.Item key={index} label={test} value={test} />
              ))}
            </Picker>
            <Text style={styles.title}>Choisir un Patient</Text>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue: string | null) => setSelectedPatient(itemValue)}
            >
              <Picker.Item label="Sélectionner un patient" value={null} />
              {patients.map((patient, index) => (
                <Picker.Item key={index} label={patient} value={patient} />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Commencer la vidéo" onPress={() => setShowCamera(true)} />
          </View>
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
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  pickerContainer: {
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    width: '100%', // Ensure the camera takes the full width
  },
  camera: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Test;
