import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// import firebase from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js";
import { getFirestore, doc, onSnapshot, query, limit, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig } from "./config.js";
import { dataToFullHTML } from "./htmlFromJSON.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "maindb");

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const uid = user.uid;
	} else {
		window.location.href = "./";
		console.log("user signed out");
	}
});


const handleScheduleUpdate = (doc) => {
	console.log(`Doc is: ${doc}`)
	let weekendInformation = JSON.parse(doc.data().information);

	let wrap = document.getElementById("daysContainer");
	wrap.replaceChildren();
	let elements = dataToFullHTML(weekendInformation, true).querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
};

let querySnap = await getDocs(collection(db, "weekends"));
let docs = []
querySnap.forEach(doc => {
	docs.push(doc.data().information)
});

console.log(JSON.parse(docs[0]))
let id = JSON.parse(docs[0]).startDate + ":" + JSON.parse(docs[0]).endDate;
console.log(id)

const unsub = onSnapshot(doc(db, "weekends", id), handleScheduleUpdate);

// handleScheduleUpdate(firstScheduleDoc)

console.log("running")