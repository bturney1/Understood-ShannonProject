// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAOFuW59Zaj7W9Zbvc2JHREFYaMNolSnww",
	authDomain: "teamunderstoodshannon.firebaseapp.com",
	projectId: "teamunderstoodshannon",
	storageBucket: "teamunderstoodshannon.appspot.com",
	messagingSenderId: "302604389305",
	appId: "1:302604389305:web:fd017389332c2906b3c468",
	measurementId: "G-RXCDK0QCK9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/701559

	var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider)
    .then((result) => {
        // Successful sign-in
        var user = result.user;
        console.log("Google user signed in:", user.displayName);
    })
    .catch((error) => {
        // Error handling
        console.error("Google sign-in failed:", error);
    });

	const changeTextButton = document.getElementById('changeTextButton');
    const paragraph = document.querySelector('p');

    changeTextButton.addEventListener('click', function() {
        paragraph.textContent = 'Text changed by JavaScript!';
    });

// Reference the "Patients" collection
const patientsCollection = db.collection("Patients");

// Retrieve data from the "Patients" collection
patientsCollection.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is an object representing the document
            const patientData = doc.data();
            console.log("Patient ID: ", doc.id);
            console.log("Patient Data: ", patientData);
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });

});
