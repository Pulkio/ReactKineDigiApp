import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouteProps {
  navigation: NavigationProp<any, any>;
}

const Accueil = ({ navigation }: RouteProps) => {
  const goToAddPatient = () => {
    navigation.navigate('AddPatient');
  };

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
        <Image source={require('../../assets/logo_kine_app.png')} style={styles.logo} />

        <TouchableOpacity style={[styles.button, styles.addPatientButton]} onPress={goToAddPatient}>
          <Text style={styles.buttonText}>Ajouter un patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deletePatientButton]} onPress={goToDeletePatient}>
          <Text style={styles.buttonText}>Supprimer un patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.chooseTestButton]} onPress={goToTest}>
          <Text style={styles.buttonText}>Choisir un test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Couleur de fond plus douce
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)', // Rouge avec opacité réduite
    padding: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#EFEFEF', // Couleur de fond plus douce pour les boutons
  },
  buttonText: {
    color: '#333', // Couleur de texte plus foncée
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPatientButton: {
    backgroundColor: '#82C7A5', // Vert pastel
  },
  deletePatientButton: {
    backgroundColor: '#F5A623', // Orange pastel
  },
  chooseTestButton: {
    backgroundColor: '#5E9FFF', // Bleu pastel
  },
});

export default Accueil;
