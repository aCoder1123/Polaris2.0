process.env.TZ = "America/New_York";

const admin = require("firebase-admin");
const { log, info, debug, warn, error, write } = require("firebase-functions/logger");
const { onCall } = require("firebase-functions/v2/https");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const PDFDocument = require("pdfkit");
const { getTimezoneOffset } = require("date-fns-tz");

const { sendMail, emailOptions } = require("./gmail/main");
const { createEventFromJSON, manageAttendees, eventTemplate, deleteCalendarEvent } = require("./calendar/main");
const { getSheetAsJSON } = require("./drive/main");

admin.initializeApp();
const db = getFirestore("maindb");

const send = async (options) => {
	try {
		let messageId = await sendMail(options);
		return messageId;
	} catch (error) {
		console.log("There was an error connecting to Gmail: ", { errorMsg: error });
	}
};

exports.sendEmail = onCall(
	{
		enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
	},
	(request) => {
		if (request.auth === null) return;
		let messageOptions = emailOptions;
		messageOptions.to = request.data.email;
		messageOptions.subject = request.data.subject;
		messageOptions.text = request.data.text;

		return send(messageOptions);
	}
);

exports.bugReport = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (request.auth === null) return;
		let messageOptions = emailOptions;
		messageOptions.to = "bailey.tuckman@westtown.edu";
		messageOptions.cc = "polaris@westtown.edu";
		messageOptions.subject = `Polaris bug report: ${request.data.page}`;
		messageOptions.text = `On ${new Date().toLocaleString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "numeric",
		})} there was a bug reported on ${request.data.page} by ${
			request.data.email ? request.data.email : "anonymous"
		}.\n\nDescription:\n${request.data.description}\n\nSteps to Reproduce: ${
			request.data.repro
		}\n\nCheck this bug report here: https://polaris-60dce.web.app/admin/settings.html`;

		let currentNum = await db.collection("bugReports").count().get();
		db.collection("bugReports")
			.doc(`${currentNum.data().count}`)
			.set({
				date: Timestamp.fromDate(new Date()),
				description: request.data.description,
				page: request.data.page,
				reporter: request.data.email,
				reproduction: request.data.repro,
				status: "open",
					// bugBounty: {
					// 	awarded: false,
					// 	creditQuantity: 10,
					// 	dateAwarded: null
					// }
			});

		return send(messageOptions);
	}
);

exports.handleSignup = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		let currentWeekendDoc = await db.collection("activeWeekend").doc("default").get();
		let currentWeekend = JSON.parse(currentWeekendDoc.data().information);
		let attendeeRemoved = false;
		let gcalChanged = false;

		const id = request.data.id;
		const displayName = request.auth.token.name;
		const email = request.auth.token.email;
		let event = currentWeekend.days[Number(id[0])][Number(id.slice(2))];

		let currentDate = new Date();
		let eventDate = new Date(currentWeekend.startDate + `T${event.timeStart}:00`);
		eventDate.setDate(eventDate.getDate() + Number(id[0]));

		if (event.admission.val === "none") return { status: "fail", information: "Event has no signup" };
		if (eventDate < currentDate) {
			return { status: "failed", information: "Cannot sign up for past event." };
		}

		for (let signupNum in event.signups) {
			if (event.signups[signupNum].email === email) {
				if (["approved", "checkedIn"].includes(event.signups[signupNum].status)) {
					gcalChanged = true;
				}
				currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.splice(signupNum, 1);
				attendeeRemoved = true;
			}
		}

		if (!attendeeRemoved) {
			let admitStatus = "pending";
			let studentDoc;
			let student;
			let credit;
			switch (event.admission.val) {
				case "randLottery":
					if (event.admission.filtered && event.signups.length < event.numSpots) {
						admitStatus = "approved";
						gcalChanged = true;
					}
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
						displayName: displayName,
						email: email,
						status: admitStatus,
					});
					break;
				case "creditLottery":
					if (event.admission.filtered && event.signups.length < event.numSpots) {
						admitStatus = "approved";
						gcalChanged = true;
					}
					studentDoc = await db.collection("users").doc(request.auth.token.email).get();
					student = studentDoc.data();
					credit = student.credit;
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
						displayName: displayName,
						email: email,
						status: admitStatus,
						credit: credit,
					});
					break;
				case "credit":
					studentDoc = await db.collection("users").doc(request.auth.token.email).get();
					student = studentDoc.data();
					credit = student.credit;
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
						displayName: displayName,
						email: email,
						status: admitStatus,
						credit: credit,
					});
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.sort((a, b) => b.credit - a.credit);
					let i = 0;
					for (let signup of event.signups) {
						if (signup.email === email && i < event.numSpots) {
							gcalChanged = true;
						}
					}
					break;
				default:
					if (event.signups.length < event.numSpots) {
						admitStatus = "approved";
						gcalChanged = true;
					}
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
						displayName: displayName,
						email: email,
						status: admitStatus,
					});
					break;
			}
		}

		if (event.admission.filtered || event.admission.val === "signup" || event.admission.val === "advLottery") {
			let i = 0;
			while (i < event.numSpots && i < event.signups.length) {
				if (event.signups[i].status === "pending") {
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups[i].status = "approved";
				}
				i++;
			}
		} else if (event.admission.val === "credit") {
			let i = 0;
			while (i < event.signups.length) {
				if (i < event.numSpots) {
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups[i].status = "approved";
				} else if (event.signups[i].status === "approved") {
					currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups[i].status = "pending";
				}
				i++;
			}
		}
		try {
			let setRes = await db
				.collection("activeWeekend")
				.doc("default")
				.set({
					information: JSON.stringify(currentWeekend),
				});
			if (gcalChanged) {
				let attendeesRes = await manageAttendees(currentWeekend.days[Number(id[0])][Number(id.slice(2))]);
			}
			return { status: "success", information: JSON.stringify({ db: setRes, GCal: attendeesRes }) };
		} catch (error) {
			return { status: "error", information: error.message };
		}
	}
);

