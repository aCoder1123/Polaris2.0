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

import { dataToFullHTML, daysOfTheWeek as weekDays, addListeners, getUserFromEmail } from "./util.js";

import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
addListeners();

const weekendSelect = document.getElementById("dateSelect");

let firebaseUser;
let userInformation;
let weekends = [];
let viewingWeekend;

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db).then((data) => {
			if (!data.isAdmin) {
				window.location.href = "../index.html";
			}
			userInformation = data;
		});

		let pfp = document.querySelector("#menuPF img");
		if (pfp) {
			pfp.loading = "lazy";
			pfp.src = user.photoURL;
			document.getElementById("userName").innerText = user.displayName;
		}

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
	} else {
		window.location.href = "../index.html";
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

const updateWeekend = () => {
	viewingWeekend = weekends[weekends.length - 1 - weekendSelect.selectedIndex];
	let wrap = document.getElementById("daysContainer");
	wrap.replaceChildren();
	let elements = dataToFullHTML(viewingWeekend, false).querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners();

	let signUpsNum = 0;
	let tripNum = 0

	for (let day of viewingWeekend.days) {
		tripNum+= day.length
		for (let event of day) {
			signUpsNum += event.signups.length;
		}
	}
	document.getElementById("tripNum").innerText = tripNum
	document.getElementById("signupNum").innerText = signUpsNum

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
