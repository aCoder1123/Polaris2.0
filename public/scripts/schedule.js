import {
	getFirestore,
	doc,
	onSnapshot,
	query,
	limit,
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { dataToFullHTML } from "./htmlFromJSON.js";
import { handleAuth } from "./authHandling.js";
import { addListeners } from "./index.js";


const app = initializeApp(firebaseConfig);
// const [user, userInformation] = handleAuth(app);
const db = getFirestore(app, "maindb");

const handleScheduleUpdate = (doc) => {
	console.log(`Doc is: ${doc}`);
	let weekendInformation = JSON.parse(doc.data().information);

	let wrap = document.getElementById("daysContainer");
	wrap.replaceChildren();
	let elements = dataToFullHTML(weekendInformation, false).querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners()
};

let querySnap = await getDocs(collection(db, "weekends"));
let docs = [];
querySnap.forEach((doc) => {
	docs.push(doc.data().information);
});

let id = JSON.parse(docs[0]).startDate + ":" + JSON.parse(docs[0]).endDate;

const unsub = onSnapshot(doc(db, "weekends", id), handleScheduleUpdate);
