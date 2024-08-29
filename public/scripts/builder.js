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
	query,
	where,
	connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	dataToFullHTML,
	daysOfTheWeek as weekDays,
	addListeners,
	Weekend,
	WeekendEvent,
	getUserFromEmail,
	handleDBError,
} from "./util.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);

const db = getFirestore(app, "maindb");

// if (window.location.hostname === "127.0.0.1") {
// 	connectFirestoreEmulator(db, "127.0.0.1", 8080);
// 	console.log("Connecting Firebase Emulator")
// }

let eventTemplates = {};
let weekendTemplates = {};
let activeWeekend;
let editingActiveWeekend = false;
let students = [];
let workingWeekend = new Weekend();
let currentEventNum = 0;

let firebaseUser;
let userInformation;

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db).then((data) => {
			if (!data.isAdmin) {
				// window.location.href = "../index.html";
			}
			userInformation = data;
		});

		let pfp = document.querySelector("#menuPF img");
		if (pfp) {
			pfp.loading = "lazy";
			pfp.src = user.photoURL;
			document.getElementById("userName").innerText = user.displayName;
		}

		getDocs(collection(db, "eventTemplates"))
			.then((eventTemplateSnapshot) => {
				eventTemplateSnapshot.forEach((doc) => {
					let docData = doc.data();
					if (!docData) {
						return;
					}
					eventTemplates[docData.title] = docData;
					let option = document.createElement("option");
					option.value = docData.title;
					option.innerText = docData.title;
					document.getElementById("eventTemplateList").appendChild(option);
				});
			})
			.catch(handleDBError);

		getDocs(collection(db, "weekendTemplates"))
			.then((weekendTemplateSnapshot) => {
				weekendTemplateSnapshot.forEach((doc) => {
					let docData = doc.data();
					if (!docData.title) {
						return;
					}
					let title = docData.title;
					docData = JSON.parse(docData.information);
					weekendTemplates[title] = docData;
					let option = document.createElement("option");
					option.value = title;
					option.innerText = title;
					document.getElementById("weekendTemplateSelector").appendChild(option);
				});
			})
			.catch(handleDBError);

		const q = query(collection(db, "users"), where("isAdmin", "==", false));

		getDocs(q)
			.then((docs) => {
				docs.forEach((student) => {
					students.push(student.data());
				});
				students.sort((a, b) => {
					return [a.displayName, b.displayName].sort()[0] === a.displayName ? -1 : 1;
				});
				let htmlString = "";
				for (let student of students) {
					htmlString += `<option value="${student.email}">${student.displayName}</option>`;
				}
				document.getElementById("studentsList").insertAdjacentHTML("afterbegin", htmlString);
			})
			.catch(handleDBError);

		getDoc(doc(db, "activeWeekend", "default"))
			.then((doc) => {
				activeWeekend = doc.data().information;
			})
			.catch(handleDBError);
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
	let valid = workingWeekend.updateSelf();

	if (valid) {
		let wrap = document.getElementsByTagName("body")[0];
		for (let node of document.querySelectorAll("body .dayWrap")) {
			node.remove();
		}
		let elements = dataToFullHTML(workingWeekend, "editor").querySelectorAll(".dayWrap");
		for (let i = 0; i < elements.length; i++) {
			wrap.append(elements[i]);
		}

		const startDate = new Date(workingWeekend.startDate + "T00:00:00");
		const startDay = startDate.getDay();

		let select = document.getElementById("daySelect");
		select.replaceChildren();
		let option = document.createElement("option");

		for (let i = 0; i < workingWeekend.days.length; i++) {
			option = document.createElement("option");

			option.value = i;
			option.innerText = weekDays[(startDay + i) % 7];
			select.appendChild(option);
		}
	}

	document.getElementById("debugCode").innerText = JSON.stringify(workingWeekend);
	addListeners();
	for (let deleteButton of document.querySelectorAll(".deleteButton")) {
		deleteButton.onclick = (e) => {
			let eventNode = e.target.parentElement.parentElement;
			for (let day of workingWeekend.days) {
				for (let i = 0; i < day.length; i++) {
					if (day[i].id === Number(eventNode.id)) {
						day.splice(i, 1);
						console.log("removing");
						updateWeekend();
						return;
					}
				}
			}
		};
	}
};

for (let el of document.querySelectorAll("#settingsWrap input")) {
	el.onchange = updateWeekend;
}

const toggleDebug = (e) => {
	document.getElementById("debugCode").classList.toggle("visible");
	e.target.innerText = e.target.innerText == "Hide Debug" ? "View Debug" : "Hide Debug";
};

document.getElementById("debugCodeButton").onclick = toggleDebug;

