import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSHfz_XnHf4_kGdBjr8CTm-jrWVHdqWss",
  authDomain: "teacher-qr-attendance.firebaseapp.com",
  projectId: "teacher-qr-attendance",
  storageBucket: "teacher-qr-attendance.firebasestorage.app",
  messagingSenderId: "503135790649",
  appId: "1:503135790649:web:65b5ee010b5c3abb84cfe8",
  measurementId: "G-SHRXS0XNNF",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);