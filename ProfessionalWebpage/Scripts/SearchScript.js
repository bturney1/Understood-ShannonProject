// Initialize Firebase
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
    
    const searchFunction = function () {
        const db = firebase.firestore();
        const patientsCollection = db.collection("Patients");

        // Array of objects to store collection IDs and names
        const patientDataArray = [];
        var namesList = [];
        var sortedPatientIDsArray = [];
        // Retrieve all documents in the Patients collection
        patientsCollection.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Get data from the document
                const data = doc.data();

                // Extract collection ID and name
                const patientID = doc.id;
                const patientName = data.firstName; // Replace with the actual field name in your documents

                // Store in the array of objects
                patientDataArray.push({ id: patientID, name: patientName });
            });

            // Sort the patientDataArray alphabetically by name
            patientDataArray.sort((a, b) => a.name.localeCompare(b.name));

            // Extract the sorted IDs and namesList
            sortedPatientIDsArray = patientDataArray.map((item) => item.id);
            namesList = patientDataArray.map((item) => item.name);

            // Example: Print the sorted arrays
            //console.log("Patient IDs:", sortedPatientIDsArray);
            //console.log("Names List:", namesList);
            // Default call to present patients
            updateSearch("");
            // You can use sortedPatientIDsArray and namesList as needed
        }).catch((error) => {
            console.error("Error getting documents: ", error);
        });
        //const namesList = ["John", "Ethan", "Ben", "Victor", "Aledis", "Almira", "Skylar", "Skyler", "Caige", "Jackie"]; 
        
        const getRelatedNames = function (inputName) {
            inputName = inputName.toLowerCase();

            const relatedData = namesList.reduce((accumulator, name, index) => {
                if (name.toLowerCase().includes(inputName)) {
                    accumulator.relatedNames.push(name);
                    accumulator.relatedIDs.push(sortedPatientIDsArray[index]);
                }
                return accumulator;
            }, { relatedNames: [], relatedIDs: [] });

            return relatedData;
        };

        /*
            Search that will remove all divs
            and then put up new divs that put 
            patients that relate to the search
        */
        const updateSearch = function (inputName) {
            console.log(namesList);
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
            const { relatedNames, relatedIDs } = getRelatedNames(inputName);
            // Sort array of names in alphabetical
            //relatedNames.sort();
            
            // Fill up the patients list
            for(let i = 0; i < relatedNames.length; i++) {
                const childDiv = document.createElement("div");
                const childA = document.createElement("a");
                childDiv.setAttribute("id", "patient"); // Add the id of patient to the div
                childA.setAttribute("href", "WebsitePatient.html?" + relatedIDs[i] + "." + relatedNames[i]); // Add the click functionality to the patient
                childA.textContent = i + "." + relatedNames[i]; // Present patient name
                childDiv.appendChild(childA); // Append the child a element to the parent div
                patientsElement.appendChild(childDiv); // Append the child div to the parent div
            }
        };
        
        
        
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