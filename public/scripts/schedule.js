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
	setDoc,
	getDoc,
	query,
	collection,
	where,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { firebaseConfig, siteKey } from "./config.js";
import {
	dataToFullHTML,
	addListeners,
	getUserFromEmail,
	getMenuHTMLString,
	handleDBError,
	FunctionQueue,
} from "./util.js";

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

if (window.location.hostname === "localhost") {
	// connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator");
}

const handleSignupFunc = httpsCallable(functions, "handleSignup");
const printRosterFunc = httpsCallable(functions, "printRoster");
const manageAttendeesFunc = httpsCallable(functions, "manageAttendees");

let scheduleType = "schedule";
let userInformation;
let firebaseUser;
let weekendInformation;
let students = [];
let studentsMap = {};

let currentEventID;
let idAsArray;

let openIDs = [];
let signupQueue = new FunctionQueue(handleSignupFunc, (val) => {
	if (val.message) {
		alert(
			"An error occurred when signing up for the trip. The page will reload and you can try again. If the error persists please fill out a bug report."
		);
		window.location.reload();
		return;
	}
	setTimeout(() => {
		for (let el of signupQueue.queue) {
			document.querySelectorAll(".addIcon").forEach((node) => {
				if (node.parentElement.parentElement.parentElement.id === el.id) {
					if (!node.classList.contains("loading")) node.classList.toggle("loading");
					node.innerText = "progress_activity";
				}
			});
		}
	}, 50);
});

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			userInformation = data;
			if (userInformation.isAdmin) {
				scheduleType = "admin";
				const q = query(collection(db, "users"), where("isAdmin", "==", false));

				getDocs(q)
					.then((docs) => {
						docs.forEach((student) => {
							students.push(student.data());
							studentsMap[student.id] = student.data();
						});
						students.sort((a, b) => ([a.displayName, b.displayName].sort()[0] === a.displayName ? -1 : 1));
						let htmlString = "";
						for (let student of students)
							htmlString += `<option value="${student.email}">${student.displayName}</option>`;
						document.getElementById("studentsList").insertAdjacentHTML("afterbegin", htmlString);
					})
					.catch(handleDBError);
				document.getElementById("addAttendee").onclick = async (e) => {
					let emailIn = document.getElementById("attendeeInput");
					e.target.disabled = true;
					if (!emailIn.checkValidity()) {
						alert("Please enter a valid email address.");
						return;
					}
					let email = emailIn.value;
					if (!studentsMap[email]) {
						alert("Please enter the email address of a student.");
						return;
					}
					if (!document.getElementById("attendeeNumIn").checkValidity()) {
						alert("Please enter which spot you would like to add this attendee to.");
						return;
					}
					let attendeeInfo = {
						status: "checkedIn",
						email: email,
						displayName: studentsMap[email].displayName,
					};
					weekendInformation.days[idAsArray[0]][idAsArray[1]].signups.splice(
						document.getElementById("attendeeNumIn").value - 1,
						0,
						attendeeInfo
					);

					await setDoc(doc(db, "activeWeekend", "default"), {
						information: JSON.stringify(weekendInformation),
					})
						.then((val) => {
							formatCheckIn();
						})
						.catch((error) => {
							alert(`Error saving statuses: ${error}`);
						});
					emailIn.value = "";
					document.getElementById("attendeeNumIn").value = "";
					e.target.disabled = false;
				};
			}

			const unsub = onSnapshot(doc(db, "activeWeekend", "default"), (doc) => {
				weekendInformation = JSON.parse(doc.data().information);
				let wrap = document.body;
				let positionList = [];
				for (let node of document.querySelectorAll("body .dayWrap")) {
					positionList.push(node.scrollTop);
					node.remove();
				}
				let nodes = dataToFullHTML(weekendInformation, scheduleType, userInformation.email, openIDs);

				let elements = nodes.querySelectorAll(".dayWrap");
				for (let i = 0; i < elements.length; i++) {
					wrap.append(elements[i]);
				}

				let wrapNodes = document.querySelectorAll(".dayWrap");
				for (let num = 0; num < wrapNodes.length; num++) {
					wrapNodes[num].scroll(0, positionList[num]);
				}

				addListeners(openIDs);
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
				if (idAsArray) formatCheckIn();
			});
		});

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
				addListeners(openIDs);
			});
			addListeners(openIDs);
		});
	} else {
		window.location.href = `index.html`;
	}
});

