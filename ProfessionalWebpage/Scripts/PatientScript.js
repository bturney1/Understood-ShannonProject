// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Patient page
document.addEventListener("DOMContentLoaded", function () {
    // Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = 'block';
            buttons();
            patientFunction();
            setDefaultDate();
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

    function setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById('vitalDate').value = formattedDate;
    }

    
    let myChart; // Declare a global variable to store the Chart instance

    /*
        Draw Graph
    */
    const drawGraph = function () {
        // Get selected date from the input element
        const selectedDate = document.getElementById('vitalDate').value;

        // Destroy existing chart instance if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Get data from DB and then draw graph
        const db = firebase.firestore();
        const patientID = window.location.search.substring(1, 6);
        const heartDataCollection = db.collection("Patients").doc(patientID).collection("HeartData");

        const heartRateArray = [];
        const timeStampArray = [];

        const startOfDay = new Date(selectedDate + 'T00:00:00');
        const endOfDay = new Date(selectedDate + 'T23:59:59');

        // Retrieve documents for the specific date
        heartDataCollection.where('TimeStamp', '>=', startOfDay)
            .where('TimeStamp', '<=', endOfDay)
            .get()
            .then((querySnapshot) => {
                const dataArr = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const timeStamp = new Date(data.TimeStamp.seconds * 1000);
                    const formattedTime = timeStamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    dataArr.push({ time: timeStamp, formattedTime: formattedTime, heartRate: data.HeartRate });
                });

                dataArr.sort((a, b) => a.time - b.time);

                dataArr.forEach((item) => {
                    timeStampArray.push(item.formattedTime);
                    heartRateArray.push(item.heartRate);
                });

                const ctx = document.getElementById('myChart').getContext('2d');
                myChart = new Chart(ctx, {
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
                                type: 'category',
                                labels: timeStampArray,
                                position: 'bottom',
                                grid: {
                                    drawTicks: false,
                                }
                            },
                            y: {
                                suggestedMin: 0, // Enforce a minimum value for the y-axis
                                stepSize: 1, // Display whole numbers
                            }
                        }
                    }
                });
            }).catch((error) => {
                console.error("Error getting documents: ", error);
            });
    };

    document.getElementById('vitalDate').addEventListener('change', function () {
        const selectedDate = this.value;
        drawGraph(selectedDate);
    });

    /*// Initial call to draw the graph with the default date
    drawGraph();*/
});