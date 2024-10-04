import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";

import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFunctions,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { firebaseConfig, siteKey } from "./config.js";
import { getUserFromEmail, addListeners, getMenuHTMLString } from "./util.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const functions = getFunctions(app);
const db = getFirestore(app, "maindb");
let userInformation;
let firebaseUser;
onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			userInformation = data;
			document.getElementById("credit").innerText = userInformation.credit;
			let pastEventsString = "";
			for (let event of userInformation.events) {
				pastEventsString += `<div class="pastEventWrap">
										<span class="eventDate">${event.date}</span> - 
										<span class="eventTitle">${event.title}</span>
									</div>`;
			}
			if (pastEventsString) {
				document.getElementById("eventsWrap").innerHTML = pastEventsString.repeat(15)
				document.getElementById("eventsHead").innerText = `Past Events: (${userInformation.events.length})`;
			}
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
		for (let el of document.querySelectorAll(".userName")) {
			el.innerText = user.displayName;
		}
		document.getElementById("userPFP").src = user.photoURL;
	} else {
		window.location.href = `index.html`;
	}
});

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

addListeners();
