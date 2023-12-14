// loginStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const loginStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 5,
    paddingVertical: 14, // Ajustez la valeur pour contrôler la hauteur du bouton
    paddingHorizontal: 55, // Ajustez la valeur pour contrôler la largeur du bouton
    borderRadius: 4,
  },
  buttonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logo: {
    width: screenWidth / 1.5,
    height: screenWidth / 1.5,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Ajustez la valeur pour contrôler l'espace entre les boutons
  },
  loginButton: {
    backgroundColor: '#5E9FFF', // Couleur spécifique au bouton "Login"
  },
  signUpButton: {
    backgroundColor: '#82C7A5', // Couleur spécifique au bouton "Sign Up"
  },
});

export default loginStyles;