const updateEventFromTemplate = (e) => {
	let val = e.target.value;
	let data = eventTemplates[val];
	if (!data) return
	document.getElementById("eventStart").value = data.timeStart;
	document.getElementById("eventEnd").value = data.timeEnd;
	document.getElementById("titleIn").value = data.title;
	document.getElementById("eventLocation").value = data.location;
	document.getElementById("travelTime").value = data.travelDuration;
	document.getElementById("desc").value = data.description;
	document.getElementById("slotsIn").value = data.numSpots;
};

document.getElementById("eventTemplateSelector").onchange = updateEventFromTemplate;

const updateWeekendFromTemplate = (e) => {
	let val = e.target.value;
	let data = weekendTemplates[val];
	currentEventNum = workingWeekend.updateFromTemplate(data, currentEventNum);
	updateWeekend();
};

document.getElementById("weekendTemplateSelector").onchange = updateWeekendFromTemplate;

const saveEvent = () => {
	let inputs = document.querySelectorAll("#eventCreatorWrap input, #eventCreatorWrap select");
	let valid = true;
	for (let input of inputs) {
		valid = input.checkValidity();
		if (!valid) {
			alert("Please enter valid event information.");
			return;
		}
		if (input.id === "eventEnd") {
			let inputTwo = document.getElementById("eventStart");
			let diff =
				Number(input.value.slice(0, 2)) * 60 +
				Number(input.value.slice(3)) -
				(Number(inputTwo.value.slice(0, 2)) * 60 + Number(inputTwo.value.slice(3)));
			if (diff < 0) {
				valid = false;
				alert("Please enter valid times.");
				return;
			}
		}
	}

	let dayNum = Number(document.getElementById("daySelect").value);
	let eventToAdd = new WeekendEvent(currentEventNum);
	currentEventNum++;

	for (let attendee of document.querySelectorAll(".attendeeInput")) {
		let attendeeInfo;
		for (let student of students) {
			if (student.email === attendee.value) {
				attendeeInfo = student;
				break;
			}
		}
		if (!attendeeInfo) {
			alert("Attendee not found. Please revise attendee information.");
			return;
		}

		eventToAdd.signups.push({
			displayName: attendeeInfo.displayName,
			email: attendeeInfo.email,
			status: "approved",
		});
	}

	workingWeekend.addEvent(eventToAdd, dayNum);
	updateWeekend();
};

document.getElementById("eventSaveButton").onclick = saveEvent;
document.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		saveEvent();
	}
});

const saveWeekend = () => {
	if (!workingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (
		!confirm("Are you sure you want to save the current weekend? It will write over the currently active weekend.")
	) {
		return;
	}

	workingWeekend.saveSelf(db);
};

document.getElementById("saveWeekendButton").onclick = saveWeekend;

const saveWeekendAsTemplate = () => {
	if (!workingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (
		!confirm(
			"Are you sure you want to save the current weekend template? It will write over any template with the same name."
		)
	) {
		return;
	}
	let name = prompt("Please enter a name for this template: ");
	if (!name) return;

	workingWeekend.saveSelf(db, name);
};

document.getElementById("saveWeekendAsTemplateButton").onclick = saveWeekendAsTemplate;

const verifyAttendee = (e) => {
	if (e.target.checkValidity()) {
		let input = e.target.value;
		for (let student of students) {
			if (student.email === input) {
				return;
			}
		}
	}
	alert("Please enter a valid email address.");
};

const addAttendee = () => {
	document.getElementById("mAttendeesList").insertAdjacentHTML(
		"afterbegin",
		`<div class="mAttendeeWrap">
			<input required type="email" list="studentsList" class="attendeeInput" onchange="verifyAttendee(this)"/>
			<span class="material-symbols-outlined removeAttendee" onclick="this.parentElement.remove()">cancel</span>
		</div>`
	);
	for (let el of document.querySelectorAll(".attendeeInput")) {
		el.onchange = verifyAttendee;
	}
};

document.getElementById("attendeeAdd").onclick = addAttendee;

const editCurrentWeekend = (e) => {
	if (!editingActiveWeekend) {
		e.target.innerText = "Edit New Weekend";
		editingActiveWeekend = true;
		workingWeekend.updateFromString(activeWeekend);
		let startIn = document.getElementById("startDate");
		let endIn = document.getElementById("endDate");
		startIn.value = workingWeekend.startDate;
		endIn.value = workingWeekend.endDate;
		startIn.disabled = true;
		endIn.disabled = true;
	} else {
		e.target.innerText = "Edit Active Weekend";
		editingActiveWeekend = false;
		let startIn = document.getElementById("startDate");
		let endIn = document.getElementById("endDate");
		startIn.disabled = false;
		endIn.disabled = false;
	}
	updateWeekend();
};

document.getElementById("editWeekend").onclick = editCurrentWeekend;

addListeners();
