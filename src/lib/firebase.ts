import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMlgY-FWwnF3ngwpcW-hdeYDI_MiiJnoY",
  authDomain: "bharat-seva-ai.firebaseapp.com",
  projectId: "bharat-seva-ai",
  storageBucket: "bharat-seva-ai.firebasestorage.app",
  messagingSenderId: "928292519884",
  appId: "1:928292519884:web:7c50ab70422952094ea769",
  measurementId: "G-E7MR0DV61D",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
