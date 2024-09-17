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
	setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
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
const functions = getFunctions(app);

const handleSignupFunc = httpsCallable(functions, "handleSignup");

let scheduleType = "schedule";
let userInformation;
let firebaseUser;
let weekendInformation;

let currentEventID;
let idAsArray;

if (window.location.hostname === "127.0.0.1") {
	// connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator")
}

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			userInformation = data;
			if (userInformation.isAdmin) {
				document.getElementById("callDAWrap").insertAdjacentHTML("beforebegin", getAdminLinks(false));
				scheduleType = "admin";
			}

			const unsub = onSnapshot(doc(db, "activeWeekend", "default"), (doc) => {
				weekendInformation = JSON.parse(doc.data().information);
				let wrap = document.getElementsByTagName("body")[0]
				for (let node of document.querySelectorAll("body .dayWrap")) {
					node.remove();
				}
				let nodes = dataToFullHTML(weekendInformation, scheduleType, firebaseUser.displayName);

				let elements = nodes.querySelectorAll(".dayWrap");
				for (let i = 0; i < elements.length; i++) {
					wrap.append(elements[i]);
				}
				addListeners();
				document.querySelectorAll(".addIcon").forEach((el) => {
					el.addEventListener("click", handleSignup);
				});
				document.querySelectorAll(".checkInLaunch").forEach((el) => {
					el.addEventListener("click", handleCheckIn);
				});

				let scheduleContainer = document.getElementById("scheduleContainer");
				scheduleContainer.replaceChildren();
				for (let node of nodes.querySelectorAll(".scheduleDay")) {
					scheduleContainer.appendChild(node);
				}
			});
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
			window.location.href = `index.html`;
		})
		.catch((error) => {
			alert(`There was a error signing out: ${error}`);
		});
});

const handleSignup = (e) => {
	let button = e.target;
	if (button.innerText === "circle") return;
	let eID = button.parentElement.parentElement.parentElement.id;
	button.innerText = "circle";
	button.disabled = true;
	handleSignupFunc({ id: eID }).then((res) => {});
};

const formatCheckIn = () => {
	let wrap = document.getElementById("attendeesWrap");
	let signups = weekendInformation.days[idAsArray[0]][idAsArray[1]].signups;
	let attendeesEmails = []
	wrap.replaceChildren();

	if (!signups.length) {
		wrap.innerText = "No Sign-Ups Currently";
		return;
	}
	for (let i = 0; i < signups.length; i++) {
		if (signups[i].status === "checkedIn") {attendeesEmails.push(signups[i].email)}
		let attendeeHTMLString = `<div class="attendeeWrap">
					<span class="attendeeNum">${i + 1}.</span>
					<span class="attendeeName">${signups[i].displayName}</span>
					<select class="statusSelect" id="${signups[i].email}" list="checkInOptions" placeholder="Status: ">
						<option ${signups[i].status === "checkedIn" ? "selected" : ""} value="checkedIn">Checked In</option>
						<option ${signups[i].status === "approved" ? "selected" : ""} value="approved">Approved</option>
						<option ${signups[i].status === "pending" ? "selected" : ""} value="pending">Pending</option>
						<option ${signups[i].status === "noShow" ? "selected" : ""} value="noShow">No-Show</option>
						<option ${signups[i].status === "removed" ? "selected" : ""} value="removed">Removed</option>
					</select>
				</div>`;
		wrap.insertAdjacentHTML("beforeend", attendeeHTMLString);
	}
	if (document.getElementById("sortType").innerHTML === "sort_by_alpha") {
		let array = Array.from(wrap.children);
		array.sort((a, b) => {
			return [a.childNodes[3].innerText, a.childNodes[3].innerText].sort()[0] === a.childNodes[3].innerText
				? -1
				: 1;
		});
		wrap.replaceChildren();
		for (let node of array) {
			wrap.appendChild(node);
		}
	}
	document.getElementById("mailLink").href = `mailto:${attendeesEmails.join(",")}?subject=${document.getElementById("windowHead").innerText}`;
};

const handleCheckIn = (e) => {
	document.getElementById("checkInWindow").classList.toggle("active");
	let event = e.target.parentElement.parentElement.parentElement;
	document.getElementById("windowHead").innerText = event.childNodes[0].childNodes[1].innerText;
	currentEventID = event.id;
	idAsArray = [Number(currentEventID[0]), Number(currentEventID.slice(2))];
	formatCheckIn();
};

document.getElementById("exitSignup").addEventListener("click", (e) => {
	e.target.parentElement.classList.toggle("active");
	formatCheckIn();
});

document.getElementById("sortType").addEventListener("click", (e) => {
	let button = e.target;
	button.innerText = button.innerText === "format_list_numbered" ? "sort_by_alpha" : "format_list_numbered";
	formatCheckIn();
});

document.getElementById("checkInSaveButton").onclick = () => {
	let statuses = document.querySelectorAll("#attendeesWrap .statusSelect");
	for (let status of statuses) {
		let attendeeStatus = status.value;
		for (let signupNum in weekendInformation.days[idAsArray[0]][idAsArray[1]].signups) {
			if (weekendInformation.days[idAsArray[0]][idAsArray[1]].signups[signupNum].email === status.id) {
				if (attendeeStatus === "removed") {
					weekendInformation.days[idAsArray[0]][idAsArray[1]].signups.splice(signupNum, 1);
					continue
				}
				weekendInformation.days[idAsArray[0]][idAsArray[1]].signups[signupNum].status = attendeeStatus;
			}
		}
	}
	setDoc(doc(db, "activeWeekend", "default"), { information: JSON.stringify(weekendInformation) })
		.then((val) => {
			document.getElementById("checkInWindow").classList.toggle("active");
		})
		.catch((error) => {
			alert(`Error saving statuses: ${error}`);
		});
};
