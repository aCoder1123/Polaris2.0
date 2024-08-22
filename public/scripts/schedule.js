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
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { firebaseConfig, siteKey } from "./config.js";
import { dataToFullHTML, addListeners, getUserFromEmail, getAdminLinks } from "./util.js";

const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);

const db = getFirestore(app, "maindb");
let userInformation;
let firebaseUser;

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

const handleScheduleUpdate = (doc) => {
	console.log(`Doc is: ${doc}`);
	let weekendInformation = JSON.parse(doc.data().information);

	let wrap = document.getElementById("daysContainer");
	wrap.replaceChildren();
	let elements = dataToFullHTML(weekendInformation, false).querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners();
};

let querySnap = await getDocs(collection(db, "weekends"));
let docs = [];
querySnap.forEach((doc) => {
	docs.push(doc.data().information);
});

let id = JSON.parse(docs[0]).startDate + ":" + JSON.parse(docs[0]).endDate;

const unsub = onSnapshot(doc(db, "weekends", id), handleScheduleUpdate);
