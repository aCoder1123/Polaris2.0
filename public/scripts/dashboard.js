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
	collection,
	getDocs,
	query,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";

import { dataToFullHTML, addListeners, getUserFromEmail, getMenuHTMLString } from "./util.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
const functions = getFunctions(app);

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator");
}

const weekendSelect = document.getElementById("dateSelect");

let firebaseUser;
let userInformation;
let weekends = [];
let viewingWeekend;

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			if (!data.isAdmin) {
				window.location.href = "../index.html";
			}
			userInformation = data;
		});

		getMenuHTMLString(user, true, db, true).then((menuString) => {
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
		});

		getDocs(query(collection(db, "weekends")))
			.then((docs) => {
				docs.forEach((weekend) => {
					weekends.push(JSON.parse(weekend.data().information));
				});
				getDoc(doc(db, "activeWeekend", "default"))
					.then((doc) => {
						weekends.push(JSON.parse(doc.data().information));

						for (let schedule of weekends) {
							let option = document.createElement("option");
							option.className = "weekendChoice";
							option.value = `${schedule.startDate}-${schedule.endDate}`;
							option.innerText = `${schedule.startDate}-${schedule.endDate}`;
							weekendSelect.insertAdjacentElement("afterbegin", option);
						}
						weekendSelect.selectedIndex = 0;
						updateWeekend();
					})
					.catch((error) => {
						alert(`ERROR LOADING ACTIVE WEEKEND: ${error}`);
						throw error;
					});
			})
			.catch((error) => {
				alert(`ERROR LOADING WEEKENDS: ${error}`);
				throw error;
			});

		addListeners();
	} else {
		window.location.href = "../index.html";
	}
});

const updateWeekend = () => {
	viewingWeekend = weekends[weekends.length - 1 - weekendSelect.selectedIndex];
	let wrap = document.getElementsByTagName("body")[0];
	for (let node of document.querySelectorAll("body .dayWrap")) {
		node.remove();
	}
	let elements = dataToFullHTML(viewingWeekend, "schedule").querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners();

	let signUpsNum = 0;
	let tripNum = 0;
	let tripNumOC = 0;
	let checkedInNum = 0;
	let noShowNum = 0;

	for (let day of viewingWeekend.days) {
		tripNum += day.length;
		for (let event of day) {
			signUpsNum += event.signups.length;
			if (event.admission.val != "none") {
				tripNumOC += 1;
			}
			for (let signup of event.signups) {
				if (signup.status == "checkedIn") checkedInNum++;
				if (signup.status == "noShow") noShowNum++;
			}

		}
	}
	document.getElementById("tripNum").innerText = tripNum;
	document.getElementById("tripNumOC").innerText = tripNumOC;
	document.getElementById("signupNum").innerText = signUpsNum;
	document.getElementById("checkedInNum").innerText = checkedInNum;
	document.getElementById("noShowNum").innerText = noShowNum;


	if (weekendSelect.selectedIndex === 0) {
		document.getElementById("infoWrap").classList.add("active");
	} else {
		document.getElementById("infoWrap").classList.remove("active");
	}
};

document.getElementById("weekendBack").addEventListener("click", () => {
	if (weekendSelect.selectedIndex < weekendSelect.childElementCount - 1) {
		weekendSelect.selectedIndex++;
		updateWeekend();
	}
});

document.getElementById("weekendForward").addEventListener("click", () => {
	if (weekendSelect.selectedIndex > 0) {
		weekendSelect.selectedIndex--;
		updateWeekend();
	}
});

weekendSelect.addEventListener("change", updateWeekend);

let testButton = document.getElementById("testButton");
if (testButton) {
	testButton.onclick = async (e) => {
		e.target.disabled = true;
		try {
			let res = await testFunc();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		e.target.disabled = false;
	};
}
