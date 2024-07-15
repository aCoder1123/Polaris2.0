const { writeFileSync } = require("fs");
const ics = require("ics");

exports.writeICS = (info) => {
	if (!info) {
		info = {
			title: "Dinner",
			description: "Nightly thing I do",
			busyStatus: "FREE",
			start: [2018, 1, 15, 6, 30],
			duration: { minutes: 50 },
		};
	}
	ics
		.createEvent(info)
		.then((result) => {
			writeFileSync(`${__dirname}/event.ics`, result);
		})
		.catch((err) => {});
};

exports.createICS = (info) => {
	if (!info) {
		info = {
			title: "Dinner",
			description: "Nightly thing I do",
			busyStatus: "BUSY",
			start: [2024, 7, 10, 6, 30],
			duration: { minutes: 50 },
			organizer: {
				name: "Bailey",
				email: "bailey.tuckman@gmail.com",
			},
            method: "REQUEST"
		};
	}
	let event = ics.createEvent(info, (error, value) => {
		if (error) {
			return error;
		}
		return value;
	});
	return event;
};
