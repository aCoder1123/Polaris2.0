const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parser = new DOMParser();

const dataToFullHTML = (information, editor = false) => {
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

			// <span class="material-symbols-outlined locationCopy"> content_copy </span>;
			eventsHTMLString += `<div class="eventWrap" id="${
				event.id && editor ? event.id : ""
			}"><div class="eventHeadWrap eIWrap"><span class="material-symbols-outlined collapse"> expand_circle_right </span><h2 class="eventTitle">${
				event.title
			}</h2><span class="eventTime">${event.timeStart}-${event.timeEnd}</span>${
				editor ? '<span class="material-symbols-outlined addIcon deleteButton">delete</span>' : ""
			}</div><div class="eventInfoWrap"><div class="eventLocationWrap eIWrap"><span class="material-symbols-outlined"> location_on </span><span class="eventAddress">${
				event.location
			}</span></div><div class="travelWrap eIWrap"><span class="material-symbols-outlined"> airport_shuttle </span><span class="travelTime">${
				event.travelTime
			} min</span></div><div class="eventLeadWrap eIWrap"><span class="material-symbols-outlined"> person </span><span class="eventLeader">T. ${
				event.faculty /*[0].first*/
			}</span></div><div class="descWrap eIWrap"><span class="material-symbols-outlined descIcon"> description </span><p class="eventDesc">${
				event.description
			}</p></div><div class="attendeesWrap eIWrap">${
				editor
					? '<span class="material-symbols-outlined">block</span>'
					: '<span class="material-symbols-outlined addIcon"> add_circle </span>'
			}<span class="singedUpNum">${event.signups.length}</span>/<span class="eventSpots">${
				event.numSpots ? event.numSpots : '<span class="material-symbols-outlined">all_inclusive</span>'
			} ${
				event.admissionCriteria && event.admissionCriteria != "Normal Signup"
					? `(${event.admissionCriteria})`
					: ""
			} </span><ol class="attendeesList">${attendeesString}</ol></div></div></div>`;
		}

		fullHTMLString += `<section class="dayWrap open">
				<div class="dayHeadWrap">
					<svg xmlns="http://www.w3.org/2000/svg" class="dayCollapse open" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
					<h2 class="dayHead">${daysOfTheWeek[(startDay + i) % 7]}</h2>
				</div>
                <div class="eventsContainer">${eventsHTMLString}</div>
                </section>`;
	}

	return parser.parseFromString(fullHTMLString, "text/html");
};

export { dataToFullHTML, daysOfTheWeek };
