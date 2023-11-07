//Login page
document.addEventListener("DOMContentLoaded", function() {
   /*
      Need to add functioiality to the dashboard and logout 
      buttons. We need to put in new divs for each patient.
      Then need to have the search bar be able to search, 
      as well as the button working for that. Then the 
      ability to click a patient and go to their profile.
   */
   
   /*
      Functionality for dashboard and logout buttons
   */
   (function() {
      /*
         Dashboard button
      */
      document.querySelector("#dashboard").addEventListener("click", function() {
         window.location.assign("WebsiteDashboard.html");
      });
      
      /*
         Logout button
      */
      document.querySelector("#logout").addEventListener("click", function() {
         window.location.assign("index.html");
      });
   }());
   
   (function() {
      /*
         Search that will remove all divs
         and then put up new divs that put 
         patients that relate to the search
      */
      const updateSearch = function(name) {
         const patientsElement = document.querySelector("#patientsDiv");
         patientSize = 10;
         name = name.trim();
         if(name == "") {
            console.log("Present whole patient list");
         } else {
            console.log(name + " is being looked for");
         }
         
         // Clean out the patients list
         [...patientsElement.childNodes].forEach(function (childNode) {
            childNode.remove();
         });
            
         // Fill up the patients list
         for(let i = 0; i < patientSize; i++) {
            const childDiv = document.createElement("div");
            const childA = document.createElement("a");
            childDiv.setAttribute("id", "patient"); // Add the id of patient to the div
            childA.setAttribute("href", "WebsitePatient.html?" + i); // Add the click functionality to the patient
            childA.textContent = i; // Present patient name
            childDiv.appendChild(childA); // Append the child a element to the parent div
            patientsElement.appendChild(childDiv); // Append the child div to the parent div
         }
      };
      
      // Default call to present patients
      updateSearch("");
      
      /*
         Search bar button
      */
      document.querySelector("#searchButton").addEventListener("click", function() {
         updateSearch(document.querySelector("#search").value);
      });
      
      
      
   }());
});