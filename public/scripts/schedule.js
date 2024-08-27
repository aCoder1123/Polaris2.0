import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFirestore,
	doc,
	onSnapshot,
	collection,
	getDocs,
	connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { firebaseConfig, siteKey } from "./config.js";
import { dataToFullHTML, addListeners, getUserFromEmail, getAdminLinks } from "./util.js";
// import { api } from "https://apis.google.com/js/api.js";

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
const functions = getFunctions(app);

const handleSignupFunc = httpsCallable(functions, 'handleSignup')

let userInformation;
let firebaseUser;
let weekendInformation;

// if (window.location.hostname === "127.0.0.1") {
// 	// connectFirestoreEmulator(db, "127.0.0.1", 8080);
// 	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
// 	console.log("Connecting Firebase Emulator")
// }

// function startApp(user) {
// 	auth.currentUser
// 		.getToken()
// 		.then(function (token) {
// 			return gapi.client.calendar.events.list({
// 				calendarId: "primary",
// 				timeMin: new Date().toISOString(),
// 				showDeleted: false,
// 				singleEvents: true,
// 				maxResults: 10,
// 				orderBy: "startTime",
// 			});
// 		})
// 		.then(function (response) {
// 			console.log(response);
// 		});
// }

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db).then((data) => {
			userInformation = data;
			if (userInformation.isAdmin) {
				document.getElementById("callDAWrap").insertAdjacentHTML("beforebegin", getAdminLinks(false));
			}
		});

		let pfp = document.querySelector("#menuPF img");
		if (pfp) {
			pfp.loading = "lazy";
			pfp.src = user.photoURL;
			document.getElementById("userName").innerText = user.displayName;
		}

		// var script = document.createElement("script");
		// script.type = "text/javascript";
		// script.src = "https://apis.google.com/js/api.js";
		// // Once the Google API Client is loaded, you can run your code
		// script.onload = function (e) {
		// 	// Initialize the Google API Client with the config object
		// 	gapi.load('client', () => {
		// 		gapi.client
		// 			.init({
		// 				apiKey: firebaseConfig.apiKey,
		// 				clientId: firebaseConfig.clientId,
		// 				discoveryDocs: firebaseConfig.discoveryDocs,
		// 				scope: firebaseConfig.scopes.join(" "),
		// 			})
		// 			// Loading is finished, so start the app
		// 			.then(function () {
		// 				// Make sure the Google API Client is properly signed in
		// 				console.log("Inited")
		// 				if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
		// 					startApp(user);
		// 				} else {
		// 					firebase.auth().signOut(); // Something went wrong, sign out
		// 				}
		// 			});
		// 	})
			
		// };
		// Add to the document
		// document.getElementsByTagName("head")[0].appendChild(script);
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

const unsub = onSnapshot(doc(db, "activeWeekend", "default"), (doc) => {
	console.log(doc.data());
	weekendInformation = JSON.parse(doc.data().information);

	let wrap = document.getElementById("daysContainer");
	wrap.replaceChildren();
	let nodes = dataToFullHTML(weekendInformation, "schedule", firebaseUser.displayName)
	let elements = nodes.querySelectorAll(
		".dayWrap"
	);
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners();
	document.querySelectorAll(".addIcon").forEach((el) => {
		el.addEventListener("click", handleSignup);
	});

	let scheduleContainer = document.getElementById("scheduleContainer")
	scheduleContainer.replaceChildren();
	for (let node of nodes.querySelectorAll(".scheduleDay")) {
		scheduleContainer.appendChild(node)
	}
});


const handleSignup = (e) => {
	let button = e.target
	if (button.innerText === "circle") return
	console.log(button)
	let eID = button.parentElement.parentElement.parentElement.id
	console.log(eID)
	button.innerText = "circle"
	button.disabled = true
	handleSignupFunc({id: eID}).then((res) => {
		console.log(res)
	})
}

