// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0_vpmyadNcGScgvnb5ZrPIxfDeRyfiL4",
  authDomain: "bank-3c593.firebaseapp.com",
  databaseURL: "https://bank-3c593-default-rtdb.firebaseio.com",
  projectId: "bank-3c593",
  storageBucket: "bank-3c593.firebasestorage.app",
  messagingSenderId: "1032120015688",
  appId: "1:1032120015688:web:6a98733354836384c6b17d",
  measurementId: "G-2T5E4SV30P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db =getFirestore(app);//Firestore Database
const auth = getAuth(app);//Authentication

export { app,analytics,db,auth};