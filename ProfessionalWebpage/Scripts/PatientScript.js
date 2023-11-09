//NAME FUNCTIONS

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

//Patient page
document.addEventListener("DOMContentLoaded", function () {
    //Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.body.style.display = 'block';
        } else {
            window.location.assign("index.html");
        }
    });
   /*
      Functionality for dashboard, search, and logout buttons
   */
   (function() {
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
   }());
   
   (function() {
      // Update the header to the patient's name or ID
      const patientID = window.location.search.substring(1, window.location.search.length);
      document.querySelector("#patientName").textContent = patientID;
      
   }());
});