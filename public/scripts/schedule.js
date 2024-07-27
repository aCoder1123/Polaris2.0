import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// import firebase from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig } from "./config.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const uid = user.uid;
	} else {
		
		window.location.href = "./"
		console.log("user signed out")
	}
});









