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
} from "./util.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
const functions = getFunctions(app);

const createWeekendEvents = httpsCallable(functions, "saveWeekendEvents");
const deleteEvent = httpsCallable(functions, "deleteEvent");

if (window.location.hostname === "127.0.0.1") {
	// connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator");
}

let eventTemplates = {};
let weekendTemplates = {};
let activeWeekend;
let queuedWeekend;
let editingWeekend;
let editingActiveWeekend = false;
let editingQueuedWeekend = false;
let students = [];
let workingWeekend = new Weekend();
let currentEventNum = 0;
let idsToDelete = [];

let firebaseUser;
let userInformation;

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			if (!data.isAdmin) window.location.href = "../index.html";
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
			addListeners();
		});

		getDocs(collection(db, "eventTemplates"))
			.then((eventTemplateSnapshot) => {
				eventTemplateSnapshot.forEach((doc) => {
					let docData = doc.data();
					if (!docData) return;
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
					if (!docData.title) return;
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
				students.sort((a, b) => ([a.displayName, b.displayName].sort()[0] === a.displayName ? -1 : 1));
				let htmlString = "";
				for (let student of students)
					htmlString += `<option value="${student.email}">${student.displayName}</option>`;
				document.getElementById("studentsList").insertAdjacentHTML("afterbegin", htmlString);
			})
			.catch(handleDBError);

		getDoc(doc(db, "activeWeekend", "queued"))
			.then((doc) => {
				if (doc.exists()) queuedWeekend = doc.data().information;
			})
			.catch(handleDBError);
		getDoc(doc(db, "activeWeekend", "default"))
			.then((doc) => {
				activeWeekend = doc.data().information;
			})
			.catch(handleDBError);
		addListeners();
	} else window.location.href = "../index.html";
});

const updateWeekend = () => {
	let valid = workingWeekend.updateSelf();
	if (valid) {
		let wrap = document.getElementById("weekendInfo");
		for (let node of document.querySelectorAll("body .dayWrap")) node.remove();
		let elements = dataToFullHTML(workingWeekend, "editor").querySelectorAll(".dayWrap");
		for (let i = elements.length - 1; i >= 0; i--) wrap.insertAdjacentElement("afterend", elements[i]);
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

	document.getElementById("debugCode").innerText = JSON.stringify(workingWeekend)
		.replaceAll(",", ",\n")
		.replaceAll("{", "{\n")
		.replaceAll("[", "[\n");
	addListeners();
	for (let deleteButton of document.querySelectorAll(".deleteButton")) {
		deleteButton.onclick = (e) => {
			let eventNode = e.target.parentElement.parentElement;
			for (let day of workingWeekend.days) {
				for (let i = 0; i < day.length; i++) {
					if (day[i].id === Number(eventNode.id)) {
						if (day[i].calID) idsToDelete.push(day[i].calID);
						day.splice(i, 1);
						updateWeekend();
						return;
					}
				}
			}
		};
	}
	for (let editButton of document.querySelectorAll(".editButton")) {
		editButton.onclick = (e) => {
			let eventNode = e.target.parentElement.parentElement;
			for (let day of workingWeekend.days) {
				for (let i = 0; i < day.length; i++) {
					if (day[i].id === Number(eventNode.id)) {
						if (day[i].admission.credited) return;
						if (day[i].calID) idsToDelete.push(day[i].calID);
						document.getElementById("titleIn").value = day[i].title;
						document.getElementById("desc").value = day[i].description;
						document.getElementById("eventLocation").value = day[i].location;
						document.getElementById("travelTime").value = day[i].travelTime;
						document.getElementById("eventFaculty").value = day[i].faculty;
						document.getElementById("slotsIn").value = day[i].numSpots;
						document.getElementById("eventCredit").value = day[i].admission.credit;
						document.getElementById("criteriaSelector").selectedIndex = [
							"signup",
							"advLottery",
							"creditLottery",
							"credit",
							"randLottery",
							"none",
						].indexOf(day[i].admission.val);
						document.getElementById("eventEnd").value = day[i].timeEnd;
						document.getElementById("eventStart").value = day[i].timeStart;
						document.getElementById("daySelect").selectedIndex = workingWeekend.days.indexOf(day);
						document.getElementById("saveAsTemplate").checked = day[i].saveAsTemplate;

						document.getElementById("eventFiltered").value = day[i].admission.filtered;
						for (let attendee of day[i].signups) {
							document.getElementById("mAttendeesList").insertAdjacentHTML(
								"beforeend",
								`<div class="mAttendeeWrap">
									<input required type="email" list="studentsList" class="attendeeInput" onchange="verifyAttendee(this)" value="${
										attendee.email
									}"/>
									<select class="statusSelect" placeholder="Status: ">
										<option ${attendee.status === "checkedIn" ? "selected" : ""} value="checkedIn">Checked In</option>
										<option ${attendee.status === "approved" ? "selected" : ""} value="approved">Approved</option>
										<option ${attendee.status === "pending" ? "selected" : ""} value="pending">Pending</option>
										<option ${attendee.status === "noShow" ? "selected" : ""} value="noShow">No-Show</option>
										<option ${attendee.status === "removed" ? "selected" : ""} value="removed">Removed</option>
									</select>
									<span class="material-symbols-outlined removeAttendee" onclick="this.parentElement.remove()">close</span>
								</div>`
							);
							for (let el of document.querySelectorAll(".attendeeInput")) el.onchange = verifyAttendee;
						}
						day.splice(i, 1);
						updateWeekend();
						return;
					}
				}
			}
		};
	}
};

for (let el of document.querySelectorAll("#settingsWrap input")) el.onchange = updateWeekend;

const toggleDebug = (e) => {
	document.getElementById("debugCode").classList.toggle("visible");
	e.target.innerText = e.target.innerText == "Hide Debug" ? "View Debug" : "Hide Debug";
};

document.getElementById("debugCodeButton").onclick = toggleDebug;

const updateEventFromTemplate = (e) => {
	let val = e.target.value;
	let data = eventTemplates[val];
	if (!data) return;
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
	for (let input of inputs) {
		if (!input.checkValidity()) {
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
			status: attendee.parentElement.childNodes[3].value,
		});
	}

	workingWeekend.addEvent(eventToAdd, dayNum);
	updateWeekend();
};

