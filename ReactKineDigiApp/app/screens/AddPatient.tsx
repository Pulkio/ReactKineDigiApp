import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { getDoc, doc, setDoc, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import { getAuth, User } from 'firebase/auth';


const logo = require('../../assets/logo_patient.png');


const AddPatient = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [envergure, setEnvergure] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(getAuth().currentUser);

  const ajouterPatient = async () => {
    try {
      if (!currentUser) {
        Alert.alert('Erreur', 'Veuillez vous connecter pour ajouter un patient.');
        return;
      }

      const collectionName = `users/${currentUser.uid}/patients`;

      if (!prenom || !nom) {
        Alert.alert('Erreur', 'Veuillez saisir le prénom et le nom du patient.');
        return;
      }

      const prenomSansEspaces = prenom.replace(/\s/g, '');
      const nomSansEspaces = nom.replace(/\s/g, '');

      const email = `${prenomSansEspaces.toLowerCase()}${nomSansEspaces.toLowerCase()}@digisport.fr`;

      const existingDoc = await getDoc(doc(collection(FIRESTORE_DB, collectionName), email));

      if (existingDoc.exists()) {
        Alert.alert('Erreur', 'Un patient avec le même e-mail existe déjà.');
      } else {
        const patientData = {
          nom,
          prenom,
          envergure,
        };

        const docRef = doc(collection(FIRESTORE_DB, collectionName), email);
        await setDoc(docRef, patientData);

        Alert.alert('Succès', 'Patient ajouté avec succès.');

        setNom('');
        setPrenom('');
        setEnvergure('');

        console.log('Patient ajouté avec l\'ID (e-mail) : ', email);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du patient : ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={[styles.label, { fontWeight: 'bold' }]}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
        placeholder="Entrez le prénom"
      />

      <Text style={[styles.label, { fontWeight: 'bold' }]}>Nom</Text>
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={(text) => setNom(text)}
        placeholder="Entrez le nom"
      />

      <Text style={[styles.label, { fontWeight: 'bold' }]}>Envergure</Text>
      <TextInput
        style={styles.input}
        value={envergure}
        onChangeText={(text) => setEnvergure(text)}
        placeholder="Entrez l'envergure"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={ajouterPatient}>
        <Text style={styles.buttonText}>Ajouter Patient</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
  },
  logo: {
    width: '100%', // Utiliser la largeur complète de l'écran
    height: 180, // Ajuster la hauteur selon vos besoins
    resizeMode: 'contain', // Ajuster le mode de redimensionnement
    marginBottom: 20,
  },
  label: {
    fontSize: 18, // Augmenter la taille de la police
    marginBottom: 5,
    color: '#333',
    textAlign: 'center', // Centrer le texte
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#82C7A5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AddPatient;

