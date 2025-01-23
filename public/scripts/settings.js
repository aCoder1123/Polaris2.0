import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-check.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	doc,
	setDoc,
	onSnapshot,
	deleteDoc,
	updateDoc,
	query,
	where,
	connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
import {
	dataToFullHTML,
	daysOfTheWeek as weekDays,
	addListeners,
	Weekend,
	WeekendEvent,
	getUserFromEmail,
	handleDBError,
	getMenuHTMLString,
} from "./util.js";
import { firebaseConfig, siteKey } from "./config.js";

const app = initializeApp(firebaseConfig);
if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
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

if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	console.log("Connecting Firebase Emulator");
}

let firebaseUser;
let userInformation;

let adminList = [];

onAuthStateChanged(auth, (user) => {
	if (user) {
		firebaseUser = user;
		getUserFromEmail(user.email, user.displayName, db, functions).then((data) => {
			if (!data.isAdmin) window.location.href = "../index.html";
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
			addListeners();
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

		const q = query(collection(db, "users"), where("gradyear", "!=", null));
		const unsub5 = onSnapshot(q, (collection) => {
			let creditList = [];
			let chartDataList = [["Email", "Boarding", "Day"]];
			collection.forEach((doc) => {
				let data = doc.data();
				creditList.push({
					credit: data.credit,
					email: data.email,
					housing: data.day_boarding,
					htmlString1: `<div id="${data.email}" class="student">
								<span class="studentNum">`,
					htmlString2: `. </span>
								<span class="studentHousing ${data.day_boarding}">${data.day_boarding}</span>
								<span class="studentEmail">${data.email}:</span>
								<span class="studentCredit">${data.credit} Credit</span>
							</div>`,
				});
				if (data.day_boarding === "B") chartDataList.push([data.email, data.credit, null]);
				else chartDataList.push([data.email, null, data.credit]);
			});
			creditList.sort((a, b) => {
				if (a.credit != b.credit) return b.credit - a.credit;
				else if (a.housing != b.housing) return a.housing === "B" ? -1 : 1;
				return [a.email, b.email].sort()[0] === a.email ? -1 : 1;
			});
			let wrap = document.getElementById("creditListWrap");
			let num = 1
			for (let student of creditList) {
				wrap.insertAdjacentHTML("beforeend", student.htmlString1 + num + student.htmlString2);
				num++
			}
			google.charts.load("current", { packages: ["corechart"] });
			google.charts.setOnLoadCallback(() => {
				let chartData = google.visualization.arrayToDataTable(chartDataList);
				let options = {
					title: "Credit of Student Population",
					titleTextStyle: {
						color: "black",
						// fontName: <string>,
						fontSize: 13,
						bold: false,
						italic: true,
					},
					legend: { position: "none" },
					// histogram: { lastBucketPercentile: 5 /*bucketSize: 40*/ },
					vAxis: { title: "# students", titleTextStyle: { fontSize: 10 }, logScale: false },
					hAxis: {
						title: "Credit",
						titleTextStyle: { fontSize: 10 },
						slantedText: true,
						slantedTextAngle: 45,
					},
					width: window.innerWidth > window.innerHeight ? window.innerWidth * 0.27 : window.innerWidth * 0.7,
					height: window.innerHeight * 0.35,
					chartArea: { left: "15%", top: "20%", width: "83%", height: "60%" },
					legend: { position: "top", maxLines: 2 },
					series: [
						{ color: "#407ca2", visibleInLegend: true },
						{ color: "#623b2a", visibleInLegend: true },
					],
					// bar: {gap: 0}
				};
				let chart = new google.visualization.Histogram(document.getElementById("creditGraphWrap"));
				chart.draw(chartData, options);
			});
		});

		const unsub6 = onSnapshot(collection(db, "bugReports"), (collection) => {
			let bugReportList = []
			collection.forEach((doc) => {
				let reportData = doc.data()
				let report = {status: reportData.status, num: doc.id}
				report.htmlString = `<div class="bugReport noScrollBar">
								<h4 class="bugReportHead">Bug Report #${doc.id} - ${reportData.date.toDate().toString().substring(0, 21)}</h4>
								<div class="bugInfoWrap">
									<div class="pageWrap bugInfo">
										<span class="material-symbols-outlined"> web </span>
										<span class="reportInfo"><b>${reportData.page}</b></span>
									</div>
									<div class="descWrap bugInfo">
										<span class="material-symbols-outlined"> description </span>
										<span class="reportInfo">
											${reportData.description}
										</span>
									</div>
									<div class="reproWrap bugInfo">
										<span class="material-symbols-outlined"> stairs </span>
										<span class="reportInfo">
											${reportData.reproduction}
										</span>
									</div>
									<div class="reporterWrap bugInfo">
										<span class="material-symbols-outlined"> person_alert </span>
										<span class="reportInfo">${reportData.reporter}</span>
									</div>
									
								</div>
							</div>`;
							// <div class="bountyWrap bugInfo">
								// 	<span class="material-symbols-outlined"> rewarded_ads </span>
								// 	<input type="number" min="1" max="100" step="1" class="bountyIn" />
								// 	<button class="awardBtn">Award Bounty to Reporter</button>
								// </div> 
							// <div class="statusWrap bugInfo">
							// 	<span class="material-symbols-outlined"> priority_high </span>
							// 	<select id="" class="statusSelect reportInfo">
							// 		<option value="resolved">Resolved</option>
							// 		<option value="dismissed">Dismissed</option>
							// 		<option value="inProgress">In Progress</option>
							// 		<option value="open">Open</option>
							// 	</select>
							// </div>;
				bugReportList.push(report)
			})
			let wrap = document.getElementById("bugReportsListWrap");
			wrap.replaceChildren()
			for (let report of bugReportList) {
				wrap.insertAdjacentHTML("afterbegin", report.htmlString)
			}
		})

		addListeners();
	} else window.location.href = "../index.html";
});

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

document.getElementById("testButton").onclick = async (e) => {
	e.target.disabled = true;
	alert("Tests started. Current date should be returned if tests were successful.");
	try {
		await getDoc(doc(db, "settings", "config"));
		let testRes = await testFunc();
		alert(testRes.data.info);
	} catch (error) {
		alert(`Error running tests: ${error}`);
	}
	e.target.disabled = false;
};

