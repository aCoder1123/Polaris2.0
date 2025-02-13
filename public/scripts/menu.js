import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	doc,
	setDoc,
	onSnapshot,
	deleteDoc,
	updateDoc,
	query,
	where,
	connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import {
	dataToFullHTML,
	daysOfTheWeek as weekDays,
	addListeners,
	Weekend,
	WeekendEvent,
	getUserFromEmail,
	handleDBError,
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


const switchView = () => {
	Array.from(document.getElementsByClassName("menuOption")).forEach((element) => {
		element.classList.toggle("visible");
	});
}
document.getElementById("embed").onchange = switchView
document.getElementById("parsed").onchange = switchView

let unsub = onSnapshot(doc(db, "lunchMenus", "latest"), (doc) => {
	let data = doc.data()
	let header = data.header
	let schedule = JSON.parse(data.information)
	document.getElementById("mainHeader").innerText = header
	let wrap = document.getElementById("parsedMenu")
	wrap.replaceChildren()
	for (let column of schedule) {
		for (let item of column) {
			wrap.insertAdjacentHTML("beforeend", `<div class=\"menuItem\">${item}</div>`)
		}
	}
})
