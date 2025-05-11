// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKgPuZSJ_QS2Cg63iPkQ0ww3hOMymgFOQ",
  authDomain: "to-do-67679.firebaseapp.com",
  projectId: "to-do-67679",
  storageBucket: "to-do-67679.appspot.com",
  messagingSenderId: "712631483524",
  appId: "1:712631483524:web:f16556bf0f84ea934196d1",
  measurementId: "G-FDQDCQFDBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
