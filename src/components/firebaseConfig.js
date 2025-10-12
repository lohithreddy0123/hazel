// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Hazel Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDqteLqMm3u179tI1WfYxBUuD3AwA4cQKg",
  authDomain: "hazel-d9071.firebaseapp.com",
  projectId: "hazel-d9071",
  storageBucket: "hazel-d9071.firebasestorage.app",
  messagingSenderId: "172004398013",
  appId: "1:172004398013:web:f076c485973831bbbbf8d4",
  measurementId: "G-5YS3B1D769"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exports for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
