// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOFuW59Zaj7W9Zbvc2JHREFYaMNolSnww",
    authDomain: "teamunderstoodshannon.firebaseapp.com",
    projectId: "teamunderstoodshannon",
    storageBucket: "teamunderstoodshannon.appspot.com",
    messagingSenderId: "302604389305",
    appId: "1:302604389305:web:fd017389332c2906b3c468",
    measurementId: "G-RXCDK0QCK9"
};

firebase.initializeApp(firebaseConfig);
// Patient page
document.addEventListener("DOMContentLoaded", function () {
    // Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = 'block';
            buttons();
            patientFunction();
            drawGraph();
        } else {
            window.location.assign("index.html");
        }
    });
    /*
        Functionality for dashboard, search, and logout buttons
    */
    const buttons = function() {
        /*
            Dashboard button
        */
        document.querySelector("#dashboard").addEventListener("click", function() {
            window.location.assign("WebsiteDashboard.html");
        });
        
        /*
            Search button
        */
        document.querySelector("#patientSearch").addEventListener("click", function() {
            window.location.assign("WebsiteSearch.html");
        });
        
        /*
            Logout button
        */
        document.querySelector("#logout").addEventListener("click", function() {
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
    
    const patientFunction = function() {
        // Update the header to the patient's name or ID
        const patientID = window.location.search.substring(1, window.location.search.length);
        document.querySelector("#patientName").textContent = patientID;
        
    };

    /*
        Draw Graph
    */
    const drawGraph = function () {

        //Get data from DB and then draw graph
        // Reference to the HeartData subcollection
        const db = firebase.firestore();
        const patientID = window.location.search.substring(1, 6);  // Replace with the actual patient ID
        const heartDataCollection = db.collection("Patients").doc(patientID).collection("HeartData");

        // Arrays to store HeartRate and TimeStamp
        const heartRateArray = [];
        const timeStampArray = [];

        // Retrieve all documents in the HeartData subcollection
        heartDataCollection.get().then((querySnapshot) => {
            const dataArr = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const timeStamp = new Date(data.TimeStamp.seconds * 1000);
                const formattedTime = timeStamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                dataArr.push({ time: timeStamp, formattedTime: formattedTime, heartRate: data.HeartRate });
            });

            // Sort the dataArr based on the time
            dataArr.sort((a, b) => a.time - b.time);

            // Populate the arrays after sorting
            dataArr.forEach((item) => {
                timeStampArray.push(item.formattedTime);
                heartRateArray.push(item.heartRate);
            });

            // Example: Print the arrays
            console.log("Heart Rates:", heartRateArray);
            console.log("Time Stamps:", timeStampArray);

            // Use Chart.js to create a chart
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeStampArray,
                    datasets: [{
                        label: 'Heart Rate',
                        data: heartRateArray,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category', // Use category scale for custom labels
                            labels: timeStampArray,
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }).catch((error) => {
            console.error("Error getting documents: ", error);
        });
    };
});