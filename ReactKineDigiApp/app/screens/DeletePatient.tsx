import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';  // Ajoutez cette importation

const logo = require('../../assets/logo_patient.png');


interface Patient {
  id: string;
  data: {
    nom: string;
    prenom: string;
    // Ajoutez d'autres champs si nécessaire
  };
}

const DeletePatient = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const currentUser = getAuth().currentUser; // Obtenez l'utilisateur actuel

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (currentUser) {
          const querySnapshot = await getDocs(collection(FIRESTORE_DB, `users/${currentUser.uid}/patients`));
          const patientsData: Patient[] = [];
          querySnapshot.forEach((doc) => {
            patientsData.push({ id: doc.id, data: doc.data() as any }); // L'utilisation de 'as any' peut être nécessaire si les données ne correspondent pas exactement à l'interface
          });
          setPatients(patientsData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des patients : ', error);
      }
    };

    fetchPatients();
  }, [currentUser]);

  const handleDelete = (patientId: string) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce patient ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(collection(FIRESTORE_DB, `users/${currentUser?.uid}/patients`), patientId));
              Alert.alert('Succès', 'Le patient a été supprimé avec succès.');
              // Mettre à jour la liste des patients après la suppression
              setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId));
            } catch (error) {
              console.error('Erreur lors de la suppression du patient : ', error);
              Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du patient.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const renderItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => handleDelete(item.id)}
    >
      <Text style={styles.patientText}>{item.data.nom} {item.data.prenom}</Text>
      <Text style={styles.deleteButton}>Supprimer</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Liste des Patients</Text>
      {patients.length > 0 ? (
        <FlatList
          data={patients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Aucun patient trouvé.</Text>
      )}
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
    textAlign: 'center', 
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  patientText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  logo: {
    width: '100%', // Utiliser la largeur complète de l'écran
    height: 180, // Ajuster la hauteur selon vos besoins
    resizeMode: 'contain', // Ajuster le mode de redimensionnement
    marginBottom: 20,
  },
});

export default DeletePatient;
