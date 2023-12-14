import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { loginStyles } from '../styles/loginStyles'; // Importe le styleSheet



// Assuming you have an image source, replace 'yourLogoPath' with the actual path or source of your logo.
const logo = require('../../assets/logo_kine_app.png');

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error : any) {
            console.log(error);
            alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Votre compte a bien été créé !')
        } catch (error : any) {
            console.log(error);
            alert('Sign up failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={loginStyles.container}>
          <Text style={loginStyles.title}>Digiki</Text>
      
          <Image source={logo} style={loginStyles.logo} />
          <KeyboardAvoidingView behavior='padding'>
            <TextInput value={email} style={loginStyles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
            <TextInput secureTextEntry={true} value={password} style={loginStyles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} />
      
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={loginStyles.buttonContainer}>
                <TouchableOpacity onPress={signIn} style={[loginStyles.button, loginStyles.loginButton]}>
                  <Text style={loginStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={signUp} style={[loginStyles.button, loginStyles.signUpButton]}>
                  <Text style={loginStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      );
};

export default Login;