const handleSignup = async (e) => {
	let button = e.target;
	let eID = button.parentElement.parentElement.parentElement.id;
	if (button.innerText === "progress_activity" || signupQueue.queue.includes({ id: eID })) return;
	button.innerText = "progress_activity";
	button.classList.toggle("loading");
	signupQueue.add({ id: eID });
};

const formatCheckIn = () => {
	let wrap = document.getElementById("attendeesWrap");
	let event = weekendInformation.days[idAsArray[0]][idAsArray[1]];
	let signups = event.signups;
	let attendeesEmails = [];
	wrap.replaceChildren();

	document.getElementById("attendeeNumIn").max = signups.length + 1;
	if (!signups.length) {
		wrap.innerText = "No Sign-Ups Currently";
		document.getElementById("mailLink").href = `mailto:${userInformation.email}`;
		return;
	}
	for (let i = 0; i < signups.length; i++) {
		if (signups[i].status === "checkedIn") {
			attendeesEmails.push(signups[i].email);
		}
		let attendeeHTMLString = `<div class="attendeeWrap">
					<span class="attendeeNum">${i + 1}.</span>
					<span class="attendeeName ${signups[i].status}">${signups[i].displayName}</span>
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
			return [a.childNodes[3].innerText, b.childNodes[3].innerText].sort()[0] === a.childNodes[3].innerText
				? -1
				: 1;
		});
		wrap.replaceChildren();
		for (let node of array) {
			wrap.appendChild(node);
		}
	}
	document.querySelectorAll(".statusSelect").forEach((el) => {
		el.onchange = () => {
			saveCheckIn(true);
		};
	});
	document.getElementById("mailLink").href = `mailto:${attendeesEmails.join(",")}?subject=${
		document.getElementById("windowHead").innerText
	}`;
	document.getElementById("numSpots").innerText = event.numSpots;
	document.getElementById("checkedInNum").innerText = attendeesEmails.length;
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

const saveCheckIn = async (persist = false) => {
	let statuses = document.querySelectorAll("#attendeesWrap .statusSelect");
	for (let status of statuses) {
		let attendeeStatus = status.value;
		for (let signupNum in weekendInformation.days[idAsArray[0]][idAsArray[1]].signups) {
			if (weekendInformation.days[idAsArray[0]][idAsArray[1]].signups[signupNum].email === status.id) {
				if (attendeeStatus === "removed") {
					weekendInformation.days[idAsArray[0]][idAsArray[1]].signups.splice(signupNum, 1);
					continue;
				}
				weekendInformation.days[idAsArray[0]][idAsArray[1]].signups[signupNum].status = attendeeStatus;
			}
		}
	}
	await setDoc(doc(db, "activeWeekend", "default"), { information: JSON.stringify(weekendInformation) })
		.then((val) => {
			if (!persist) {
				document.getElementById("checkInWindow").classList.toggle("active");
			}
			manageAttendeesFunc({ id: idAsArray })
				.catch((error) => {
					alert(`Error saving statuses: ${error}`);
				});
			formatCheckIn();
		})
		.catch((error) => {
			alert(`Error saving statuses: ${error}`);
		});
};

document.getElementById("checkInSaveButton").onclick = saveCheckIn;

document.getElementById("attendeesPrint").onclick = async (e) => {
	await saveCheckIn();
	try {
		await printRosterFunc({ idAsArray: idAsArray });
		alert("Roster printed to the Marry Leads Room printer");
	} catch (error) {
		alert(`Error printing roster: ${error.message}`);
	}
};
