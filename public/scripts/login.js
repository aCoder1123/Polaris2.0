import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithCredential,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);

function handleCredentialResponse(response) {
	const idToken = response.credential;
	const credential = GoogleAuthProvider.credential(idToken);

	signInWithCredential(auth, credential)
		.then((result) => {
			window.location.href = "schedule.html";
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			// const email = error.email;
			// const credential = GoogleAuthProvider.credentialFromError(error);
			alert(`Error signing in: ${errorMessage}`);
		});
}
window.onload = function () {
	google.accounts.id.initialize({
		client_id: "336111467040-3s1c9abqn5e04ummrg2n8oakl12jlqbt.apps.googleusercontent.com",
		callback: handleCredentialResponse,
	});
	google.accounts.id.renderButton(
		document.getElementById("signInButton"),
		{ theme: "outline", size: "large" } // customization attributes
	);
	google.accounts.id.prompt(); // display the One Tap dialog
};
