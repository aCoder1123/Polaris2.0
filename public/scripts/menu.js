import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFirestore,
	getDoc,
	doc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	daysOfTheWeek as weekDays,
	addListeners,
	getMenuHTMLString,
	getMenuSignInHTMLString,
} from "./util.js";
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
const db = getFirestore(app, "maindb");

onAuthStateChanged(auth, (user) => {
	if (user) {

		let adminDoc = getDoc(doc(db, "admin", user.email)).then((doc) => {
			getMenuHTMLString(user, false, db, doc.exists()).then((menuString) => {
				document.body.insertAdjacentHTML("afterbegin", menuString);
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
		});
	} else {
		document.body.insertAdjacentHTML("afterbegin", getMenuSignInHTMLString());
		addListeners();
	}
});