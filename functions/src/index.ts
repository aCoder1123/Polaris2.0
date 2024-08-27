const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const { sendMail, emailOptions } = require("./gmail/main");
const { createEventFromJSON, addAttendees } = require("./calendar/main");
const { userDoc } = require("./db/main");
const { firebaseConfig } = require("../config");
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue, Filter } = require("firebase-admin/firestore");

initializeApp({
	credential: applicationDefault(),
});

const db = getFirestore("maindb");


const send = async (options: object) => {
	let messageId = await sendMail(options);
	return messageId;
};

exports.sendEmail = onCall((request: any) => {
	let messageOptions = emailOptions;
	messageOptions.to = request.data.email;
	messageOptions.subject = request.data.subject;
	messageOptions.text = request.data.text;

	return send(messageOptions);
});

exports.bugReport = onCall((request: any) => {
	let messageOptions = emailOptions;
	messageOptions.to = "bailey.tuckman@westtown.edu";
	messageOptions.subject = `Polaris bug report: ${request.data.page}`;
	messageOptions.text = `On ${new Date().toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "short",
		day: "numeric",
	})} there was a bug reported on  ${request.data.page} by ${
		request.data.email ? request.data.email : "anonymous"
	}.\n\nDescription:\n${request.data.description}\n\nSteps to Reproduce: ${request.data.repro}`;

	return send(messageOptions);
});

exports.handleSignup = onCall(
	{
		enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
	},
	async (request: any) => {
		if (request.auth === null) return { status: "failed", information: "User not signed in." };
		let currentWeekendDoc = await db.collection("activeWeekend").doc("default").get();
		let currentWeekend = JSON.parse(currentWeekendDoc.data().information)
		const endAsDate = new Date(currentWeekend.endDate + "T23:59:59");
		if (endAsDate < new Date()) {
			return { status: "failed", information: "Cannot Sign Up for Past Weekend." };
		}

		const id = request.data.id;
		const displayName = request.auth.token.name;
		const email = request.auth.token.email;

		let event = currentWeekend.days[Number(id[0])][Number(id.slice(2))];
		for (let signupNum in event.signups) {
			if (event.signups[signupNum].email === email) {
				currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.splice(signupNum, 1);
				let docRef = db.collection("activeWeekend").doc("default");
				let setRes = await docRef.set({
					information: JSON.stringify(currentWeekend),
				});
				return { status: "success", information: setRes };
			}
		}
		currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
			displayName: displayName,
			email: email,
			status: "pending",
		});
		let docRef = db.collection("activeWeekend").doc("default");
		let setRes = await docRef.set({
			information: JSON.stringify(currentWeekend),
		});
		return { status: "success", information: setRes };
	}
);

// exports.test = onCall(async (request: any) => {
// 	let ref = db.collection("activeWeekend").doc("default");
// 	let res = await ref.get();
// 	return JSON.stringify(res.data());
// });