const saveEvents = async (request) => {
	const UTCOffset = getTimezoneOffset("America/New_York");

	let activeWeekend = await db.collection("activeWeekend").doc("default").get();
	activeWeekend = JSON.parse(activeWeekend.data().information);
	for (let i = 0; i < activeWeekend.days.length; i++) {
		for (let eventNum = 0; eventNum < activeWeekend.days[i].length; eventNum++) {
			let event = activeWeekend.days[i][eventNum];
			if (event.calID) continue;
			let template = eventTemplate;
			template.summary = event.title;
			template.description = event.description;
			template.location = event.location;
			for (let signup of event.signups) {
				if (signup.status === "approved" || signup.status === "checkedIn") {
					template.attendees.push({ email: signup.email });
				}
			}
			let startDate = new Date(activeWeekend.startDate + `T${event.timeStart}:00`);
			startDate.setTime(startDate.getTime() + 1000 * 60 * 60 * 24 * i + UTCOffset);
			template.start.dateTime = startDate.toISOString().substring(0, 23);
			let endDate = new Date(activeWeekend.startDate + `T${event.timeEnd}:00`);
			endDate.setTime(endDate.getTime() + 1000 * 60 * 60 * 24 * i + UTCOffset);
			template.end.dateTime = endDate.toISOString().substring(0, 23);
			let result = await createEventFromJSON(template);
			activeWeekend.days[i][eventNum].calID = result.data.id;
		}
	}
	let setRes = await db
		.collection("activeWeekend")
		.doc("default")
		.set({
			information: JSON.stringify(activeWeekend),
		});

	return JSON.stringify(setRes);
};

exports.saveWeekendEvents = onCall(
	{
		enforceAppCheck: true,
	},
	(request) => {
		if (!request.auth) return;
		try {
			let res = saveEvents(request);
			return { status: "success", information: res };
		} catch (error) {
			return { status: "error", information: error.message };
		}
	}
);

exports.deleteEvent = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		if (request.data.eventID) return await deleteCalendarEvent(request.data.eventID);
		try {
			for (let id of request.data.eventIDs) {
				await deleteCalendarEvent(id);
			}
		} catch (error) {
			return { status: "error", information: error.message };
		}
	}
);

