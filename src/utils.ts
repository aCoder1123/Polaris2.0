import { firebaseConfig } from "./config.js";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, collection, getDocs, setDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "maindb");

export const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parser = new DOMParser();

type AdmissionCriteria = "Normal Signup" | "Advanced Lottery" | "Credit Lottery" | "Pure Credit" | "Random Lottery";

export class WeekendEvent {
	saveAsTemplate: boolean;
	id: number;
	title: string;
	timeStart: string;
	timeEnd: string;
	location: string;
	travelTime: number;
	description: string;
	faculty: string;
	numSpots: number;
	signups: any[];
	admissionCriteria: AdmissionCriteria;

	constructor(id: number) {
		(this.saveAsTemplate = (document.getElementById("saveAsTemplate") as HTMLInputElement).checked), (this.id = id), (this.title = (document.getElementById("titleIn") as HTMLInputElement).value);
		this.timeStart = (document.getElementById("eventStart") as HTMLInputElement).value;
		this.timeEnd = (document.getElementById("eventEnd") as HTMLInputElement).value;
		this.location = (document.getElementById("eventLocation") as HTMLInputElement).value;
		this.travelTime = Number((document.getElementById("travelTime") as HTMLInputElement).value);
		this.description = (document.getElementById("desc") as HTMLTextAreaElement).value;
		this.faculty = (document.getElementById("eventFaculty") as HTMLInputElement).value;
		this.numSpots = Number((document.getElementById("slotsIn") as HTMLInputElement).value);
		this.signups = [];
		this.admissionCriteria = (document.getElementById("criteriaSelector") as HTMLSelectElement).value as AdmissionCriteria;
	}

	get asInformation(): object {
		return { saveAsTemplate: this.saveAsTemplate, id: this.id, title: this.title, timeStart: this.timeStart, timeEnd: this.timeEnd, location: this.location, travelTime: this.travelTime, description: this.description, faculty: this.faculty, numSpots: this.numSpots, signups: this.numSpots, admissionCriteria: this.admissionCriteria };
	}
}

export class Weekend {
	startDate: string;
	endDate: string;
	collectFeedback: boolean;
	days: any = [[]];
	constructor() {
		this.startDate = "";
		this.endDate = "";
		this.collectFeedback = true;
	}

	updateSelf() {
		let oldStart = this.startDate;
		let oldEnd = this.endDate;
		this.startDate = (document.getElementById("startDate") as HTMLInputElement).value;
		this.endDate = (document.getElementById("endDate") as HTMLInputElement).value;
		this.collectFeedback = (document.getElementById("feedback") as HTMLInputElement).checked;

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

	updateFromTemplate(template: any) {
		for (let i = 0; i < template.length; i++) {
			if (this.days.length - 1 < i) {
				this.days.push([]);
			} else {
				this.days[i].filter((event: WeekendEvent) => {
					return !event.saveAsTemplate;
				});
			}
			for (let event of template[i]) {
				this.days[i].push(event);
			}
			this.sortDay(i);
		}
	}

	addEvent(event: WeekendEvent, index = 0) {
		this.days[index].push(event.asInformation);
		this.sortDay(index);
	}

	sortDay(day = 0) {
		this.days[day].sort((a: WeekendEvent, b: WeekendEvent) => {
			return Number(a.timeStart.slice(0, 2)) * 60 + Number(a.timeStart.slice(3)) - (Number(b.timeStart.slice(0, 2)) * 60 + Number(b.timeStart.slice(3)));
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
					setDoc(doc(db, "eventTemplates", eventData.title), eventData).catch((e: any) => {
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
				.catch((e: any) => {
					alert("Error in saving. Please try again.");
					console.log(e);
				});
		} else {
			setDoc(doc(db, "weekends", this.id), this.getInformation())
				.then(() => alert("Weekend Saved Succesfully"))
				.catch((e: any) => {
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

export const dataToFullHTML = (information: any, editor = false) => {
	let fullHTMLString = "";

	const startDate = new Date(information.startDate + "T00:00:00");
	const startDay = startDate.getDay();
	const endDate = new Date(information.endDate + "T00:00:00");
	let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
	while (information.days.length < numDays) {
		information.days.push([]);
	}
	for (let i = 0; i < numDays; i++) {
		let eventsHTMLString = "";

		for (let event of information.days[i]) {
			let attendeesString = "";
			for (let element of event.signups) {
				attendeesString += `<li class="attendee ${element.status}">${element.first} ${element.last}</li>`;
			}

			eventsHTMLString += `<div class="eventWrap" id="${event.id && editor ? event.id : ""}"><div class="eventHeadWrap eIWrap"><span class="material-symbols-outlined collapse"> expand_circle_right </span><h2 class="eventTitle">${event.title}</h2><span class="eventTime">${event.timeStart}-${event.timeEnd}</span>${editor ? '<span class="material-symbols-outlined addIcon deleteButton">delete</span>' : ""}</div><div class="eventInfoWrap"><div class="eventLocationWrap eIWrap"><span class="material-symbols-outlined"> location_on </span><span class="eventAddress">${event.location}</span><span class="material-symbols-outlined locationCopy"> content_copy </span></div><div class="travelWrap eIWrap"><span class="material-symbols-outlined"> airport_shuttle </span><span class="travelTime">${
				event.travelDuration
			} min</span></div><div class="eventLeadWrap eIWrap"><span class="material-symbols-outlined"> person </span><span class="eventLeader">T. ${event.faculty /*[0].first*/}</span></div><div class="descWrap eIWrap"><span class="material-symbols-outlined descIcon"> description </span><p class="eventDesc">${event.description}</p></div><div class="attendeesWrap eIWrap">${editor ? '<span class="material-symbols-outlined">block</span>' : '<span class="material-symbols-outlined addIcon"> add_circle </span>'}<span class="singedUpNum">${event.signups.length}</span>/<span class="eventSpots">${event.numSpots ? event.numSpots : '<span class="material-symbols-outlined">all_inclusive</span>'} ${
				event.admissionCriteria && event.admissionCriteria != "Normal Signup" ? `(${event.admissionCriteria})` : ""
			} </span><ol class="attendeesList">${attendeesString}</ol></div></div></div>`;
		}

		fullHTMLString += `<section class="dayWrap open">
				<div class="dayHeadWrap">
					<svg xmlns="http://www.w3.org/2000/svg" class="collapse dayCollapse open" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
					<h2 class="dayHead">${daysOfTheWeek[(startDay + i) % 7]}</h2>
				</div>
                <div class="eventsContainer">${eventsHTMLString}</div>
                </section>`;
	}

	return parser.parseFromString(fullHTMLString, "text/html");
};

// export { dataToFullHTML, daysOfTheWeek, Weekend, WeekendEvent };
