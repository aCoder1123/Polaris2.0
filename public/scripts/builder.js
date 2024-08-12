import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	getFirestore,
	doc,
	onSnapshot,
	collection,
	getDocs,
	setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { dataToFullHTML, daysOfTheWeek as weekDays } from "./htmlFromJSON.js";
import { addListeners } from "./index.js";
import { firebaseConfig } from "./config.js";
import { handleAuth } from "./authHandling.js";

class WeekendEvent {
	constructor(id) {
		(this.saveAsTemplate = document.getElementById("saveAsTemplate").checked),
			(this.id = id),
			(this.title = document.getElementById("titleIn").value);
		this.timeStart = document.getElementById("eventStart").value;
		this.timeEnd = document.getElementById("eventEnd").value;
		this.location = document.getElementById("eventLocation").value;
		this.travelTime = Number(document.getElementById("travelTime").value);
		this.description = document.getElementById("desc").value;
		this.faculty = document.getElementById("eventFaculty").value;
		this.numSpots = Number(document.getElementById("slotsIn").value);
		this.signups = [];
		this.admissionCriteria = document.getElementById("criteriaSelector").value;
	}

	get asInformation() {
		return {
			saveAsTemplate: this.saveAsTemplate,
			id: this.id,
			title: this.title,
			timeStart: this.timeStart,
			timeEnd: this.timeEnd,
			location: this.location,
			travelTime: this.travelTime,
			description: this.description,
			faculty: this.faculty,
			numSpots: this.numSpots,
			signups: this.numSpots,
			admissionCriteria: this.admissionCriteria,
		};
	}
}

class Weekend {
	constructor() {
		this.startDate = document.getElementById("startDate").value;
		this.endDate = document.getElementById("endDate").value;
		this.collectFeedback = document.getElementById("feedback").checked;
		this.days = [];
	}

	updateSelf() {
		let oldStart = this.startDate;
		let oldEnd = this.endDate;
		this.startDate = document.getElementById("startDate").value;
		this.endDate = document.getElementById("endDate").value;
		this.collectFeedback = document.getElementById("feedback").checked;

		if (this.startDate && this.endDate) {
			let startDate = new Date(this.startDate);
			let endDate = new Date(this.endDate);
			let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
			if (numDays > this.days.length) {
				for (let i = 0; i < numDays - this.days.length; i++) {
					if (this.startDate === oldStart) {
						this.days.push([]);
					} else {
						this.days.unshift([]);
					}
				}
			} else if (numDays < this.days.length) {
				for (let i = 0; i < this.days.length - numDays; i++) {
					if (this.startDate === oldStart) {
						this.days.pop([]);
					} else {
						this.days.shift([]);
					}
				}
			}
		}
		return this.startDate && this.endDate;
	}

	updateFromTemplate(template) {
		for (let i = 0; i < template.length; i++) {
			if (this.days.length - 1 < i) {
				this.days.push([]);
			} else {
				this.days[i].filter((event) => {
					return !event.template;
				});
			}
			for (let event of template[i]) {
				this.days[i].push(event);
			}
			this.sortDay(i);
		}
	}

	addEvent(event, index = 0) {
		this.days[index].push(event);
		this.sortDay(index);
	}

	sortDay(day = 0) {
		this.days[day].sort((a, b) => {
			return (
				Number(a.timeStart.slice(0, 2)) * 60 +
				Number(a.timeStart.slice(3)) -
				(Number(b.timeStart.slice(0, 2)) * 60 + Number(b.timeStart.slice(3)))
			);
		});
	}

	getInformation() {
		if (!this.isValid) {
			alert("Please enter valid information before saving.");
			return;
		}
		return { information: JSON.stringify(this) };
	}

	saveSelf(name = null) {
		for (let day of this.days) {
			for (let event of day) {
				if (event.saveAsTemplate) {
					delete event.saveAsTemplate;
					let eventData = Object.assign({}, event);
					eventData.faculty = null;
					setDoc(doc(db, "eventTemplates", eventData.title), eventData).catch((e) => {
						alert("Error in saving weekend. Please try again.");
						console.log(e);
						return;
					});
				}
			}
		}
		if (name) {
			let temp = { information: JSON.stringify(this.days), title: name };
			console.log(temp);
			setDoc(doc(db, "weekendTemplates", this.id), temp)
				.then(() => alert("Template Saved Succesfully"))
				.catch((e) => {
					alert("Error in saving. Please try again.");
					console.log(e);
				});
		} else {
			setDoc(doc(db, "weekends", this.id), this.getInformation())
				.then(() => alert("Weekend Saved Succesfully"))
				.catch((e) => {
					alert("Error in saving weekend. Please try again.");
					console.log(e);
				});
		}
	}

	get isValid() {
		return this.startDate && this.endDate;
	}
	get id() {
		return `${this.startDate}:${this.endDate}`;
	}
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "maindb");
// const [user, userinformation] = handleAuth(app);

let eventTemplates = {};
let weekendTemplates = {};
let workingWeekend = new Weekend();

let currentEventNum = 0;

getDocs(collection(db, "eventTemplates")).then((eventTemplateSnapshot) => {
	eventTemplateSnapshot.forEach((doc) => {
		let docData = doc.data();
		if (!docData) {
			return;
		}
		eventTemplates[docData.title] = docData;
		let option = document.createElement("option");
		option.value = docData.title;
		option.innerText = docData.title;
		document.getElementById("eventTemplateSelector").appendChild(option);
	});
});

getDocs(collection(db, "weekendTemplates")).then((weekendTemplateSnapshot) => {
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
						day.splice(i);
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
		!confirm(
			"Are you sure you want to save the current weekend? It will write over any weekend with identical dates."
		)
	) {
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
	if (
		!confirm(
			"Are you sure you want to save the current weekend template? It will write over any template with the same name."
		)
	) {
		return;
	}
	let name = prompt("Please enter a name for this template: ");

	workingWeekend.saveSelf(name);
};

document.getElementById("saveWeekendAsTemplateButton").onclick = saveWeekendAsTemplate;