exports.createNewUser = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		const usersDoc = await db.collection("settings").doc("config").get();
		let usersData = usersDoc.data().data;
		const userDoc = {
			isAdmin: false,
			email: "",
			events: [],
			credit: 0,
			displayName: "",
		};
		let userInfo = userDoc;
		let email = request.auth.token.email;
		userInfo.email = email;
		if (usersData[email]) {
			userInfo.displayName = `${usersData[email].preferredname} ${usersData[email].lastname}`;
			userInfo.cell = usersData[email].cell ? usersData[email].cell : "";
			userInfo.grade = usersData[email].grade;
			userInfo.day_boarding = usersData[email].day_boarding;
			userInfo.gradyear = usersData[email].gradyear;
		} else {
			userInfo.displayName = request.data.displayName;
		}
		let adminRef = await db.collection("admin").doc(request.auth.token.email).get();
		let subAdminRef = await db.collection("subAdmin").doc(request.auth.token.email).get();
		userInfo.isAdmin = adminRef.exists || subAdminRef.exists;
		await db.collection("users").doc(request.auth.token.email).set(userInfo);
		return userInfo;
	}
);

// At every 10th minute past every hour from 0 through 3 and every hour from 11 through 23 in every month from January through June and every month from September through December.
//Adjusted for timezone
exports.updateWeekend = onSchedule("*/10 0-3,11-23 * 1-6,9-12 *", async (request) => {
	let queuedRef = await db.collection("activeWeekend").doc("queued").get();
	let currentDate = new Date();
	if (queuedRef.exists) {
		let data = queuedRef.data().information;
		data = JSON.parse(data);
		let releaseDate = new Date(data.release.dateTime);
		if (releaseDate.getTime() - currentDate.getTime() < 1000 * 60 * 10) {
			log("Releasing New Weekend");
			data.release.released = true;
			let current = await db.collection("activeWeekend").doc("default").get();
			let info = current.data().information;
			await db
				.collection("weekends")
				.doc(info.startDate + "-" + info.endDate)
				.set({ information: info });
			await db
				.collection("activeWeekend")
				.doc("default")
				.set({ information: JSON.stringify(data) });
			await db.collection("activeWeekend").doc("queued").delete();
			await saveEvents({});
		}
	}

	let weekendRef = await db.collection("activeWeekend").doc("default").get();
	let changed = false;
	if (!weekendRef.exists) return { status: "success", information: "No weekend currently exists" };
	let activeWeekend = JSON.parse(weekendRef.data().information);
	let weekendEndDate = new Date(activeWeekend.endDate + "T23:59:59");
	if (weekendEndDate.getTime() - currentDate.getTime() < 0)
		return { status: "success", information: "No future weekend" };
	for (let dayNum = 0; dayNum < activeWeekend.days.length; dayNum++) {
		for (let eventNum = 0; eventNum < activeWeekend.days[dayNum].length; eventNum++) {
			let event = activeWeekend.days[dayNum][eventNum];
			if (
				(event.admission.val === "creditLottery" || event.admission.val === "randLottery") &&
				!event.admission.filtered
			) {
				let startDate;
				if (activeWeekend.admission && activeWeekend.admission.dateTime) {
					startDate = new Date(activeWeekend.admission.dateTime);
				} else {
					startDate = new Date(activeWeekend.startDate + "T12:00:00"); /* 12pm on the first day*/
				}
				let diff = startDate.getTime() - currentDate.getTime();
				if (!event.admission.filtered && diff < 1000 * 60 * 6) {
					changed = true;
					let array = activeWeekend.days[dayNum][eventNum].signups;
					activeWeekend.days[dayNum][eventNum].admission.filtered = true;
					if (event.admission.val == "creditLottery") {
						for (let attendee of array) {
							attendee.creditVal = (1 + Math.floor(attendee.credit / 10)) * Math.random();
						}
						array.sort((a, b) => b.creditVal - a.creditVal);
					} else {
						// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
						for (let i = array.length - 1; i >= 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[array[i], array[j]] = [array[j], array[i]];
						}
					}
					for (let i = 0; i < array.length; i++) {
						if (i < event.numSpots) {
							array[i].status = array[i].status === "checkedIn" ? "checkedIn" : "approved";
						} else break;
					}
					await manageAttendees(activeWeekend.days[dayNum][eventNum]);
					activeWeekend.admission.filtered = true;
				}
			}
			if (!event.admission.credited) {
				let endDate = new Date(activeWeekend.startDate + `T${event.timeEnd}:00`);
				endDate.setDate(endDate.getDate() + dayNum); /* add day offset*/
				let diff = endDate.getTime() - currentDate.getTime();
				if (diff < 1000 * 60 * 10) {
					activeWeekend.days[dayNum][eventNum].admission.credited = true;
					changed = true;
					for (let i = 0; i < event.signups.length; i++) {
						let student = event.signups[i];
						if (student.status === "checkedIn") {
							let docRef = db.collection("users").doc(student.email);
							let data = await docRef.get();
							data = data.data();
							if (!data) continue;
							data.credit +=
								event.admission.credit || event.admission.credit === 0 ? event.admission.credit : 10;
							let eventDate = new Date(activeWeekend.startDate + "T00:00:00");
							eventDate.setDate(eventDate.getDate() + dayNum);
							data.events.push({ title: event.title, date: eventDate.toDateString() });
							await docRef.set(data);
						} else if (student.status === "noShow" && i <= event.signupNum) {
							let docRef = db.collection("users").doc(student.email);
							let data = await docRef.get();
							if (!data.exists) continue;
							data = data.data();
							let creditLoss =
								event.admission.credit || event.admission.credit === 0
									? (event.admission.credit / 2) | 0
									: 5;
							data.credit = data.credit >= creditLoss ? data.credit - creditLoss : 0;
							await docRef.set(data);
						}
					}
				}
			}
		}
	}

	if (changed) {
		let setRef = await db
			.collection("activeWeekend")
			.doc("default")
			.set({ information: JSON.stringify(activeWeekend) });
		return { status: "success", information: setRef };
	}
	return { status: "success", information: "no changes made" };
});

