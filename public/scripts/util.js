import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parser = new DOMParser();

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
			signups: [],
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

	updateFromTemplate(template, num) {
		for (let i = 0; i < this.days.length; i++) {
			this.days[i] = this.days[i].filter((event) => {
				return !event.template;
			});
		}
		if (!template) return num;
		for (let i = 0; i < template.length; i++) {
			if (this.days.length - 1 < i) {
				this.days.push([]);
			}
			for (let event of template[i]) {
				event.id = num;
				num++;
				this.days[i].push(event);
			}
			this.sortDay(i);
		}
		return num;
	}

	updateFromString(string) {
		let info = JSON.parse(string);
		document.getElementById("startDate").value = info.startDate;
		document.getElementById("endDate").value = info.endDate;
		document.getElementById("feedback").checked = info.collectFeedback;
		this.startDate = info.startDate;
		this.endDate = info.endDate;

		this.collectFeedback = info.collectFeedback;
		this.days = info.days;
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

	saveSelf(db, name = null) {
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
			setDoc(doc(db, "weekendTemplates", name), temp)
				.then(() => alert("Template Saved Successfully"))
				.catch((e) => {
					alert("Error in saving. Please try again.");
					console.log(e);
				});
		} else {
			getDoc(doc(db, "activeWeekend", "default")).then((activeWeekend) => {
				let data = JSON.parse(activeWeekend.data().information);
				if (data.startDate != this.startDate) {
					setDoc(doc(db, "weekends", `${data.startDate}-${data.endDate}`), {
						information: JSON.stringify(data),
					})
						.then(() => {
							setDoc(doc(db, "activeWeekend", "default"), this.getInformation())
								.then(() => alert("Weekend Saved Successfully"))
								.catch((e) => {
									alert("Error in saving weekend. Please try again.");
									console.log(e);
								});
						})
						.catch((e) => {
							alert("Error in saving weekend. Please try again.");
							console.log(e);
						});
				} else {
					setDoc(doc(db, "activeWeekend", "default"), this.getInformation())
						.then(() => alert("Weekend Saved Successfully"))
						.catch((e) => {
							alert("Error in saving weekend. Please try again.");
							console.log(e);
						});
				}
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

const userDoc = {
	isAdmin: false,
	email: "",
	events: [],
	credit: 0,
	emailPreferences: {
		advLottery: true,
		eventConf: true,
		eventFeedback: true,
		newEvent: true,
	},
	displayName: "",
};

const formatTime = (timeString) => {
	let hours = Number(timeString.slice(0, 2));
	if (hours > 12) return (hours - 12).toString() + timeString.slice(2) + "pm";
	else return timeString.slice(1) + "am";
};

// const daysFromDates = (start, end) => {
// 	const startDate = new Date(start + "T00:00:00");
// 	const startDay = startDate.getDay();
// 	const endDate = new Date(end + "T00:00:00");
// 	let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
// 	let dayArray = []
// 	for (let i = 0; i<numDays; i++) {
// 		dayArray.push(daysOfTheWeek[(startDay + i) % 7]);
// 	}
// 	return dayArray
// }

const dataToFullHTML = (information, type = "schedule" | "editor" | "admin", name = null) => {
	let fullHTMLString = "";
	console.log(name)
	const startDate = new Date(information.startDate + "T00:00:00");
	const startDay = startDate.getDay();
	const endDate = new Date(information.endDate + "T00:00:00");
	let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
	while (information.days.length < numDays) {
		information.days.push([]);
	}
	let scheduleHtmlString = ""
	for (let i = 0; i < numDays; i++) {
		let dayHTMLString = ""
		let eventsHTMLString = "";
		let eventNum = 0;
		for (let event of information.days[i]) {
			let attendeesString = "";
			let inEvent = false;
			for (let element of event.signups) {
				if (element.displayName === name) {inEvent = true}
				attendeesString += `<li class="attendee ${element.status}">${element.displayName}</li>`;
			}
			eventsHTMLString += `<div class="eventWrap" id="${
				type === "editor" ? event.id : type === "schedule" ? i + "-" + eventNum : ""
			}"><div class="eventHeadWrap eIWrap"><span class="material-symbols-outlined collapse"> expand_circle_right </span><h2 class="eventTitle">${
				event.title
			}</h2><span class="eventTime">${formatTime(event.timeStart)}-${formatTime(event.timeEnd)}</span>${
				type === "editor" ? '<span class="material-symbols-outlined addIcon deleteButton">delete</span>' : ""
			}</div><div class="eventInfoWrap"><div class="eventLocationWrap eIWrap"><span class="material-symbols-outlined"> location_on </span><span class="eventAddress">${
				event.location
			}</span></div><div class="travelWrap eIWrap"><span class="material-symbols-outlined"> airport_shuttle </span><span class="travelTime">${
				event.travelTime
			} min</span></div><div class="eventLeadWrap eIWrap"><span class="material-symbols-outlined"> person </span><span class="eventLeader">T. ${
				event.faculty /*[0].first*/
			}</span></div><div class="descWrap eIWrap"><span class="material-symbols-outlined descIcon"> description </span><p class="eventDesc">${
				event.description
			}</p></div><div class="attendeesWrap eIWrap">${
				type === "editor"
					? '<span class="material-symbols-outlined">block</span>'
					: `<span class="material-symbols-outlined addIcon"> ${!inEvent ? "add_circle" : "cancel"} </span>`
			}<span class="singedUpNum">${event.signups.length}</span>/<span class="eventSpots">${
				event.numSpots ? event.numSpots : '<span class="material-symbols-outlined">all_inclusive</span>'
			} ${
				event.admissionCriteria && event.admissionCriteria != "Normal Signup"
					? `(${event.admissionCriteria})`
					: ""
			} </span><ol class="attendeesList">${attendeesString}</ol></div></div></div>`;
			if (inEvent) {
				dayHTMLString += `<div class="eventWrap sEventWrap"><div class="eventHeadWrap eIWrap"><h2 class="eventTitle">${
					event.title
				}</h2><span class="eventTime">${formatTime(event.timeStart)}-${formatTime(event.timeEnd)}</span></div></div>`;
			}

		}

		fullHTMLString += `<section class="dayWrap open">
				<div class="dayHeadWrap">
					<svg xmlns="http://www.w3.org/2000/svg" class="dayCollapse open" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
					<h2 class="dayHead">${daysOfTheWeek[(startDay + i) % 7]}</h2>
				</div>
                <div class="eventsContainer">${eventsHTMLString}</div>
                </section>`;
		
		scheduleHtmlString += `<div class="scheduleDay">
					<h3 class="scheduleDayHead">${daysOfTheWeek[(startDay + i) % 7]}</h3>
					${dayHTMLString || "No events this day."}
				</div>`;
		dayHTMLString = ""
		eventNum++;
	}

	return parser.parseFromString(fullHTMLString + scheduleHtmlString, "text/html");
};

const handleClick = (click) => {
	if (click.target.tagName === "SPAN") {
		click.target.classList.toggle("open");
		click.target.parentElement.parentElement.classList.toggle("open");
	} else if (click.target.tagName === "path") {
		click.target.parentElement.classList.toggle("open");
		if (click.target.parentElement.classList.contains("dayCollapse")) {
			click.target.parentElement.parentElement.parentElement.classList.toggle("open");
		} else {
			click.target.parentElement.parentElement.classList.toggle("open");
		}
	} else {
		click.target.classList.toggle("open");
		if (click.target.classList.contains("dayCollapse")) {
			click.target.parentElement.parentElement.classList.toggle("open");
		} else {
			click.target.parentElement.classList.toggle("open");
		}
	}
};

const addListeners = () => {
	let collapsing = document.querySelectorAll(".collapse, .dayCollapse");

	for (let el of collapsing) {
		el.addEventListener("click", handleClick);
	}
	let sideWrap = document.getElementById("sideMenuWrap");
	if (sideWrap) {
		sideWrap.addEventListener("mouseleave", (ev) => {
			if (!ev.target.classList.contains("open")) {
				return;
			}
			document.getElementById("sideMenuWrap").classList.toggle("open");
			document.getElementById("menuToggle").classList.toggle("open");
		});
	}
};

const getUserFromEmail = async (email, name, db) => {
	let information;
	await getDoc(doc(db, "users", email))
		.then((docSnap) => {
			if (docSnap.exists()) {
				information = docSnap.data();
			} else {
				let newUser = userDoc;
				newUser.email = email;
				newUser.displayName = name;
				setDoc(doc(db, "users", newUser.email), newUser);
				information = newUser;
			}
		})
		.catch((error) => {
			throw error;
		});

	return information;
};

const getAdminLinks = (adminPage) => {
	return `
			<a id="dashWrap" class="menuWrap" href="${adminPage ? "." : "admin"}/">
				<span class="material-symbols-outlined"> monitoring </span>
				<span class="menuText">Admin Dashboard</span>
			</a>
			<a id="builderWrap" class="menuWrap" href="${adminPage ? "" : "admin/"}builder.html">
				<span class="material-symbols-outlined"> edit_calendar </span>
				<span class="menuText">Weekend Builder</span>
			</a>
			`;
};

const handleDBError = (error) => {
	if (error.message.includes("permissions")) {
		alert("You do not have sufficient permissions for this action.")
		console.log(error)
	} else {
		throw error;
	}
}

export {
	dataToFullHTML,
	daysOfTheWeek,
	Weekend,
	WeekendEvent,
	addListeners,
	getUserFromEmail,
	getAdminLinks,
	handleDBError,
	//daysFromDates,
};
