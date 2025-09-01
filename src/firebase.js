import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuT_NoGC4nIZbnz2EXKeJVvrs-nWsXWhY",
  authDomain: "asesor-inmobiliario-6c7bb.firebaseapp.com",
  projectId: "asesor-inmobiliario-6c7bb",
  storageBucket: "asesor-inmobiliario-6c7bb.firebasestorage.app",
  messagingSenderId: "934074963375",
  appId: "1:934074963375:web:24e0272a4a03949b7f0b5a",
  measurementId: "G-8MHM3VSL7P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
