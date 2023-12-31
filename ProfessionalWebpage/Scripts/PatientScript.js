// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Patient page
document.addEventListener("DOMContentLoaded", function () {
    // Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = "block";
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
                console.log("User has been logged out.");
            }).catch(function (error) {
                // An error happened.
                console.error("Error occurred during logout: " + error.message);
            });
            window.location.assign("index.html");
        });
    
        document.querySelector("#alertListOptions").addEventListener("change", function() {
            alertFunction();
        });
        
        const patientID = window.location.search.substring(1, 6);
        const db = firebase.firestore();

        // Update values in Firestore
        /*db.collection("Patients").doc(patientID).update({
            HRlow: newLow,
            HRhigh: newHigh,
        })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });*/
        
        /*
            Presenting the alert html
        */
        const alertFunction = (function () {
            const actualFunction = function() {
                var selectedValue = document.getElementById("alertListOptions").value;
                var alertDiv = document.getElementById("alertInputs");
                
                // Clear out the alertDiv
                alertDiv.innerHTML = "";
                
                // Clear out the promt div
                document.querySelector("#prompt").innerHTML = "";
                
                // Display heart rate 
                if (selectedValue == "heartRate") {
                    // Low label
                    var labelLow = document.createElement("label");
                    labelLow.textContent = "low: ";
                    // High label
                    var labelHigh = document.createElement("label");
                    labelHigh.textContent = "high: ";
                    // Low input
                    var inputLow = document.createElement("input");
                    inputLow.type = "text";
                    inputLow.id = "alertLow";
                    // High input
                    var inputHigh = document.createElement("input");
                    inputHigh.type = "text";
                    inputHigh.id = "alertHigh";
                    
                    // Append the labels and inputs
                    alertDiv.append(labelLow);
                    alertDiv.append(inputLow);
                    alertDiv.append(labelHigh);
                    alertDiv.append(inputHigh);
                } else if (selectedValue == "oxygenLevel") {
                    // Low label
                    var labelLow = document.createElement("label");
                    labelLow.textContent = "low: ";
                    // Low input
                    var inputLow = document.createElement("input");
                    inputLow.type = "text";
                    inputLow.id = "alertLow";
                    
                    // Append the label and input
                    alertDiv.append(labelLow);
                    alertDiv.append(inputLow);
                }
            }
            actualFunction();
            return actualFunction;
        })();
        
        // Clear the innerHTML
        document.querySelector("#prompt").innerHTML = "";
        /*
            Alert submit
        */
        document.querySelector("#submit").addEventListener("click", function () {
            var selectedValue = document.getElementById("alertListOptions").value;
            const newLow = parseInt(document.getElementById("alertLow").value, 10);
            // Only need to use newHigh if its on heartRate
            const newHigh = (selectedValue === "heartRate") ? parseInt(document.getElementById("alertHigh").value, 10) : null; 
            // Clear out the promt innerHTML
            document.querySelector("#prompt").innerHTML = "";
            if (selectedValue === "heartRate") {
                if (document.getElementById("alertLow").value === "" || document.getElementById("alertHigh").value === "") {
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Please set both fields";
                } else if (newLow <= 0 || newHigh <= 0) {
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Please enter positive numbers greater than 0";
                } else if (newHigh <= newLow) {
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Low must be less than high";
                } else {
                    // Have input that is useable 
                    db.collection("Patients").doc(patientID).update({
                        HRlow: newLow,
                        HRhigh: newHigh,
                    })
                        .then(() => {
                            console.log("Document successfully updated!");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });

                    document.querySelector("#prompt").style.color = "green";
                    document.querySelector("#prompt").innerHTML = "Limits Updated";
                }
            } else if (selectedValue = "oxygenLevel") {
                if (document.getElementById("alertLow").value === "") {
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Please set the field";
                } else if (newLow <= 0) { 
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Please enter a positive number greater than 0";
                } else if (newLow > 100) {
                    //error message
                    document.querySelector("#prompt").style.color = "red";
                    document.querySelector("#prompt").innerHTML = "Please enter a positive number less than or equal to 100";
                } else {
                    // Have input that is useable
                    db.collection("Patients").doc(patientID).update({
                        BOlow: newLow
                    })
                        .then(() => {
                            console.log("Document successfully updated!");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });

                    document.querySelector("#prompt").style.color = "green";
                    document.querySelector("#prompt").innerHTML = "Limits Updated";
                }
            }
        });
    };
    
    const patientFunction = function() {
        // Update the header to the patient"s name or ID
        const patientID = window.location.search.substring(1, window.location.search.length);
        document.querySelector("#patientName").textContent = patientID;
        
    };

    function setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zeros if needed
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;

        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById("vitalDate").value = formattedDate;
    }

    
    let myChart; // Declare a global variable to store the Chart instance

    /*
        Drawing the graph
    */
    const drawGraph = function () {
        // Get selected date from the input element
        const selectedDate = document.getElementById("vitalDate").value;

        // Destroy existing chart instance if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Get data from DB and then draw graph
        const db = firebase.firestore();
        const patientID = window.location.search.substring(1, 6);
        const heartDataCollection = db.collection("Patients").doc(patientID).collection("HeartData");
        const oxygenDataCollection = db.collection("Patients").doc(patientID).collection("OxygenData");

        const heartRateArray = [];
        const bloodOxygenArray = [];
        const timeStampArray = [];

        const startOfDay = new Date(selectedDate + "T00:00:00");
        const endOfDay = new Date(selectedDate + "T23:59:59");

        // Retrieve heart rate documents for the specific date
        heartDataCollection.where("TimeStamp", ">=", startOfDay)
            .where("TimeStamp", "<=", endOfDay)
            .get()
            .then((heartQuerySnapshot) => {
                const heartDataArr = [];
                heartQuerySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const timeStamp = new Date(data.TimeStamp.seconds * 1000);
                    const formattedTime = timeStamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    heartDataArr.push({ time: timeStamp, formattedTime: formattedTime, heartRate: data.HeartRate });
                });

                heartDataArr.sort((a, b) => a.time - b.time);

                heartDataArr.forEach((item) => {
                    timeStampArray.push(item.formattedTime);
                    heartRateArray.push(item.heartRate);
                });

                // Retrieve blood oxygen documents for the specific date
                return oxygenDataCollection.where("TimeStamp", ">=", startOfDay)
                    .where("TimeStamp", "<=", endOfDay)
                    .get();
            })
            .then((oxygenQuerySnapshot) => {
                const oxygenDataArr = [];
                oxygenQuerySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const timeStamp = new Date(data.TimeStamp.seconds * 1000);
                    const formattedTime = timeStamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    oxygenDataArr.push({ time: timeStamp, formattedTime: formattedTime, bloodOxygen: data.BloodOxygen });
                });

                oxygenDataArr.sort((a, b) => a.time - b.time);

                oxygenDataArr.forEach((item, index) => {
                    // Ensure both arrays have data for the same timestamps
                    if (index < heartRateArray.length) {
                        bloodOxygenArray.push(item.bloodOxygen);
                    }
                });

                const ctx = document.getElementById("myChart").getContext("2d");
                myChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: timeStampArray,
                        datasets: [
                            {
                                label: "Heart Rate",
                                data: heartRateArray,
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                                fill: false
                            },
                            {
                                label: "Blood Oxygen",
                                data: bloodOxygenArray,
                                borderColor: "rgba(255, 0, 0, 1)", // You can choose a different color
                                borderWidth: 1,
                                fill: false
                            }
                        ]
                    },
                    options: {
                        scales: {
                            x: {
                                type: "category",
                                labels: timeStampArray,
                                position: "bottom",
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
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    };


    document.getElementById("vitalDate").addEventListener("change", function () {
        const selectedDate = this.value;
        drawGraph(selectedDate);
    });

    /*// Initial call to draw the graph with the default date
    drawGraph();*/
});