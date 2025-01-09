// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // This is for the authentification

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRDaHsBH3lds38jWZ-jHtvXTjXg8UbEGM",
    authDomain: "react-native-8252d.firebaseapp.com",
    databaseURL: "https://react-native-8252d-default-rtdb.firebaseio.com",
    projectId: "react-native-8252d",
    storageBucket: "react-native-8252d.firebasestorage.app",
    messagingSenderId: "707348366233",
    appId: "1:707348366233:web:0ce03f9dd46e03062b0908",
    measurementId: "G-THDVBL0ELL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app); // Create an instance of Firebase Authentication

export { app, auth }; // Export both app and auth for use in your components