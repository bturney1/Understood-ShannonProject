// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login page
document.addEventListener("DOMContentLoaded", function () {
    (function() {
        /*
            The login function gathers the email and password that was entered.
            Then with this information it calls the firebase auth which 
            authenticates login information that is given to firebase previously.
        */
        const login = async function () {
            // Database
            const db = firebase.firestore();

            // Gathering email and password
            const email = document.querySelector("#username").value;
            const password = document.querySelector("#password").value;

            // Making sure prompt is empty
            document.querySelector("#prompt").innerHTML = "";

            try {
                const snapshot = await db.collection('ProviderInfo').where('email', '==', email).get();

                if (snapshot.empty) {
                    // Do something if email is not found
                    document.querySelector("#prompt").innerHTML = "The username/password was incorrect.";
                } else {
                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        console.log(error.Message);
                        document.querySelector("#prompt").innerHTML = "The username/password was incorrect.";
                    });
                }
            } catch (error) {
                console.error('Error searching for email:', error);
            }

            // Handle Account Status
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    window.location = 'WebsiteDashboard.html'; // After successful login, the user will be redirected to WebsiteDashboard.html
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