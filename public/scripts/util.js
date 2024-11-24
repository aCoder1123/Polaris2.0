import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";

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
		let select = document.getElementById("criteriaSelector");
		this.admission = {
			val: select.value,
			name: select.options[select.selectedIndex].innerText,
			filtered: false,
			credited: false,
			credit: Number(document.getElementById("eventCredit").value),
		};
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
			admission: this.admission,
		};
	}
}

class Weekend {
	constructor() {
		this.startDate = document.getElementById("startDate").value;
		this.endDate = document.getElementById("endDate").value;
		this.release = { dateTime: "", released: false };
		this.admission = { dateTime: "", filtered: false };
		this.days = [];
	}

	updateSelf() {
		let oldStart = this.startDate;
		let oldEnd = this.endDate;
		this.startDate = document.getElementById("startDate").value;
		this.endDate = document.getElementById("endDate").value;

		// this.collectFeedback = document.getElementById("feedback").checked;

		if (this.startDate && this.endDate) {
			let startDate = new Date(this.startDate);
			let endDate = new Date(this.endDate);
			let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
			if (numDays > 7) {
				this.startDate = null;
				this.endDate = null;
				alert("Cannot make a schedule longer than one week.");
				return false;
			}
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
		return this.startDate && this.endDate ? true : false;
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
		// document.getElementById("releaseDate").value = info.release.dateTime;
		// document.getElementById("feedback").checked = info.collectFeedback;
		this.startDate = info.startDate;
		this.endDate = info.endDate;
		this.release = info.release;
		this.admission = info.admission;

		// this.collectFeedback = info.collectFeedback;
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

	async saveSelf(db, name = null, editingQueue = false) {
		this.release.released = this.release.released || !this.release.dateTime;
		for (let day of this.days) {
			for (let event of day) {
				if (event.saveAsTemplate) {
					delete event.saveAsTemplate;
					let eventData = Object.assign({}, event);
					eventData.faculty = null;
					await setDoc(doc(db, "eventTemplates", eventData.title), eventData).catch((e) => {
						alert("Error in saving weekend. Please try again.");
						console.log(e);
						return;
					});
				}
			}
		}
		if (name) {
			let temp = { information: JSON.stringify(this.days), title: name };
			await setDoc(doc(db, "weekendTemplates", name), temp)
				.then(() => alert("Template Saved Successfully"))
				.catch((e) => {
					alert("Error in saving. Please try again.");
					console.log(e);
				});
		} else if (this.release.released) {
			let data = await getDoc(doc(db, "activeWeekend", "default"));
			data = JSON.parse(data.data().information);
			if (data.startDate != this.startDate) {
				await setDoc(doc(db, "weekends", `${data.startDate}-${data.endDate}`), {
					information: JSON.stringify(data),
				});
				await setDoc(doc(db, "activeWeekend", "default"), this.getInformation());
				if (editingQueue) {
					await deleteDoc(doc(db, "activeWeekend", "queued"));
				}
			} else {
				await setDoc(doc(db, "activeWeekend", "default"), this.getInformation());
			}
		} else {
			console.log("setting queue");
			await setDoc(doc(db, "activeWeekend", "queued"), this.getInformation());
		}
	}

	get isValid() {
		return this.startDate && this.endDate;
	}
	get id() {
		return `${this.startDate}-${this.endDate}`;
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

class FunctionQueue {
	constructor(func, callback = null) {
		this._func = func;
		this._callbackFN = callback;
		this._queue = [];
		this._running = false;
	}

	add(item) {
		this._queue.push(item);
		if (!this._running) this.runQueue();
	}

	async runQueue() {
		this._running = true;
		let res;
		try {
			res = await this._func(this._queue[0]);
			if (this._callbackFN) {
				this._callbackFN(this._queue.shift());
			} else this._queue.shift();
		} catch (error) {
			console.log(`An error occurred when running queue function: ${error}`);
			if (this._callbackFN) {
				this._callbackFN(error);
			}
			this._queue.shift();
		}
		if (!this._queue.length) {
			this._running = false;
			return;
		}
		this.runQueue();
	}

	get queue() {
		return this._queue;
	}
	get func() {
		return this._func;
	}
	get running() {
		return this._running;
	}
	get callback() {
		return this._callbackFN;
	}
}

const formatTime = (timeString) => {
	let hours = Number(timeString.slice(0, 2));
	if (hours > 12) return (hours - 12).toString() + timeString.slice(2) + "pm";
	else if (hours === 12) return timeString + "pm";
	else if (hours > 9) return timeString + "am";
	return timeString.slice(1) + "am";
};

const dataToFullHTML = (information, type = "schedule" | "editor" | "admin", email = null, openIDs = []) => {
	let fullHTMLString = "";
	const startDate = new Date(information.startDate + "T00:00:00");
	const startDay = startDate.getDay();
	const endDate = new Date(information.endDate + "T00:00:00");
	let numDays = 1 + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
	while (information.days.length < numDays) {
		information.days.push([]);
	}
	let scheduleHtmlString = "";
	for (let i = 0; i < numDays; i++) {
		let dayHTMLString = "";
		let eventsHTMLString = "";
		let eventNum = 0;
		for (let event of information.days[i]) {
			let attendeesString = "";
			let inEvent = false;
			let eventDate = new Date();
			eventDate.setTime(
				startDate.getTime() +
					1000 * 60 * 60 * 24 * i +
					Number(event.timeStart.slice(0, 2)) * 1000 * 60 * 60 +
					Number(event.timeStart.slice(3)) * 1000 * 60
			);
			let eventPassed = eventDate < new Date();

			for (let element of event.signups) {
				let status = "";
				if (element.email === email) {
					inEvent = true;
				}
				if (element.credit) {
					let credit = element.credit;
					if (credit > 1000) {
						status = "hundred";
					} else if (credit > 500) {
						status = "fifty";
					} else if (credit > 250) {
						status = "gold";
					} else if (credit > 100) {
						status = "silver";
					} else if (credit > 50) {
						status = "bronze";
					} else {
						status = "";
					}
					attendeesString += `<li class="attendee ${element.status} ${status}">${element.displayName}</li>`;
				} else {
					attendeesString += `<li class="attendee ${element.status}">${element.displayName}</li>`;
				}
			}
			let eventID = i + "-" + eventNum;
			eventsHTMLString += `<div class="eventWrap${
				type != "editor" && openIDs.includes(eventID) ? " open" : ""
			}" id="${type === "editor" ? event.id : eventID}"><div class="eventHeadWrap eIWrap ${
				event.admission.val === "none"
					? ""
					: inEvent
					? "inEvent"
					: event.signups.length >= event.numSpots
					? "full"
					: ""
			}"><span class="material-symbols-outlined eventCollapse${
				type != "editor" && openIDs.includes(eventID) ? " open" : ""
			}"> expand_circle_right </span><h2 class="eventTitle">${
				event.title
			}</h2><span class="eventTime">${formatTime(event.timeStart)}-${formatTime(event.timeEnd)}</span>${
				type === "editor" ? '<span class="material-symbols-outlined addIcon deleteButton">delete</span>' : ""
			}</div><div class="eventInfoWrap ${
				event.admission.val === "none" ? " noAdmit" : event.admission.name
			}"><div class="eventLocationWrap eIWrap"><span class="material-symbols-outlined"> location_on </span><span class="eventAddress">${
				event.location
			}</span></div><div class="travelWrap eIWrap"><span class="material-symbols-outlined"> airport_shuttle </span><span class="travelTime">${
				event.travelTime
			} min</span></div><div class="eventLeadWrap eIWrap"><span class="material-symbols-outlined"> person </span><span class="eventLeader">T. ${
				event.faculty /*[0].first*/
			}</span></div><div class="descWrap eIWrap"><span class="material-symbols-outlined descIcon"> description </span><p class="eventDesc">${
				event.description ? event.description : "<i>No description.</i>"
			}</p></div>
			
			${
				event.admission.val != "none"
					? `<div class="attendeesWrap eIWrap">${
							type === "editor"
								? '<span class="material-symbols-outlined">block</span>'
								: `<span class="material-symbols-outlined ${
										type === "admin" ? "checkInLaunch" : eventPassed ? "addDisabled" : "addIcon"
								  }"> ${
										type === "admin"
											? "task_alt"
											: eventPassed
											? "block"
											: !inEvent
											? "add_circle"
											: "cancel"
								  } </span>`
					  }<span class="singedUpNum">${event.signups.length}</span>/<span class="eventSpots">${
							event.numSpots
								? event.numSpots
								: '<span class="material-symbols-outlined">all_inclusive</span>'
					  }</span> 
					<span class = "smallText">
					${event.admission.val && event.admission.val != "signup" ? `<b> ${event.admission.name}</b> -` : ""} ${
							event.admission.val != "none"
								? event.admission.credit || event.admission.credit === 0
									? `<i> ${event.admission.credit} credit</i>`
									: "<i> 10 credit</i>"
								: ""
					}
					</span>
					${
							attendeesString
								? `<ol class="attendeesList">${attendeesString}</ol>`
								: '<div class="attendeesList empty">No Attendees</div>'
						}</div>`
					: ""
			}
			
			</div></div>`;

			if (inEvent) {
				dayHTMLString += `<div class="eventWrap sEventWrap"><div class="eventHeadWrap eIWrap"><h2 class="eventTitle">${
					event.title
				}</h2><span class="eventTime">${formatTime(event.timeStart)}-${formatTime(
					event.timeEnd
				)}</span></div></div>`;
			}
			eventNum++;
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
		dayHTMLString = "";
	}

	return parser.parseFromString(fullHTMLString + scheduleHtmlString, "text/html");
};

const addListeners = (openIDs = undefined) => {
	let collapsing = document.querySelectorAll(".eventCollapse, .dayCollapse, .collapse");

	for (let el of collapsing) {
		if (el.classList.contains("eventCollapse") || el.classList.contains("dayCollapse")) {
			el.onclick = (click) => {
				el.classList.toggle("open");
				el.parentElement.parentElement.classList.toggle("open");
				if (openIDs != undefined && el.classList.contains("eventCollapse")) {
					let id = el.parentElement.parentElement.id;
					if (openIDs.includes(id)) openIDs.splice(openIDs.indexOf(id), 1);
					else openIDs.push(id);
				}
			};
		} else {
			el.onclick = (click) => {
				el.classList.toggle("open");
				el.parentElement.classList.toggle("open");
			};
		}
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

const getUserFromEmail = async (email, name, db, functions) => {
	let information;
	await getDoc(doc(db, "users", email))
		.then((docSnap) => {
			if (docSnap.exists()) {
				information = docSnap.data();
			}
		})
		.catch((error) => {
			throw error;
		});
	if (!information) {
		const userCreate = httpsCallable(functions, "createNewUser");
		let userRes = await userCreate({ displayName: name });
		information = userRes.data;
	}

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

const getMenuHTMLString = (user, adminPage, admin = false) => {
	return `
		<div id="sideMenuWrap" class="">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="menuToggle" class="collapse">
				<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
			</svg>
			<div id="menuHead">
				<a href="${adminPage ? ".." : "."}/schedule.html" id="polarisLogoLink">
					<svg
						id="polarisLogo"
						width="176"
						height="43"
						viewBox="0 0 176 43"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							id="Subtract"
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M72.24 0.160004H67.8V43H72.24V0.160004ZM80.6625 30.46V38.08L85.5825 43H96.1425L101.663 37.72V43H105.923V18.64L100.403 13.12H86.4225L80.9025 18.64V22.36H85.3425V19.9L88.3425 16.96H98.5425L101.543 19.9V25.6H85.5825L80.6625 30.46ZM101.543 33.1L95.2425 39.16H87.5025L85.1025 36.82V31.78L87.5025 29.44H101.543V33.1ZM118.929 13.12H114.609V43H119.049V23.44L125.409 17.08H132.009V13.12H124.269L118.929 18.46V13.12ZM142.735 13.12H138.295V43H142.735V13.12ZM150.844 34.36V38.08L155.764 43H170.644L175.564 38.08V31L170.644 26.08H157.924L155.524 23.68V19.3L157.924 16.96H168.124L170.524 19.3V21.76H174.964V18.04L170.044 13.12H156.004L151.084 18.04V25.06L155.824 29.8H168.724L171.124 32.2V36.82L168.724 39.16H157.684L155.284 36.82V34.36H150.844Z"
							fill="black"
							class="change"
						/>
						<path
							class="change"
							id="mainStair"
							d="M48.5 8L51.058 19.3244L60.8744 13.1256L54.6756 22.942L66 25.5L54.6756 28.058L60.8744 37.8744L51.058 31.6756L48.5 43L45.942 31.6756L36.1256 37.8744L42.3244 28.058L31 25.5L42.3244 22.942L36.1256 13.1256L45.942 19.3244L48.5 8Z"
							fill="black"
						/>
						<path
							id="accent"
							d="M140.5 1L141.304 4.5591L144.389 2.61091L142.441 5.69605L146 6.5L142.441 7.30395L144.389 10.3891L141.304 8.4409L140.5 12L139.696 8.4409L136.611 10.3891L138.559 7.30395L135 6.5L138.559 5.69605L136.611 2.61091L139.696 4.5591L140.5 1Z"
							fill="#0031DF"
						/>
						<path
							class="change"
							id="p"
							d="M0.8 0.999997H24.8L30.32 6.52V20.02L24.74 25.6H5.36V43H0.8V0.999997ZM22.82 21.64L25.82 18.7V7.9L22.82 4.96H5.36V21.64H22.82Z"
							fill="black"
						/>
						<path
							id="wt"
							d="M44.2181 23.836H45.1961L46.1561 26.548L45.7961 28.108L44.2181 23.836ZM47.2181 23.704L47.3261 24.298L45.9941 27.442C45.9941 27.442 45.9821 27.476 45.9581 27.544C45.9341 27.612 45.9101 27.696 45.8861 27.796C45.8661 27.896 45.8541 28 45.8501 28.108H45.7961L45.6281 27.394L47.1641 23.704H47.2181ZM47.2181 23.71L48.5381 26.626L48.2501 28.108L46.8041 24.91L47.2181 23.71ZM49.5401 23.836L48.4121 27.442C48.4121 27.442 48.4021 27.478 48.3821 27.55C48.3621 27.618 48.3441 27.704 48.3281 27.808C48.3121 27.908 48.3061 28.008 48.3101 28.108H48.2501L48.0821 27.514L49.1321 23.836H49.5401ZM49.0181 24.232C49.0501 24.112 49.0401 24.02 48.9881 23.956C48.9361 23.892 48.8701 23.86 48.7901 23.86H48.7361V23.8H49.9901V23.86C49.9901 23.86 49.9821 23.86 49.9661 23.86C49.9501 23.86 49.9421 23.86 49.9421 23.86C49.8501 23.86 49.7501 23.89 49.6421 23.95C49.5341 24.006 49.4581 24.1 49.4141 24.232H49.0181ZM45.3461 24.232H44.3681C44.3161 24.1 44.2381 24.006 44.1341 23.95C44.0301 23.89 43.9321 23.86 43.8401 23.86C43.8401 23.86 43.8321 23.86 43.8161 23.86C43.8001 23.86 43.7921 23.86 43.7921 23.86V23.8H45.6221V23.86H45.5681C45.4921 23.86 45.4241 23.892 45.3641 23.956C45.3081 24.02 45.3021 24.112 45.3461 24.232ZM52.456 23.818V28H51.556V23.818H52.456ZM53.926 23.794V24.046H50.086V23.794H53.926ZM53.926 24.028V24.736L53.866 24.73V24.664C53.866 24.476 53.81 24.328 53.698 24.22C53.59 24.108 53.442 24.05 53.254 24.046V24.028H53.926ZM53.926 23.686V23.86L53.194 23.794C53.282 23.794 53.374 23.788 53.47 23.776C53.57 23.764 53.662 23.75 53.746 23.734C53.83 23.718 53.89 23.702 53.926 23.686ZM51.574 27.562V28H51.094V27.94C51.094 27.94 51.106 27.94 51.13 27.94C51.158 27.94 51.172 27.94 51.172 27.94C51.276 27.94 51.364 27.904 51.436 27.832C51.512 27.756 51.552 27.666 51.556 27.562H51.574ZM52.438 27.562H52.456C52.46 27.666 52.498 27.756 52.57 27.832C52.646 27.904 52.736 27.94 52.84 27.94C52.84 27.94 52.852 27.94 52.876 27.94C52.904 27.94 52.918 27.94 52.918 27.94V28H52.438V27.562ZM50.752 24.028V24.046C50.568 24.05 50.42 24.108 50.308 24.22C50.2 24.328 50.146 24.476 50.146 24.664V24.73L50.086 24.736V24.028H50.752ZM50.086 23.686C50.126 23.702 50.186 23.718 50.266 23.734C50.35 23.75 50.442 23.764 50.542 23.776C50.642 23.788 50.734 23.794 50.818 23.794L50.086 23.86V23.686Z"
							fill="white"
						/>
					</svg>
				</a>
			</div>
			<a id="menuPF" class="menuWrap" href="${adminPage ? ".." : "."}/profile.html">
				<img
					src="${user ? user.photoURL : "images/blankUser.svg"}"
					alt="PFP"
					loading="lazy"
				/>
				<h2 id="userName">${user ? user.displayName : ""}</h2>
			</a>
			<a class="menuWrap" href="${adminPage ? "../schedule.html" : "./schedule.html"}">
				<span class="material-symbols-outlined">calendar_month</span>
				<span class="menuText">Schedule</span>
			</a>
			${
				admin
					? `
			<a id="dashWrap" class="menuWrap" href="${adminPage ? "." : "admin"}/">
				<span class="material-symbols-outlined"> monitoring </span>
				<span class="menuText">Admin Dashboard</span>
			</a>
			<a id="builderWrap" class="menuWrap" href="${adminPage ? "" : "admin/"}builder.html">
				<span class="material-symbols-outlined"> edit_calendar </span>
				<span class="menuText">Weekend Builder</span>
			</a>
			`
					: ""
			}
			<a id="callDAWrap" class="menuWrap" href="tel:+16103997971">
				<span class="material-symbols-outlined"> phone_in_talk </span>
				<span class="menuText">Call DA</span>
			</a>
			<a id="callSecurityWrap" class="menuWrap" href="tel:+16103997555">
				<span class="material-symbols-outlined"> security </span>
				<span class="menuText">Call Campus Security</span>
			</a>
			<a id="helpWrap" class="menuWrap" href="${adminPage ? ".." : "."}/help.html">
				<span class="material-symbols-outlined"> help_center </span>
				<span class="menuText">Polaris Help</span>
			</a>

			<div id="signOutWrap" class="menuWrap">
				<span class="material-symbols-outlined"> logout </span><span class="menuText">Sign Out</span>
			</div>

			<div id="menuFooter">
				<a href="https://westtown.edu">Westtown School</a>
				<span>975 Westtown Rd. West Chester, PA</span>
			</div>
		</div>
	`;
};

const handleDBError = (error) => {
	if (error.message.includes("permissions")) {
		alert("You do not have sufficient permissions for this action.");
		console.log(error);
	} else {
		throw error;
	}
};

export {
	dataToFullHTML,
	daysOfTheWeek,
	Weekend,
	WeekendEvent,
	addListeners,
	getUserFromEmail,
	getAdminLinks,
	handleDBError,
	getMenuHTMLString,
	FunctionQueue,
};
