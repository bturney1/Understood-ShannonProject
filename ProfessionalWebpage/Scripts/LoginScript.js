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
    (function() {
        /*
            The login function gathers the email and password that was entered.
            Then with this information it calls the firebase auth which 
            authenticates login information that is given to firebase previously.
        */
        const login = function() {
            // Gathering email and password
            const email = document.querySelector("#username").value;
            const password = document.querySelector("#password").value;
            // Making sure prompt is empty
            document.querySelector("#prompt").innerHTML = "";

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                console.log(error.Message);
                document.querySelector("#prompt").innerHTML = "The username/password was incorrect.";
            });

            // Handle Account Status
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    window.location = 'WebsiteDashboard.html'; //After successful login, user will be redirected to home.html
                }
            });
        };
        
        /*
            Functions for when the user clicks the button or presses enter.
        */
        document.querySelector("#login").addEventListener("click", function () {
            login();
        });
        
        document.querySelector("#username").addEventListener("keypress", function (event) {
            if(event.keyCode == 13) {
                login();
            }
        });
        
        document.querySelector("#password").addEventListener("keypress", function (event) {
            if(event.keyCode == 13) {
                login();
            }
        });
    }());
});