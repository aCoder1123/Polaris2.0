import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { handleAuth } from "./authHandling.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const [user, userinformation] = handleAuth(app);

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

const bugReport = httpsCallable(functions, "bugReport");

document.getElementById("reportForm").addEventListener("submit", (e) => {
	e.preventDefault();
	let formData = new FormData(e.target);
	let data = {};
	formData.forEach((value, key) => (data[key] = value));
	bugReport(data)
		.then((res) => {
			if (res.data) {
				alert("Thank you for submitting your bug. We will take care of it as soon as possible.");
			}
		})
		.catch((error) => {
			console.error(error);
			alert("Bug Report failed.");
		});
});
