import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { firebaseConfig, siteKey } from "./config.js";
import { addListeners, getUserFromEmail, getAdminLinks, getMenuHTMLString } from "./util.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
const functions = getFunctions(app);
addListeners();

let firebaseUser;
let userInformation;

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			userInformation = data;
		});

		let adminDoc = getDoc(doc(db, "admin", user.email)).then((doc) => {
			document.body.insertAdjacentHTML("afterbegin", getMenuHTMLString(user, false, doc.exists()));

			document.getElementById("signOutWrap").addEventListener("click", () => {
				signOut(auth)
					.then(() => {
						window.location.href = `../index.html`;
					})
					.catch((error) => {
						alert(`There was a error signing out: ${error}`);
					});
			});
			addListeners();
		});

	} else {
		window.location.href = `index.html`;
	}
});

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

const bugReport = httpsCallable(functions, "bugReport");

document.getElementById("reportForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	document.getElementById("submitBtn").disabled = true
	let formData = new FormData(e.target);
	let data = {};
	formData.forEach((value, key) => (data[key] = value));
	await bugReport(data)
	.then((res) => {
		if (res.data) {
			alert("Thank you for submitting your bug. We will take care of it as soon as possible.");
		}
	})
	.catch((error) => {
		console.error(error);
		alert("Bug Report failed. Please try again or email bailey.tuckman@westtown.edu. Thank you.");
	});
	document.getElementById("submitBtn").disabled = false
});
