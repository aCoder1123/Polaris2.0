const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const { sendMail, emailOptions } = require("./gmail/main");
const {createEventFromJSON, addAttendees} = require('./calendar/main');
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, collection, query, where, doc, getDoc } = require('firebase-admin/firestore');
const { userDoc } = require("./db/main");
const { firebaseConfig } = require("./config")
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


exports.sendEmail = onCall((request) => {
	let messageOptions = emailOptions;
	messageOptions.to = request.data.email;
	messageOptions.subject = request.data.subject;
	messageOptions.text = request.data.text;

	const send = async (options) => {
		let messageId = await sendMail(messageOptions);
		return messageId;
	};

	return send(messageOptions);
});

exports.bugReport = onCall((request) => {
	let messageOptions = emailOptions;
	messageOptions.to = "bailey.tuckman@westtown.edu";
	messageOptions.subject = `Polaris bug report: ${request.data.page}`;
	messageOptions.text = `On ${new Date().toLocaleString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })} there was a bug reported on  ${request.data.page} by ${request.data.email ? request.data.email : "anonymous"}.\n\nDescription:\n${request.data.description}\n\nSteps to Reproduce: ${request.data.repro}`;

	const send = async (options) => {
		let messageId = await sendMail(options);
		return messageId;
	};

	return send(messageOptions);
});

exports.getUserData = onCall((request) => {
	let userEmail = request.data.email
	return getDoc(doc(db, "users", userEmail)).then((docSnap) => {
		if (docSnap.exists()) {return docSnap.data()}
		let newUser = userDoc
		newUser.email = request.data.email
		return newUser
	}).catch((error) => {
		return {status: "error", info: error}
	})
})
