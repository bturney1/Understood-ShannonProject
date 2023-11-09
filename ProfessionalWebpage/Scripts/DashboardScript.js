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

//Dashboard page
document.addEventListener("DOMContentLoaded", function () {
    //Handle Account Status
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
      Need to add functionality to the patient search button
      that loads the patient search page. Then need to add
      functionality to the log out button, to log the user
      out and return them to the log in screen. Then make 
      alerts show up and calculate what an alert or
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
      const updateAlerts = function() {
         //Sample code
         const alertsElement = document.querySelector("#alertsDiv");
         for(let i = 0; i < 10; i++) {
            const childDiv = document.createElement("div");
            childDiv.textContent = i;
            if(i % 2 == 0) {
               childDiv.setAttribute("id", "alert");
            } else {
               childDiv.setAttribute("id", "notification");
            }
            alertsElement.appendChild(childDiv); // Append the child div to the parent div
         }
      };
      
      updateAlerts();
    };
});