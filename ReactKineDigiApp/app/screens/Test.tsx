import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';

const Test = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [tests, setTests] = useState<string[]>([]);
  const [patients, setPatients] = useState<string[]>([]);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
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
  }, [currentUser]);

  const importVideos = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission refusée pour accéder à la bibliothèque de médias.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled) {
        console.log('Vidéo sélectionnée : ', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation des vidéos : ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir un Test</Text>

      {/* Liste déroulante pour choisir un test */}
      <Picker
        selectedValue={selectedTest}
        onValueChange={(itemValue) => setSelectedTest(itemValue)}
      >
        <Picker.Item label="Sélectionner un test" value={null} />
        {tests.map((test, index) => (
          <Picker.Item key={index} label={test} value={test} />
        ))}
      </Picker>

      <Text style={styles.title}>Choisir un Patient</Text>

      {/* Liste déroulante pour choisir un patient */}
      <Picker
        selectedValue={selectedPatient}
        onValueChange={(itemValue) => setSelectedPatient(itemValue)}
      >
        <Picker.Item label="Sélectionner un patient" value={null} />
        {patients.map((patient, index) => (
          <Picker.Item key={index} label={patient} value={patient} />
        ))}
      </Picker>

      {/* Bouton pour importer des vidéos */}
      <TouchableOpacity style={styles.button} onPress={importVideos}>
        <Text style={styles.buttonText}>Importer des Vidéos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Test;