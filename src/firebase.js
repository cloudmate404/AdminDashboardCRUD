import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "admindashboard-tutorial.firebaseapp.com",
  projectId: "admindashboard-tutorial",
  storageBucket: "admindashboard-tutorial.appspot.com",
  messagingSenderId: "427680959666",
  appId: "1:427680959666:web:87fc6329adeae908b94dab",
};

const app = initializeApp(firebaseConfig);

// initialize database
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export const auth = getAuth();
