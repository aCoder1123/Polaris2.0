import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

const sendEmail = httpsCallable(functions, "sendEmail");

onAuthStateChanged(auth, (user) => {
	if (user) {
		document.getElementById("emailButton").onclick = () => {
			let emailConf = { email: user.email, subject: "Your Email Has Arrived.", text: "Testing 1, 2, 3!" };
			sendEmail(emailConf)
				.then((result) => {
					console.log(result);
				})
				.catch((error) => {
					console.log(error);
				});
		};
	} else {
		window.location.href = "index.html";
		console.log("user signed out");
	}
});
