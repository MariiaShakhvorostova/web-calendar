/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARABxP7GXpGxJ2b5uwhoiiDkbbZMvxAgU",
  authDomain: "webcalendar-377bb.firebaseapp.com",
  projectId: "webcalendar-377bb",
  storageBucket: "webcalendar-377bb.appspot.com",
  messagingSenderId: "467584309604",
  appId: "1:467584309604:web:465fe5cd404a846b330271",
  measurementId: "G-6V3X8X1Z8Y",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { analytics, db };
