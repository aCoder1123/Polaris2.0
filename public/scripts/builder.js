import { dataToFullHTML, daysOfTheWeek as weekDays } from "./htmlFromJSON.js";
import { addListeners } from "./index.js";

const templates = {};

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
		if (document.getElementById("template").value) {
			this.days = JSON.parse(JSON.stringify(templates[document.getElementById("template").value].days));
		} else if (this.startDate && this.endDate) {
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

	addEvent(event, index = 0) {
		this.days[index].push(event);
		this.days[index].sort((a, b) => {
			return Number(a.timeStart.slice(0, 2)) * 60 + Number(a.timeStart.slice(3)) - (Number(b.timeStart.slice(0, 2)) * 60 + Number(b.timeStart.slice(3)));
		});
	}

	getInformation() {
		if (!this.valid) {
			alert("Please enter valid information before saving.");
			return;
		}
		let info = {
			startDate: this.startDate,

		};
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
	};

	currentWorkingWeekend.addEvent(eventToAdd, dayNum);
	updateWeekend();
};

document.getElementById("eventSaveButton").onclick = saveEvent;
