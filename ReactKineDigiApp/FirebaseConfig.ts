// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcCv5ycWwxNoetfBwEPrUVVAk5tAPEFtM",
  authDomain: "reactkinedigi.firebaseapp.com",
  projectId: "reactkinedigi",
  storageBucket: "reactkinedigi.appspot.com",
  messagingSenderId: "531381848521",
  appId: "1:531381848521:web:0bd9a8e66aba350a910018",
  measurementId: "G-DCJ0C7ETNV"
};


// Initialize Firebase

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
