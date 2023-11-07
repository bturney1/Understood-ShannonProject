//Patient page
document.addEventListener("DOMContentLoaded", function() {
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
         window.location.assign("index.html");
      });
   }());
   
   (function() {
      // Update the header to the patient's name or ID
      const patientID = window.location.search.substring(1, window.location.search.length);
      document.querySelector("#patientName").textContent = patientID;
      
   }());
});