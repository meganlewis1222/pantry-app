// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "headstarterpantryapp-6961d.firebaseapp.com",
    projectId: "headstarterpantryapp-6961d",
    storageBucket: "headstarterpantryapp-6961d.appspot.com",
    messagingSenderId: "175118352859",
    appId: "1:175118352859:web:87e1d7f69afe5a507767fe",
    measurementId: "G-00FCHNZQZ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined" && isSupported()) {
    analytics = getAnalytics(app);
}
const firestore = getFirestore(app);
// const analytics = getAnalytics(app); // in tutorial

export { app, firestore };
