//Dashboard page
document.addEventListener("DOMContentLoaded", function() {
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
   (function() {
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
         window.location.assign("index.html");
      });
   }());
   
   /*
      Functionality for the alerts/notifications
   */
   (function() {
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
               childDiv.classList.add("alert");
            } else {
               childDiv.classList.add("notification");
            }
            alertsElement.appendChild(childDiv); // Append the child div to the parent div
         }
      };
      
      updateAlerts();
   }());
});