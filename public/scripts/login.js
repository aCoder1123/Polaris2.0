import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// import firebase from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js";
// import "./firebase/firestore";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { firebaseConfig } from "./config.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
const auth = getAuth();




function toggleSignIn() {
	if (!auth.currentUser) {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({
			login_hint: "first.last@westtown.edu",
		});
		signInWithPopup(auth, provider)
			.then(function (result) {
				if (!result) return;
				const credential = GoogleAuthProvider.credentialFromResult(result);
				// This gives you a Google Access Token. You can use it to access the Google API.
				const token = credential?.accessToken;
				// The signed-in user info.
				const user = result.user;
                console.log(user)
                document.getElementById("nameFiller").innerText = user.displayName;
                let img = document.createElement("img")
                img.src = user.photoURL
                img.id = "pfp"
                document.getElementById("photoHolder").append(img);
                document.getElementById("signInButton").innerText =
									"Sign Out";
                window.location.href = "../coffeeMachine.html"
			})
			.catch(function (error) {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				const credential = error.credential;
				if (errorCode === "auth/account-exists-with-different-credential") {
					alert(
						"You have already signed up with a different auth provider for that email."
					);
					// If you are using multiple auth providers on your app you should handle linking
					// the user's accounts here.
				} else {
					console.error(error);
				}
			});
	} else {
		signOut(auth);
        document.getElementById("nameFiller").innerText = "";
        document.getElementById("pfp").remove()
        document.getElementById("signInButton").innerText = "Sign In With Google";
        alert("Signed Out")
	}
	// signInButton.disabled = true;

}
document.getElementById("signInButton").addEventListener("click", toggleSignIn, false)


// Removed from config
// "rewrites": [
//       {
//         "source": "**",
//         "destination": "/index.html"
//       }
//     ]

// "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run lint"]