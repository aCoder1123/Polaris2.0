import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFirestore,
	getDoc,
	doc,
	collection,
	getDocs,
	query,
	onSnapshot,
	deleteDoc,
	setDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";

import { dataToFullHTML, addListeners, getUserFromEmail, getMenuHTMLString } from "./util.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1") self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(siteKey),
	// Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
	isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getFirestore(app, "maindb");
const functions = getFunctions(app);
const updateUserInfo = httpsCallable(functions, "updateUserInfo");
const resetCreditFunction = httpsCallable(functions, "resetCredit");
const testFunc = httpsCallable(functions, "test");

if (window.location.hostname === "127.0.0.1") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator");
}

addListeners();

const weekendSelect = document.getElementById("dateSelect");

let firebaseUser;
let userInformation;
let weekends = [];
let viewingWeekend;
let adminList = [];

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			if (!data.isAdmin) {
				window.location.href = "../index.html";
			}
			userInformation = data;
		});

		getMenuHTMLString(user, true, db, true).then((menuString) => {
			document.body.insertAdjacentHTML("afterbegin", menuString);

			document.getElementById("signOutWrap").addEventListener("click", () => {
				signOut(auth)
					.then(() => {
						window.location.href = `../index.html`;
					})
					.catch((error) => {
						alert(`There was a error signing out: ${error}`);
					});
			});
		});

		getDocs(query(collection(db, "weekends")))
			.then((docs) => {
				docs.forEach((weekend) => {
					weekends.push(JSON.parse(weekend.data().information));
				});
				getDoc(doc(db, "activeWeekend", "default"))
					.then((doc) => {
						weekends.push(JSON.parse(doc.data().information));

						for (let schedule of weekends) {
							let option = document.createElement("option");
							option.className = "weekendChoice";
							option.value = `${schedule.startDate}-${schedule.endDate}`;
							option.innerText = `${schedule.startDate}-${schedule.endDate}`;
							weekendSelect.insertAdjacentElement("afterbegin", option);
						}
						weekendSelect.selectedIndex = 0;
						updateWeekend();
					})
					.catch((error) => {
						alert(`ERROR LOADING ACTIVE WEEKEND: ${error}`);
						throw error;
					});
			})
			.catch((error) => {
				alert(`ERROR LOADING WEEKENDS: ${error}`);
				throw error;
			});
		const unsub = onSnapshot(collection(db, "admin"), (collection) => {
			document.getElementById("adminListWrap").replaceChildren();
			adminList = [];
			collection.forEach((doc) => {
				adminList.push(doc.id);
				document.getElementById("adminListWrap").insertAdjacentHTML(
					"beforeend",
					`
					<div class="admin" id="${doc.id}">
						<span class="adminEmail">${doc.id}</span>
						<span class="material-symbols-outlined removeAdmin">close</span>
					</div>
					`
				);
			});
			document.querySelectorAll(".removeAdmin").forEach((el) => {
				el.onclick = async (e) => {
					let id = e.target.parentElement.id;
					if (id === firebaseUser.email) {
						alert("Cannot remove admin privileges from self");
						return;
					}
					let userDoc = await getDoc(doc(db, "users", id));
					if (userDoc.exists()) {
						userDoc = userDoc.data();
						if (userDoc.isAdmin) {
							userDoc.isAdmin = false;
							await setDoc(doc(db, "users", id), userDoc);
						}
					}
					await deleteDoc(doc(db, "admin", id));
				};
			});
		});

		const unsub2 = onSnapshot(collection(db, "subAdmin"), (collection) => {
			document.getElementById("subAdminListWrap").replaceChildren();
			adminList = [];
			collection.forEach((doc) => {
				adminList.push(doc.id);
				document.getElementById("subAdminListWrap").insertAdjacentHTML(
					"beforeend",
					`
					<div class="subAdmin" id="${doc.id}">
						<span class="subAdminEmail">${doc.id}</span>
						<span class="material-symbols-outlined removeSubAdmin">close</span>
					</div>
					`
				);
			});
			document.querySelectorAll(".removeSubAdmin").forEach((el) => {
				el.onclick = async (e) => {
					let id = e.target.parentElement.id;
					if (id === firebaseUser.email) {
						alert("Cannot removed admin privileges from self");
						return;
					}
					let userDoc = await getDoc(doc(db, "users", id));
					if (userDoc.exists()) {
						userDoc = userDoc.data();
						if (userDoc.isAdmin) {
							userDoc.isAdmin = false;
							await setDoc(doc(db, "users", id), userDoc);
						}
					}
					await deleteDoc(doc(db, "subAdmin", id));
				};
			});
		});

		const unsub3 = onSnapshot(doc(db, "settings", "config"), (doc) => {
			document.getElementById("studentDataSheetURLIn").value = doc.data().dataSheet.URL;
		});
		const unsub4 = onSnapshot(doc(db, "settings", "adminList"), (doc) => {
			document.getElementById("subAdminDataSheetURLIn").value = doc.data().dataSheet.URL;
		});

		addListeners();
	} else {
		window.location.href = "../index.html";
	}
});

const updateWeekend = () => {
	viewingWeekend = weekends[weekends.length - 1 - weekendSelect.selectedIndex];
	let wrap = document.getElementsByTagName("body")[0];
	for (let node of document.querySelectorAll("body .dayWrap")) {
		node.remove();
	}
	let elements = dataToFullHTML(viewingWeekend, "schedule").querySelectorAll(".dayWrap");
	for (let i = 0; i < elements.length; i++) {
		wrap.append(elements[i]);
	}
	addListeners();

	let signUpsNum = 0;
	let tripNum = 0;

	for (let day of viewingWeekend.days) {
		tripNum += day.length;
		for (let event of day) {
			signUpsNum += event.signups.length;
		}
	}
	document.getElementById("tripNum").innerText = tripNum;
	document.getElementById("signupNum").innerText = signUpsNum;

	if (weekendSelect.selectedIndex === 0) {
		document.getElementById("infoWrap").classList.add("active");
	} else {
		document.getElementById("infoWrap").classList.remove("active");
	}
};

