import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { getDoc, doc, setDoc, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import { getAuth, User } from 'firebase/auth';  // Modifiez l'importation ici

const AddPatient = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(getAuth().currentUser); // Utilisez currentUser directement

  const ajouterPatient = async () => {
    try {
      // Vérifiez que l'utilisateur est authentifié
      if (!currentUser) {
        Alert.alert('Erreur', 'Veuillez vous connecter pour ajouter un patient.');
        return;
      }

      // Utilisez l'ID de l'utilisateur comme nom de la collection
      const collectionName = `users/${currentUser.uid}/patients`;

      // Vérifiez que le prénom et le nom ont été saisis
      if (!prenom || !nom) {
        Alert.alert('Erreur', 'Veuillez saisir le prénom et le nom du patient.');
        return;
      }

      // Supprimez les espaces du prénom et du nom
      const prenomSansEspaces = prenom.replace(/\s/g, '');
      const nomSansEspaces = nom.replace(/\s/g, '');

      // Générez l'e-mail à partir du prénom et du nom sans espaces
      const email = `${prenomSansEspaces.toLowerCase()}${nomSansEspaces.toLowerCase()}@digisport.fr`;

      // Vérifiez si un patient avec le même e-mail existe déjà dans la collection de l'utilisateur
      const existingDoc = await getDoc(doc(collection(FIRESTORE_DB, collectionName), email));

      if (existingDoc.exists()) {
        // Un patient avec le même e-mail existe déjà
        Alert.alert('Erreur', 'Un patient avec le même e-mail existe déjà.');
      } else {
        // Utilisez l'e-mail comme ID lors de l'ajout du document
        const patientData = {
          nom,
          prenom,
        };

        const docRef = doc(collection(FIRESTORE_DB, collectionName), email);
        await setDoc(docRef, patientData);

        // Affichage de la boîte de dialogue pour le succès
        Alert.alert('Succès', 'Patient ajouté avec succès.');

        // Effacer les entrées des champs nom et prénom
        setNom('');
        setPrenom('');

        console.log('Patient ajouté avec l\'ID (e-mail) : ', email);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du patient : ', error);
    }
  };

  return (
    <View style={styles.container}>

    <Text style={styles.label}>Prénom :</Text>
    <TextInput
        style={styles.input}
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
        placeholder="Entrez le prénom"
    />
    <Text style={styles.label}>Nom :</Text>
    <TextInput
        style={styles.input}
        value={nom}
        onChangeText={(text) => setNom(text)}
        placeholder="Entrez le nom"
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
    backgroundColor: '#fff',
    justifyContent: 'center', // Centre verticalement
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddPatient;