const updateUserInfoFunc = async () => {
	let configDoc = await db.collection("settings").doc("config").get();
	if (!configDoc.exists) return;
	configDoc = configDoc.data();
	if (!configDoc.dataSheet) return;
	let sheet = await getSheetAsJSON(configDoc.dataSheet.ID);
	if (sheet.status === "error") {
		// error("Error getting student info Google Sheet.");
		return;
	}
	let studentInfoJSON = {};

	for (let row of sheet.data) {
		studentInfoJSON[row.email] = row;
	}
	await db.collection("settings").doc("config").update({ data: studentInfoJSON });

	let adminDataSheet = (await db.collection("settings").doc("adminList").get()).data();
	let adminSheet = await getSheetAsJSON(adminDataSheet.dataSheet.ID);
	if (adminSheet.status === "error") {
		// error("Error getting admin info Google Sheet");
		return;
	}
	let adminInfoJSON = {};

	let batch = db.batch();
	let batchList = [];
	let i = 0;

	let subAdminList = {};
	let subAdmin = await db.collection("subAdmin").get();
	subAdmin.forEach((el) => {
		subAdminList[el.id] = true;
	});

	for (let row of adminSheet.data) {
		adminInfoJSON[row.email] = row;
		if (!subAdminList[row.email]) {
			batch.set(db.collection("subAdmin").doc(row.Email), {});
			i++;
		}
	}
	await db.collection("settings").doc("adminList").update({ data: adminInfoJSON });

	let usersSnap = await db.collection("users").get();

	usersSnap.forEach((element) => {
		let email = element.id;
		if (studentInfoJSON[email]) {
			let userData = element.data();
			let updateData = {
				cell: studentInfoJSON[email].cell ? studentInfoJSON[email].cell : "",
				grade: studentInfoJSON[email].grade,
				day_boarding: studentInfoJSON[email].day_boarding,
				gradyear: studentInfoJSON[email].gradyear,
				displayName: `${studentInfoJSON[email].preferredname} ${studentInfoJSON[email].lastname}`,
			};
			batch.update(db.collection("users").doc(email), updateData);
			i++;
		}
		if (adminInfoJSON[email]) {
			batch.update(db.collection("users").doc(email), {
				isAdmin: true,
				displayName: adminInfoJSON[email].First_Name + " " + adminInfoJSON[email].Last_Name,
			});
		}
		if (i > 50) {
			batchList.push(batch.commit());
			batch = db.batch();
			i = 0;
		}
	});

	if (i != 0) batchList.push(batch.commit());
	await Promise.all(batchList).catch((e) => {
		return { status: "error", information: JSON.stringify(e) };
	});
};
// At 17:00 on Friday in every month from January through June and every month from September through December.
exports.updateUserInfoPeriodic = onSchedule("0 17 * 1-6,9-12 fri", async (request) => {
	// https://crontab.guru/#0_12_*_1-6,9-12_fri
	await updateUserInfoFunc();
});

exports.updateUserInfo = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		await updateUserInfoFunc();
	}
);

