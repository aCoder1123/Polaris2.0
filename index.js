// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/firestore";

import { getFirestore } from "firebase/firestore";

import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyB63H-EFCTZgmVmlxPmIyEmy-TLevxfFLU",
	authDomain: "polaris-60dce.firebaseapp.com",
	projectId: "polaris-60dce",
	storageBucket: "polaris-60dce.appspot.com",
	messagingSenderId: "336111467040",
	appId: "1:336111467040:web:743f80789db026f3879a45",
	measurementId: "G-G1LENEB1DR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);