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
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { firebaseConfig, siteKey } from "./config.js";
import { getUserFromEmail, addListeners, getAdminLinks } from "./util.js";

const app = initializeApp(firebaseConfig);
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
		getUserFromEmail(user.email, user.displayName, db).then((data) => {
			userInformation = data;
			document.getElementById("credit").innerText = userInformation.credit;
			if (userInformation.isAdmin) {
				document.getElementById("callDAWrap").insertAdjacentHTML("beforebegin", getAdminLinks(false));
			}
		});

		let pfp = document.querySelector("#menuPF img");
		if (pfp) {
			pfp.loading = "lazy";
			pfp.src = user.photoURL;
			document.getElementById("pfp").src = user.photoURL;
			for (let el of document.querySelectorAll(".userName")) {
				el.innerText = user.displayName;
			}
		}
	} else {
		window.location.href = `index.html`;
	}
});

document.getElementById("signOutWrap").addEventListener("click", () => {
	signOut(auth)
		.then(() => {
			window.location.href = `${isAdminPage ? "../" : ""}index.html`;
		})
		.catch((error) => {
			alert(`There was a error signing out: ${error}`);
		});
});

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

addListeners();

// const sendEmail = httpsCallable(functions, "sendEmail");

// onAuthStateChanged(auth, (user) => {
// 	if (user) {
// 		document.getElementById("emailButton").onclick = () => {
// 			let emailConf = { email: user.email, subject: "Your Email Has Arrived.", text: "Testing 1, 2, 3!" };
// 			sendEmail(emailConf)
// 				.then((result) => {
// 					console.log(result);
// 				})
// 				.catch((error) => {
// 					console.log(error);
// 				});
// 		};
// 	} else {
// 		window.location.href = "index.html";
// 		console.log("user signed out");
// 	}
// });
