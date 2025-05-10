// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDKhwmqH8JcVB3xT_L-PaYJ-skDxY2ik8A",
    authDomain: "ders-notu-platformu.firebaseapp.com",
    projectId: "ders-notu-platformu",
    storageBucket: "ders-notu-platformu.firebasestorage.app",
    messagingSenderId: "896088008381",
    appId: "1:896088008381:web:3d15f2d914400d1a47f9d4"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
