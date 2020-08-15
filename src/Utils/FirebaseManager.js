// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSR8PLyyQ13ze6jRsfkmFrpS1LB804WQA",
  authDomain: "atlas-asteroids.firebaseapp.com",
  databaseURL: "https://atlas-asteroids.firebaseio.com",
  projectId: "atlas-asteroids",
  storageBucket: "atlas-asteroids.appspot.com",
  messagingSenderId: "145065134982",
  appId: "1:145065134982:web:07a425bb59ae564d91ba07",
  measurementId: "G-EDS92E82XW",
};

export function init() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
} 