document.getElementById("eventSaveButton").onclick = saveEvent;
document.addEventListener("keypress", (e) => {
	if (e.key === "Enter") saveEvent();
});

const saveWeekend = async () => {
	if (!workingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (
		!confirm(
			"Are you sure you want to save the current weekend? It will write over the currently active or queued weekend."
		)
	)
		return;

	document.getElementById("saveWeekendButton").disabled = true;

	try {
		if (idsToDelete.length === 1) await deleteEvent({ eventID: idsToDelete[0] });
		else if (idsToDelete.length) await deleteEvent({ eventIDs: idsToDelete });
		idsToDelete = [];

		await workingWeekend.saveSelf(db, null, editingQueuedWeekend);
		await createWeekendEvents();
		alert("Weekend Saved Successfully");
		window.location.reload();
	} catch (error) {
		alert(`Error saving weekend: ${error.message}`);
	}
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
			if (student.email === input) return;
		}
	}
	alert("Please enter a valid email address.");
};

const addAttendee = () => {
	document.getElementById("mAttendeesList").insertAdjacentHTML(
		"afterbegin",
		`<div class="mAttendeeWrap">
			<input required type="email" list="studentsList" class="attendeeInput" onchange="verifyAttendee(this)"/>
			<select class="statusSelect" placeholder="Status: ">
				<option value="checkedIn">Checked In</option>
				<option selected value="approved">Approved</option>
				<option value="pending">Pending</option>
				<option value="noShow">No-Show</option>
				<option value="removed">Removed</option>
			</select>
			<span class="material-symbols-outlined removeAttendee" onclick="this.parentElement.remove()">close</span>
		</div>`
	);
	for (let el of document.querySelectorAll(".attendeeInput")) el.onchange = verifyAttendee;
};

document.getElementById("attendeeAdd").onclick = addAttendee;

const editCurrentWeekend = (e) => {
	if (!editingActiveWeekend && !editingQueuedWeekend) {
		e.target.innerText = "Edit New Weekend";
		if (queuedWeekend) {
			let choice = confirm(
				"There appears to be a weekend currently scheduled for release. Would you like to edit that weekend instead?"
			);
			editingActiveWeekend = !choice;
			editingQueuedWeekend = choice;
			if (choice) workingWeekend.updateFromString(queuedWeekend);
			else workingWeekend.updateFromString(activeWeekend);
		} else {
			editingActiveWeekend = true;
			workingWeekend.updateFromString(activeWeekend);
		}
		currentEventNum = 0;
		for (let dayNum in workingWeekend.days) {
			for (let eventNum in workingWeekend.days[dayNum]) {
				workingWeekend.days[dayNum][eventNum].id = currentEventNum;
				currentEventNum++;
			}
		}
		let startIn = document.getElementById("startDate");
		let endIn = document.getElementById("endDate");
		startIn.value = workingWeekend.startDate;
		endIn.value = workingWeekend.endDate;
		startIn.disabled = true;
		endIn.disabled = true;
		let release = document.getElementById("releaseDate");
		release.disabled = workingWeekend.release.released;
		release.value = workingWeekend.release.dateTime;
		let lottery = document.getElementById("lotteryDate");
		lottery.disabled = workingWeekend.admission.filtered;
		if (workingWeekend.admission.dateTime) lottery.value = workingWeekend.admission.dateTime;
		else lottery.value = "";
		document.getElementById("weekendDefaultTimes").disabled = true;
	} else {
		e.target.innerText = "Edit Active Weekend";
		editingActiveWeekend = false;
		editingQueuedWeekend = false;
		document.getElementById("startDate").disabled = false;
		document.getElementById("endDate").disabled = false;
		document.getElementById("releaseDate").disabled = false;
		document.getElementById("weekendDefaultTimes").disabled = false;
	}
	updateWeekend();
};

