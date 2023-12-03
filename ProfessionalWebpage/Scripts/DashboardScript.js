// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Dashboard page
document.addEventListener("DOMContentLoaded", function () {
    // Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = 'block';
            buttons();
            dashboardFunction();
        } else {
            window.location.assign("index.html");
        }
    });
    /*
        Then make alerts show up and calculate what an alert or
        notificaiton entails.
    */
    
    /*
        Functionality for search and logout buttons
    */
    const buttons = function() {
        /*
            Search button
        */
        document.querySelector("#patientSearch").addEventListener("click", function() {
            window.location.assign("WebsiteSearch.html");
        });
        
        /*
            Logout button
        */
        document.querySelector("#logout").addEventListener("click", function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                console.log('User has been logged out.');
            }).catch(function (error) {
                // An error happened.
                console.error('Error occurred during logout: ' + error.message);
            });
            window.location.assign("index.html");
        });
    };
    
    /*
        Functionality for the alerts/notifications
    */
    const dashboardFunction = function() {
        /*
            Get database information
        */
        
        /*
            Generate alerts/notifications
        */
        
        /*
            Generate divs with the alerts/notifications
        */
        const updateAlerts = function () {
            const db = firebase.firestore();
            const alertsDiv = document.getElementById('alertsDiv');
            let i = 0;

            // Function to get notifications from Firestore
            db.collection('Notifications').get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        // Create a div for each notification
                        const notificationDiv = document.createElement('div');
                        notificationDiv.classList.add('clickableDiv');
                        const pID = doc.data().p_ID;
                        const docID = doc.id;

                        // Display the message inside the child div
                        const message = doc.data().message;
                        notificationDiv.innerHTML = `<p>${message}</p>`;

                        if (i % 2 == 0) {
                            notificationDiv.setAttribute("id", "alert");
                        } else {
                            notificationDiv.setAttribute("id", "notification");
                        }

                        // Determine the name of the patient to redirect to the correct HTML
                        let patientName;

                        db.collection('Patients')
                            .where('p_ID', '==', pID)
                            .get()
                            .then(querySnapshot => {
                                querySnapshot.forEach(doc => {
                                    // Display the details of the patient
                                    patientName = doc.data().firstName;
                                });
                            })
                            .catch(error => {
                                console.error('Error finding patient: ', error);
                            });

                        notificationDiv.addEventListener('click', () => {
                            // Delete the document from Firestore
                            deleteNotification(docID)
                                .then(() => {
                                    // Redirect to a different HTML page after deletion
                                    window.location.href = "WebsitePatient.html?" + pID + "." + patientName;
                                })
                                .catch(error => {
                                    console.error('Error deleting document: ', error);
                                });
                        });

                        // Append the child div to the alertsDiv container
                        alertsDiv.appendChild(notificationDiv);
                        i++;
                    });
                })
                .catch(error => {
                    console.error('Error getting notifications: ', error);
                });

            // Function to delete a notification from Firestore
            function deleteNotification(docId) {
                return db.collection('Notifications').doc(docId).delete();
            }
        };

        // Default call to update alerts
        updateAlerts();
    };
});