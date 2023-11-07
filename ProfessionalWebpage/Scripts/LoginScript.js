//Login page
document.addEventListener("DOMContentLoaded", function () {
   /*
      Need to be able to read the email address and password
      and then validate them and then send to the dashboard
      if validated, if not, then present the ability to relogin.
   */
   (function() {
      /*
         Function to hash the password to keep in encrypted.
      */
      const hashPass = function(pass) {
         return pass;
      };
      
      /*
         Function to validate the user.
      */
      const validate = function(user, pass) {
         if(user == "true") {
            return true;
         } else {
            return false;
         }
      };
      
      /*
         Function to process the login. It will get the username 
         and the password. Then it will call hashPass so it can 
         get the encrypted password, and then call validate with 
         the username and hashed password. If the user is validated 
         then load the dashboard, if the user is not validated 
         prompt the user to relogin.
      */
      const login = function() {
         const inputUser = document.querySelector("#username").value;
         const inputPass = document.querySelector("#password").value;
         const hashedPass = hashPass(inputPass);
         document.querySelector("#prompt").innerHTML = "";
         
         if(validate(inputUser, hashedPass)) {
            window.location.assign("WebsiteDashboard.html");
         } else {
            document.querySelector("#prompt").innerHTML = "The username/password was incorrect.";
         } 
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