exports.resetCredit = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		let admin = await db.collection("admin").doc(request.auth.token.email).get();
		if (!admin.exists) return { status: "error", information: "User not admin." };
		let users = await db.collection("users").get();
		let batch = db.batch();
		users.forEach((user) => {
			if (!user.data().isAdmin) {
				batch.update(db.collection("users").doc(user.id), { credit: 0 });
			}
		});
		try {
			await batch.commit();
			// log(`Credit Reset by: ${request.auth.token.email}`);
			return { status: "success", information: "All credit set to zero." };
		} catch (error) {
			return { status: "error", information: error.message };
		}
	}
);

exports.printRoster = onCall(
	{
		enforceAppCheck: true,
	},
	async (request) => {
		if (!request.auth) return;
		let activeWeekend = (await db.collection("activeWeekend").doc("default").get()).data();
		if (!activeWeekend) return { status: "fail", information: "No active weekend found." };
		activeWeekend = JSON.parse(activeWeekend.information);
		let event = activeWeekend.days[request.data.idAsArray[0]][request.data.idAsArray[1]];
		let people = [];
		for (let signup of event.signups) {
			if (signup.status != "checkedIn") continue;
			let personDoc = (await db.collection("users").doc(signup.email).get()).data();
			people.push({
				email: signup.email,
				name: personDoc.displayName,
				cell: personDoc.cell ? personDoc.cell : "",
				grade: personDoc.grade,
			});
		}
		people.sort((a, b) => {
			return [a.name, b.name].sort()[0] === a.name ? -1 : 1;
		});

		const docWidth = 595.28;
		const docHeight = 841.89;

		const doc = new PDFDocument({
			font: "Courier",
			size: "A4",
			margins: {
				top: 72,
				bottom: 20,
				left: 15,
				right: 15,
			},
		});
		// doc.pipe(fs.createWriteStream("testing.pdf"));

		doc.image("polarisLogo.png", (docWidth - 200) / 2, 10, {
			width: 200,
			align: "center",
			valign: "center",
		});

		doc.image("WTLogo.jpeg", (docWidth - 30) / 2, 90, {
			width: 30,
			align: "center",
			valign: "center",
		});
		doc.moveDown(9);
		doc.fontSize(24).text(event.title, { align: "center" });
		doc.moveDown(1);
		let counter = 1;
		for (let student of people) {
			doc.font("Courier-BoldOblique")
				.fontSize(12)
				.text(
					`${counter}. ${student.name} - ${student.email} - ${
						student.cell ? student.cell : "no phone number"
					} - ${student.grade}th`,
					{ align: "left" }
				);
			doc.moveDown(1);
			counter++;
		}
		doc.end();

		let messageOptions = emailOptions;
		messageOptions.to = "pkkjx65dthv83@hpeprint.com";
		messageOptions.cc = `polaris@westtown.edu, ${request.auth.token.email}`;
		messageOptions.subject = `Roster for ${event.title}`;
		messageOptions.text = `${event.title}\n\n`

		for (student of people) {
			messageOptions.text += `${counter}. ${student.name} - ${student.email} - ${
				student.cell ? student.cell : "no phone number"
			} - ${student.grade}th\n`;
		}
		messageOptions.attachments = {
			// path: "./testing.pdf",
			filename: "Roster.pdf",
			content: doc,
		};
		// console.log(messageOptions.text)

		return send(messageOptions);
	}
);

exports.manageAttendees = onCall(
	{
		enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
	},
	async (request) => {
		if (!request.auth) return;
		let id = request.data.id;
		let activeWeekend = (await db.collection("activeWeekend").doc("default").get()).data();
		activeWeekend = JSON.parse(activeWeekend.information);
		let event = activeWeekend.days[id[0]][id[1]];
		if (request.data.addAttendee && event.admission.val === "none") {
			let removed = false;
			for (let i in event.signups) {
				if (event.signups[i].email === request.auth.token.email) {
					removed = true;
					event.signups.splice(i, 1);
				}
			}
			if (!removed) {
				event.signups.push({ status: "approved", email: request.auth.token.email });
			}
			db.collection("activeWeekend")
				.doc("default")
				.set({ information: JSON.stringify(activeWeekend) });
		}
		return await manageAttendees(event);
	}
);

exports.test = onCall(async (request) => {
	if (request.auth === null) return;
	log("Running Test Function");
	let current = new Date();
	return { info: current.toString() };
});
