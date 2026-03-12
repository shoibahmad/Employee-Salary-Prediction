// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfUO11sA5hIPgWafCcFKV_4TrOH-17iYs",
  authDomain: "employee-9cf84.firebaseapp.com",
  projectId: "employee-9cf84",
  storageBucket: "employee-9cf84.firebasestorage.app",
  messagingSenderId: "257011119165",
  appId: "1:257011119165:web:04f154359cc614cfe96654",
  measurementId: "G-E4E60711GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;
