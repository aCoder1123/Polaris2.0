import { dataToFullHTML, daysOfTheWeek as weekDays } from "./htmlFromJSON.js";
import { addListeners } from "./index.js";
import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, onSnapshot, collection, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app, 'maindb');


let eventTemplates = {};

const eventTemplateSnapshot = await getDocs(collection(db, "eventTemplates"));
eventTemplateSnapshot.forEach((doc) => {
	let docData = doc.data()
	eventTemplates[docData.title] = docData;
	let option = document.createElement("option");
	option.value = docData.title
	option.innerText = docData.title
	document.getElementById("eventTemplateSelector").appendChild(option)
});

console.log(eventTemplates)

let weekendTemplates = {};

const weekendTemplateSnapshot = await getDocs(collection(db, "weekendTemplates"));
weekendTemplateSnapshot.forEach((doc) => {
	let docData = doc.data().information;
	if (!docData) {return}
	docData = JSON.parse(docData);
	weekendTemplates[doc.data().title] = docData;
	let option = document.createElement("option");
	option.value = docData.title;
	option.innerText = docData.title;
	document.getElementById("weekendTemplateSelector").appendChild(option);
});

console.log(weekendTemplates)

class weekendInformation {
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
			return Number(a.timeStart.slice(0, 2)) * 60 + Number(a.timeStart.slice(3)) - (Number(b.timeStart.slice(0, 2)) * 60 + Number(b.timeStart.slice(3)));
		});
	}

	getInformation() {
		if (!this.isValid) {
			alert("Please enter valid information before saving.");
			return;
		}
		return {information: JSON.stringify(this)};
	}

	saveSelf(name = null) {
		for (let day of this.days) {
			for (let event of day) {
				if (event.saveAsTemplate) {
					delete event.saveAsTemplate
					let eventData = Object.assign({}, event)
					eventData.faculty = null
					setDoc(doc(db, "eventTemplates", eventData.title), eventData)
						.catch((e) => {
							alert("Error in saving weekend. Please try again.");
							console.log(e);
							return
						});
				}
			}
		}
		if (name) {
			let temp = {information: JSON.stringify(this.days), title: name}
			console.log(temp)
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

let currentWorkingWeekend = new weekendInformation();

const updateWeekend = () => {
	let valid = currentWorkingWeekend.updateSelf();

	if (valid) {
		let wrap = document.getElementById("daysContainer");
		wrap.replaceChildren();
		let elements = dataToFullHTML(currentWorkingWeekend, true).querySelectorAll(".dayWrap");
		for (let i = 0; i < elements.length; i++) {
			wrap.append(elements[i]);
		}

		const startDate = new Date(currentWorkingWeekend.startDate + "T00:00:00");
		const startDay = startDate.getDay();

		let select = document.getElementById("daySelect");
		select.replaceChildren();
		let option = document.createElement("option");

		for (let i = 0; i < currentWorkingWeekend.days.length; i++) {
			option = document.createElement("option");

			option.value = i;
			option.innerText = weekDays[(startDay + i) % 7];
			select.appendChild(option);
		}
	}

	document.getElementById("debugCode").innerText = JSON.stringify(currentWorkingWeekend);
	addListeners();
	for (let deleteButton of document.querySelectorAll(".deleteButton")) {
		deleteButton.onclick = (e) => {
			let eventNode = e.target.parentElement.parentElement;
			let eventDay = currentWorkingWeekend.days[Number(eventNode.id.slice(0, 1))];
			eventDay.splice(Number(eventNode.id.slice(2)));
			eventNode.remove();
			updateWeekend();
		};
	}
};

for (let el of document.querySelectorAll("#settingsWrap>*")) {
	el.onchange = updateWeekend;
}

const toggleDebug = (e) => {
	document.getElementById("debugCode").classList.toggle("visible");
	e.target.innerText = e.target.innerText == "Hide Debug" ? "View Debug" : "Hide Debug";
};

document.getElementById("debugCodeButton").onclick = toggleDebug;

const updateEventFromTemplate = (e) => {
	let val = e.target.value
	let data = eventTemplates[val]
	document.getElementById("eventStart").value = data.timeStart
	document.getElementById("eventEnd").value = data.timeEnd
	document.getElementById("titleIn").value = data.title
	document.getElementById("eventLocation").value = data.location
	document.getElementById("travelTime").value = data.travelDuration
	document.getElementById("desc").value = data.description
	document.getElementById("slotsIn").value = data.numSpots
}

document.getElementById("eventTemplateSelector").onchange = updateEventFromTemplate

const updateWeekendFromTemplate = (e) => {
	let val = e.target.value;
	let data = weekendTemplates[val];
	currentWorkingWeekend.updateFromTemplate(data)
	updateWeekend()
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
	let eventToAdd = {
		saveAsTemplate: document.getElementById("saveAsTemplate").checked,
		id: `${dayNum}-${currentWorkingWeekend.days[dayNum].length}`,
		title: document.getElementById("titleIn").value,
		timeStart: document.getElementById("eventStart").value,
		timeEnd: document.getElementById("eventEnd").value,
		location: document.getElementById("eventLocation").value,
		travelDuration: Number(document.getElementById("travelTime").value),
		description: document.getElementById("desc").value,
		faculty: document.getElementById("eventFaculty").value,
		numSpots: Number(document.getElementById("slotsIn").value),
		signups: [],
		admissionCriteria: document.getElementById("criteriaSelector").value
	};

	currentWorkingWeekend.addEvent(eventToAdd, dayNum);
	updateWeekend();
};

document.getElementById("eventSaveButton").onclick = saveEvent;

const saveWeekend = () => {
	if (!currentWorkingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (!confirm("Are you sure you want to save the current weekend? It will write over any weekend with identical dates.")) {
		return;
	}

	currentWorkingWeekend.saveSelf()

};

document.getElementById("saveWeekendButton").onclick = saveWeekend;

const saveWeekendAsTemplate = () => {
	if (!currentWorkingWeekend.isValid) {
		alert("Please enter valid weekend information.");
		return;
	}
	if (!confirm("Are you sure you want to save the current weekend template? It will write over any template with the same name.")) {
		return;
	}
	let name = prompt("Please enter a name for this template: ")

	currentWorkingWeekend.saveSelf(name);
}

document.getElementById("saveWeekendAsTemplateButton").onclick = saveWeekendAsTemplate