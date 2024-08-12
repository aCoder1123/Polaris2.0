import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// const app = initializeApp(firebaseConfig);

export const handleAuth = async (app) => {
	console.log("handling auth");
	const auth = getAuth(app);
	const db = getFirestore(app, "maindb");

	let firebaseUser;
	let userInformation;
	const isAdminPage = window.location.href.includes("admin");
	const getUser = async (data) => {
		let userEmail = data.email;
		return getDoc(doc(db, "users", userEmail))
			.then(async (docSnap) => {
				if (docSnap.exists()) {
					return docSnap.data();
					// console.log(userData)
				} else {
					let newUser = userDoc;

					newUser.email = data.email;
					newUser.displayName = data.displayName;
					await setDoc(doc(db, "users", newUser.email), newUser);
					return newUser;
				}
			})
			.catch((error) => {
				return { status: "error", info: error };
			});
	};

	onAuthStateChanged(auth, (user) => {
		if (user) {
            userInformation
                getUser({ email: user.email, displayName: user.displayName }).then((data) => {
					if (isAdminPage && !currentUser.isAdmin) {
						window.location.href = `${isAdminPage ? "../" : ""}index.html`;
					}
					userInformation = data;
				});
			
			let pfp = document.querySelector("#menuPF img");
			if (pfp) {
				pfp.loading = "lazy";
				pfp.src = user.photoURL;
				document.getElementById("userName").innerText = user.displayName;
			}
		} else {
			window.location.href = `${isAdminPage ? "../" : ""}index.html`;
		}
	});

	document.getElementById("signOutWrap").addEventListener("click", () => {
		signOut(auth)
			.then(() => {
				window.location.href = `${isAdminPage ? "../" : ""}index.html`;
			})
			.catch((error) => {
				alert(`There was a error signing out: ${error}`);
			});
	});
};
