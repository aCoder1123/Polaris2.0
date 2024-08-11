import { Weekend, WeekendEvent, dataToFullHTML, daysOfTheWeek as weekDays } from "./utils";
import { addListeners } from "./index.js";
import { firebaseConfig } from "./config.js";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, collection, getDocs, setDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "maindb");

let eventTemplates = {};
let weekendTemplates = {};

let currentEventNum = 0;

let workingWeekend = new Weekend();


getDocs(collection(db, "eventTemplates")).then((eventTemplateSnapshot) => {
	eventTemplateSnapshot.forEach((doc) => {
		let docData = doc.data();
		if (!docData) {
			return;
		}
		let title = docData.title;
		Object.assign(eventTemplates, { title: docData });
		let option = document.createElement("option");
		option.value = docData.title;
		option.innerText = docData.title;
		document.getElementById("eventTemplateSelector").appendChild(option);
	});
});

getDocs(collection(db, "weekendTemplates")).then((weekendTemplateSnapshot) => {
	weekendTemplateSnapshot.forEach((doc) => {
		let docData = doc.data().information;
		if (!docData) {
			return;
		}
		let title = docData.title;
		docData = JSON.parse(docData);
		Object.assign(weekendTemplates, { title: docData });
		let option = document.createElement("option");
		option.value = docData.title;
		option.innerText = docData.title;
		document.getElementById("weekendTemplateSelector").appendChild(option);
	});
});


const updateWeekend = () => {
	let valid = workingWeekend.updateSelf();

	if (valid) {
		let wrap = document.getElementById("daysContainer");
		wrap.replaceChildren();
		let elements = dataToFullHTML(workingWeekend, true).querySelectorAll(".dayWrap");
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
			for (let day of workingWeekend) {
				for (let i = 0; i < day.length; i++) {
					if (day[i].id === eventNode.id) {
						day.splice(i)
					}
				}
			}
			eventNode.remove();
			updateWeekend();
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
	workingWeekend.updateFromTemplate(data);
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
			let diff = Number(input.value.slice(0, 2)) * 60 + Number(input.value.slice(3)) - (Number(inputTwo.value.slice(0, 2)) * 60 + Number(inputTwo.value.slice(3)));
			if (diff < 0) {
				valid = false;
				alert("Please enter valid times.");
				return;
			}
		}
	}

	let dayNum = Number(document.getElementById("daySelect").value);
	let eventToAdd = new WeekendEvent(currentEventNum)
	currentEventNum ++

	workingWeekend.addEvent(eventToAdd, dayNum);
	updateWeekend();
};

document.getElementById("eventSaveButton").onclick = saveEvent;

const saveWeekend = () => {
	if (!workingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (!confirm("Are you sure you want to save the current weekend? It will write over any weekend with identical dates.")) {
		return;
	}

	workingWeekend.saveSelf();
};

document.getElementById("saveWeekendButton").onclick = saveWeekend;

const saveWeekendAsTemplate = () => {
	if (!workingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (!confirm("Are you sure you want to save the current weekend template? It will write over any template with the same name.")) {
		return;
	}
	let name = prompt("Please enter a name for this template: ");

	workingWeekend.saveSelf(name);
};

document.getElementById("saveWeekendAsTemplateButton").onclick = saveWeekendAsTemplate;
