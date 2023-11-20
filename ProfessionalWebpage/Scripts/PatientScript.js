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

        var firestoreTimestamps = [
            new Date("2023-11-20T12:00:00"),
            new Date("2023-11-20T12:35:00"),
            new Date("2023-11-20T12:40:00"),
            new Date("2023-11-21T08:30:00"),
            new Date("2023-11-22T18:45:00"),
            // Add more timestamps as needed
        ];

        // Your dataset
        var data = {
            labels: firestoreTimestamps,
            datasets: [
                {
                    label: 'Heart Rate',
                    data: [80, 76, 90, 150], // Replace with your actual data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        };

        // Filter data for specific dates
        var specificDates = ["2023-11-20"]; // Add the specific dates you want to display
        var filteredLabels = [];
        var filteredData = [];

        data.labels.forEach((timestamp, index) => {
            var timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (specificDates.includes(timestamp.toISOString().split('T')[0])) {
                filteredLabels.push(timeString);
                filteredData.push(data.datasets[0].data[index]);
            }
        });

        // Update data with filtered data
        data.labels = filteredLabels;
        data.datasets[0].data = filteredData;


        var options = {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var label = context.dataset.label || '';
                            var value = context.parsed.y || 0;
                            return `${label}: ${value} at ${context.label}`;
                        }
                    }
                }
            }
        };

        const myChart = new Chart("myChart", {
            type: "line",
            data: data,
            options: options
        });

    };
});