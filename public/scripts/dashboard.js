import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	getFirestore,
	doc,
	onSnapshot,
	collection,
	getDocs,
	setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { dataToFullHTML, daysOfTheWeek as weekDays } from "./htmlFromJSON.js";
import { addListeners } from "./index.js";
import { firebaseConfig } from "./config.js";
import { handleAuth } from "./authHandling.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "maindb");
const [user, userinformation] = handleAuth(app);

