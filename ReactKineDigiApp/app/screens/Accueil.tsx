import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouteProps {
  navigation: NavigationProp<any, any>;
}

const Accueil = ({ navigation }: RouteProps) => {
  // Fonction pour naviguer vers la page AddPatient.tsx
  const goToAddPatient = () => {
    navigation.navigate('AddPatient');
  };

  // Fonction pour naviguer vers la page DeletePatient.tsx
  const goToDeletePatient = () => {
    navigation.navigate('DeletePatient');
  };

  const goToTest = () => {
    navigation.navigate('Test');
  };

  return (
    <View style={styles.container}>
      {/* En-tête personnalisé */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={goToAddPatient}>
          <Text style={styles.buttonText}>Ajouter un patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToDeletePatient}>
          <Text style={styles.buttonText}>Supprimer un patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToTest}>
          <Text style={styles.buttonText}>Choisir un test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // Aligne le bouton "Logout" à droite
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      width: '80%',
      alignItems: 'center',
    },
  });

export default Accueil;
