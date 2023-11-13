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

// Login page
document.addEventListener("DOMContentLoaded", function () {
    // Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = 'block';
            buttons();
            searchFunction();
        } else {
            window.location.assign("index.html");
        }
    });
    
    /*
        We need to put in new divs for each patient.
    */
    
    /*
        Functionality for dashboard and logout buttons
    */
    const buttons = function() {
        /*
            Dashboard button
        */
        document.querySelector("#dashboard").addEventListener("click", function() {
            window.location.assign("WebsiteDashboard.html");
        });
        
        /*
            Logout button
        */
        document.querySelector("#logout").addEventListener("click", function() {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                console.log("User has been logged out.");
            }).catch(function (error) {
                // An error happened.
                console.error("Error occurred during logout: " + error.message);
            });
            window.location.assign("index.html");
        });
    };
    
    const searchFunction = function() {
        // Sample code to try and get search working
        const namesList = ["John", "Ethan", "Ben", "Victor", "Aledis", "Almira", "Skylar", "Skyler", "Caige", "Jackie"]; 
        
        const getRelatedNames = function(inputName) {
            inputName = inputName.toLowerCase();
            const relatedNames = namesList.filter(name => name.toLowerCase().includes(inputName));
            return relatedNames;
        }
        /*
            Search that will remove all divs
            and then put up new divs that put 
            patients that relate to the search
        */
        const updateSearch = function(inputName) {
            const patientsElement = document.querySelector("#patientsDiv");
            inputName = inputName.trim();
            if(inputName == "") {
                console.log("Present whole patient list");
            } else {
                console.log(inputName + " is being looked for");
            }
            
            // Clean out the patients list
            [...patientsElement.childNodes].forEach(function (childNode) {
                childNode.remove();
            });
            
            // Get an array of related names
            let relatedNames = getRelatedNames(inputName);
            // Sort array of names in alphabetical
            relatedNames.sort();
            
            // Fill up the patients list
            for(let i = 0; i < relatedNames.length; i++) {
                const childDiv = document.createElement("div");
                const childA = document.createElement("a");
                childDiv.setAttribute("id", "patient"); // Add the id of patient to the div
                childA.setAttribute("href", "WebsitePatient.html?" + i + "." + relatedNames[i]); // Add the click functionality to the patient
                childA.textContent = i + "." + relatedNames[i]; // Present patient name
                childDiv.appendChild(childA); // Append the child a element to the parent div
                patientsElement.appendChild(childDiv); // Append the child div to the parent div
            }
        };
        
        // Default call to present patients
        updateSearch("");
        
        /*
            Search bar button and enter press
        */
        document.querySelector("#searchButton").addEventListener("click", function() {
            updateSearch(document.querySelector("#search").value);
        });
        
        document.querySelector("#search").addEventListener("keypress", function (event) {
            if(event.keyCode == 13) {
                updateSearch(document.querySelector("#search").value);
            }
        });
    };
});