document.getElementById("editWeekend").onclick = editCurrentWeekend;

const editReleaseTime = () => {
	if (workingWeekend.release.released) return;
	let dateTimeString = document.getElementById("releaseDate").value;
	let newDate = new Date(dateTimeString);
	let current = new Date();
	let endDate = new Date(workingWeekend.endDate + "T23:59");
	if (newDate < current) {
		alert("Cannot set release to past time. To release immediately clear the release date.");
		document.getElementById("releaseDate").value = "";
		return;
	}
	if (endDate < newDate) {
		alert("Cannot set release to after the schedule ends.");
		document.getElementById("releaseDate").value = "";
		return;
	}

	workingWeekend.release.dateTime = dateTimeString;
	updateWeekend();
};

document.getElementById("releaseDate").onchange = editReleaseTime;

const editLotteryTime = () => {
	if (workingWeekend.admission.filtered) return;
	let dateTimeString = document.getElementById("lotteryDate").value;
	let newDate = new Date(dateTimeString);
	let current = new Date();
	let startDate = new Date(workingWeekend.startDate);
	let endDate = new Date(workingWeekend.endDate + "T23:59");
	if (newDate < current) {
		alert("Cannot set lottery to past time.");
		document.getElementById("releaseDate").value = "";
		return;
	}
	if (startDate > newDate) {
		alert("Cannot set release to before the schedule starts. To release immediately leave this field blank.");
		document.getElementById("releaseDate").value = "";
		return;
	}
	if (endDate < newDate) {
		alert("Cannot set release to after the schedule ends.");
		document.getElementById("releaseDate").value = "";
		return;
	}
	workingWeekend.admission.dateTime = dateTimeString;
	updateWeekend();
};

document.getElementById("lotteryDate").onchange = editLotteryTime;

const clearDays = () => {
	if (!confirm("Are you sure you want to delete all events? This cannot be reverted.")) return;
	for (let dayNum in workingWeekend.days) {
		for (let eventNum in workingWeekend.days[dayNum]) {
			if (workingWeekend.days[dayNum][eventNum].calID)
				idsToDelete.push(workingWeekend.days[dayNum][eventNum].calID);
		}
		workingWeekend.days[dayNum] = [];
	}
	updateWeekend();
};

document.getElementById("clearBtn").onclick = clearDays;

addListeners();

document.getElementById("settingsCollapse").onclick = (e) =>
	document.getElementById("settingsHead").classList.toggle("open");

document.getElementById("weekendDefaultTimes").onclick = () => {
	let startDate = new Date();
	startDate.setHours(12 - startDate.getTimezoneOffset() / 60, 0, 0, 0);
	startDate.setDate(startDate.getDate() + ((7 + 5 - startDate.getDay()) % 7)); //the next friday
	document.getElementById("startDate").value = startDate.toISOString().substring(0, 10);
	document.getElementById("lotteryDate").value = startDate.toISOString().substring(0, 16);
	startDate.setDate(startDate.getDate() + 2);
	document.getElementById("endDate").value = startDate.toISOString().substring(0, 10);
	startDate.setDate(startDate.getDate() - 3);
	startDate.setHours(8 - startDate.getTimezoneOffset() / 60, 0, 0, 0);
	document.getElementById("releaseDate").value = startDate.toISOString().substring(0, 16);

	document.getElementById("startDate").dispatchEvent(new Event("change"));
	document.getElementById("endDate").dispatchEvent(new Event("change"));
	document.getElementById("releaseDate").dispatchEvent(new Event("change"));
	document.getElementById("lotteryDate").dispatchEvent(new Event("change"));
};
