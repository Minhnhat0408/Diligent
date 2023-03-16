// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuHu19ere8Pr7rnlgvsY0s5A7wA8x2ML4",
  authDomain: "diligent-69ff7.firebaseapp.com",
  projectId: "diligent-69ff7",
  storageBucket: "diligent-69ff7.appspot.com",
  messagingSenderId: "320838181999",
  appId: "1:320838181999:web:39375cadf2e4bbcf55999a",
  measurementId: "G-CZQ1HWEH10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const storage = getStorage(app);
export default app