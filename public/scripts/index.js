const handleClick = (click) => {
	console.log(click.target.tagName);
	if (click.target.tagName === "SPAN") {
		click.target.classList.toggle("open");
		click.target.parentElement.parentElement.classList.toggle("open");
	} else if (click.target.tagName === "path") {
		click.target.parentElement.classList.toggle("open");
		if (click.target.parentElement.classList.contains("dayCollapse")) {
			click.target.parentElement.parentElement.parentElement.classList.toggle("open");
		} else {
			click.target.parentElement.parentElement.classList.toggle("open");
		}
	} else {
		click.target.classList.toggle("open");
		if (click.target.classList.contains("dayCollapse")) {
			click.target.parentElement.parentElement.classList.toggle("open");
		} else {
			click.target.parentElement.classList.toggle("open");
		}
	}
};

const addListeners = () => {
	let collapsing = document.getElementsByClassName("collapse");

	for (let el of collapsing) {
		el.addEventListener("click", handleClick);
	}
};

addListeners();

export { addListeners };

document.getElementById("sideMenuWrap").addEventListener("mouseleave", (ev) => {
	if (!ev.target.classList.contains("open")) {
		return;
	}
	document.getElementById("sideMenuWrap").classList.toggle("open");
	document.getElementById("menuToggle").classList.toggle("open");
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig } from "./config.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signOutWrap").addEventListener("click", () => {
	signOut(auth)
		.then(() => {
			window.location.href = "index.html";
		})
		.catch((error) => {
			alert(`There was a error signing out: ${error}`);
		});
});

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const uid = user.uid;
		console.log(user);
		let pfp = document.querySelector("#menuPF img");
		if (pfp) {
			pfp.loading = "lazy";
			pfp.src = user.photoURL;
		}
	} else {
		window.location.href = "public/index.html";
		console.log("user signed out");
	}
});
