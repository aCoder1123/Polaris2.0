import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";

import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signOut,
	setPersistence,
	browserSessionPersistence,
	signInWithRedirect,
	getRedirectResult,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
// if (window.location.hostname === "127.0.0.1") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
	login_hint: "first.last@westtown.edu",
});

auth.languageCode = "en";
setPersistence(auth, browserSessionPersistence)
	.then(() => {})
	.catch((error) => {
		console.log(error);
	});

getRedirectResult(auth)
	.then((user) => {
		console.log(user);
		if (user || auth.currentUser) {
			window.location.href = "schedule.html";
		} else {
			document.getElementById("signInButton").onclick = async () => {
				await signInWithRedirect(auth, provider);
			};
		}
	})
	.catch((error) => {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		// The email of the user's account used.
		const email = error.customData.email;
		// The AuthCredential type that was used.
		const credential = GoogleAuthProvider.credentialFromError(error);
		alert(`Sign In Error: ${error}`);
		console.log(error);
	});