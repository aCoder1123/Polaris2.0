import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";

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
import { firebaseConfig, siteKey } from "./config.js";
import { handleAuth } from "./authHandling.js";

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const db = getFirestore(app, "maindb");
const [user, userinformation] = handleAuth(app);

