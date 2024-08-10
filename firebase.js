// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqUc8K0-ryt32JhnJeJhc9sGVE9Dlf5o8",
  authDomain: "scopioe-5d6ae.firebaseapp.com",
  projectId: "scopioe-5d6ae",
  storageBucket: "scopioe-5d6ae.appspot.com",
  messagingSenderId: "570583220951",
  appId: "1:570583220951:web:d45bb46db904030cd4e692",
  measurementId: "G-CG5EVZH6CJ",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const collections = {
  folders: collection(db, "folders"),
  files: collection(db, "files"),
  formatedDoc: (doc) => ({
    id: doc.id,
    ...doc.data(),
  }),
};
const auth = getAuth(app);
export { app, storage, db, auth, collections };
