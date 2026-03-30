import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjgf1jAuoWJ5GrjJBWb7yslo-Xrnjeoxc",
  authDomain: "munees-ed613.firebaseapp.com",
  projectId: "munees-ed613",
  storageBucket: "munees-ed613.firebasestorage.app",
  messagingSenderId: "61722437820",
  appId: "1:61722437820:web:539446792791d55b42c8b9",
  measurementId: "G-21VMXWF5N3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
