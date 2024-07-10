import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { firebaseConfig } from "./config.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const functions = getFunctions(app);


// if (!auth.user) {
//     window.location.href = "../index.html"
// }

const sendEmail = httpsCallable(functions, "sendEmail");
sendEmail({ text: "Testing, 1, 2, 3!" }).then((result) => {
	// Read result of the Cloud Function.
	/** @type {any} */
	const data = result.data;
	console.log(data);
});