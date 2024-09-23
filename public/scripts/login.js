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
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
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

// provider.addScope("");

auth.languageCode = "en";
setPersistence(auth, browserSessionPersistence)
	.then(() => {})
	.catch((error) => {
		console.log(error);
	});

const signIn = () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;

			if (
				user.email.slice(user.email.length - 13) != "@westtown.edu" &&
				user.email != "bailey.tuckman@gmail.com"
			) {
				signOut(auth)
					.then(() => {})
					.catch((error) => {
						alert(`There was a error signing out: ${error}`);
					});
				alert("Please sign in with a westtown.edu email adress.");
				return;
			}
			window.location.href = "schedule.html";
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
};

document.getElementById("signInButton").onclick = signIn;
