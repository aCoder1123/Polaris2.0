import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const functions = getFunctions(app);
if (window.location.hostname === '127.0.0.1') {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// if (!auth.user) {
//     window.location.href = "../index.html"
// }

// const addnumbers = httpsCallable(functions, "addnumbers");
// addnumbers({ firstNumber: 10, secondNumber: 12 }).then((result) => {
// 	// Read result of the Cloud Function.
// 	/** @type {any} */
// 	const data = result.data;
// 	console.log(data);
// });

const sendEmail = httpsCallable(functions, "sendInvite");

const orderCoffee = () => {
	let emailIn = document.getElementById("emailIn");
	if (!emailIn.checkValidity()) {
		alert("Enter a valid email address.");
		return;
	}
	sendEmail({ email: emailIn.value }).then((result) => {
		const data = result.data.messageStatus;
		if (data != "Message Sent Succesfully") {
			alert(
				"Message failed to send. \n\n\nTry again and lmk if this happens repeatedly. Thanks!"
			);
			return;
		}
		alert(
			"Order Placed:\n\n Your coffee order will arrive in your inbox shortly."
		);
        console.log(result.data)
	});
};

document.getElementById("coffeeButton").addEventListener("click", orderCoffee, false)