document.getElementById("weekendBack").addEventListener("click", () => {
	if (weekendSelect.selectedIndex < weekendSelect.childElementCount - 1) {
		weekendSelect.selectedIndex++;
		updateWeekend();
	}
});

document.getElementById("weekendForward").addEventListener("click", () => {
	if (weekendSelect.selectedIndex > 0) {
		weekendSelect.selectedIndex--;
		updateWeekend();
	}
});

weekendSelect.addEventListener("change", updateWeekend);

document.getElementById("addAdminButton").onclick = async () => {
	let emailIn = document.getElementById("adminIn");
	if (emailIn.checkValidity()) {
		await setDoc(doc(db, "admin", emailIn.value), {});
		let userDoc = await getDoc(doc(db, "users", emailIn.value));
		if (userDoc.exists()) {
			let userInfo = userDoc.data();
			userInfo.isAdmin = true;
			await setDoc(doc(db, "users", emailIn.value), userInfo);
		}
		emailIn.value = "";
	} else {
		alert("Please enter a valid email.");
	}
};

document.getElementById("addSubAdminButton").onclick = async () => {
	let emailIn = document.getElementById("subAdminIn");
	if (emailIn.checkValidity()) {
		await setDoc(doc(db, "subAdmin", emailIn.value), {});
		let userDoc = await getDoc(doc(db, "users", emailIn.value));
		if (userDoc.exists()) {
			let userInfo = userDoc.data();
			userInfo.isAdmin = true;
			await setDoc(doc(db, "users", emailIn.value), userInfo);
		}
		emailIn.value = "";
	} else {
		alert("Please enter a valid email.");
	}
};

document.getElementById("studentDataSheetURLIn").onchange = (e) => {
	if (!e.target.checkValidity()) return;
	let extractedID = e.target.value.substring(39, 39 + 44); //ids start at index 39 in the link and are 44 characters long
	if (extractedID.includes("/")) {
		alert(
			"Valid ID could not be parsed. Are you using the correct sharing link for the spreadsheet you wish to pull data from?"
		);
		return;
	}
	document.getElementById("extractedID").value = extractedID;
};

document.getElementById("sDataSheetSubmit").onclick = async (e) => {
	let linkIn = document.getElementById("studentDataSheetURLIn");
	if (!linkIn.checkValidity()) {
		alert("Please enter a valid link.");
		return;
	}
	if (
		!confirm("Are you sure you want to update the link? Is the sheet shared with or owned by polaris@westtown.edu?")
	) {
		return;
	}
	e.target.disabled = true;
	try {
		let link = document.getElementById("studentDataSheetURLIn").value;
		if (link.length < 39 + 44 - 1 || link.substring(39, 39 + 44).includes("/")) {
			alert("Cannot extract valid ID from link. Double check the link and try again.");
			e.target.disabled = false;
			return;
		}
		await updateDoc(doc(db, "settings", "config"), {
			dataSheet: {
				ID: link.substring(39, 39 + 44),
				URL: link,
			},
		});
		alert("Link updated successfully. Press update now to realize changes.");
	} catch (error) {
		alert(`There was an error updating the link: ${error.message}`);
		console.log(error);
	}
	e.target.disabled = false;
};

document.getElementById("aDataSheetSubmit").onclick = async (e) => {
	let linkIn = document.getElementById("subAdminDataSheetURLIn");
	if (!linkIn.checkValidity()) {
		alert("Please enter a valid link.");
		return;
	}
	if (
		!confirm("Are you sure you want to update the link? Is the sheet shared with or owned by polaris@westtown.edu?")
	) {
		return;
	}
	e.target.disabled = true;
	try {
		let link = document.getElementById("subAdminDataSheetURLIn").value;
		if (link.length < 39 + 44 - 1 || link.substring(39, 39 + 44).includes("/")) {
			alert("Cannot extract valid ID from link. Double check the link and try again.");
			e.target.disabled = false;
			return;
		}
		await updateDoc(doc(db, "settings", "adminList"), {
			dataSheet: {
				ID: link.substring(39, 39 + 44),
				URL: link,
			},
		});
		alert("Link updated successfully. Press update now to realize changes.");
	} catch (error) {
		alert(`There was an error updating the link: ${error.message}`);
		console.log(error);
	}
	e.target.disabled = false;
};

document.getElementById("infoUpdateButton").onclick = async (e) => {
	e.target.disabled = true;
	try {
		await updateUserInfo();
		alert("Information successfully updated.");
	} catch (error) {
		alert(`Error updating information: ${error.message}`);
		console.log(error);
	}
	e.target.disabled = false;
};

document.getElementById("creditReset").onclick = async (e) => {
	e.target.disabled = true;
	if (
		prompt(
			'Are you sure you want to do this. All credit accrued by all students will be set to zero. This cannot be undone. Type "RESET" to confirm.'
		) === "RESET"
	) {
		let res = await resetCreditFunction();
		if (res.data.status === "error") alert(`Error resetting credit: ${res.data.information}`);
		else alert("Credit reset successfully.");
	} else {
		alert("Credit not reset.");
	}
	e.target.disabled = false;
};

let testButton = document.getElementById("testButton");
if (testButton) {
	testButton.onclick = async (e) => {
		e.target.disabled = true;
		try {
			let res = await testFunc();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		e.target.disabled = false;
	};
}
