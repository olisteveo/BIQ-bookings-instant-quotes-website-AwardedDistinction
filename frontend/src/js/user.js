const user = {
    // Flag to indicate whether the user is logged in or not
    "loggedIn": false,

    // Function to be called when the user is logged in
    "userLoggedIn": function(token) {
        // Show logout button
        user.showLogout();
        // Show bookings button
        user.showBookings();
        // Hide login button
        user.hideLogin();
    },

    // Function to show the login button
    "showLogin": function() {
        $("#login-button-container").show();
    },

    // Function to hide the login button
    "hideLogin": function() {
        $("#login-button-container").hide();
    },

    // Function to show the logout button
    "showLogout": function() {
        $("#logout-button-container").show();
    },

    // Function to show the bookings button
    "showBookings": function() {
        $("#bookings-button-container").show();
    },

    // Event handler for user login button click
    "onUserLoginClick": function(e) {
        // Show login form dialog
        document.querySelector("#login-form-dialog").showModal();
        // Hide login button
        hideLoginButton();
    },

    //function to fetch user bookings
    getBookings: function(success_function, failure_function) {
        // Load bookings
        Taxicode_API.get("user/bookings", {
            data: { "auth_token": Cookie.get("tc_user_auth") },
            success: function(response) {
                console.log(response); // Log the entire response
                if (response.status == "OK") {
                    // Log user bookings
                    console.log("User bookings:", response.bookings);
                    
                    // Store user bookings
                    BookTaxiRide.user.bookings = response.bookings;
                    
                    // Custom success function
                    if (typeof success_function == "function") {
                        success_function(response.bookings);
                    }
                } else if (response.status == "ERROR") {
                    // Custom failure function
                    if (typeof failure_function == "function") {
                        failure_function(response.error);
                    }
                } else {
                    // Custom failure function
                    if (typeof failure_function == "function") {
                        failure_function("Unknown error");
                    }
                }
            },
            failure: function() {
                // Custom failure function
                if (typeof failure_function == "function") {
                    failure_function("Failed to login.");
                }
            }
        });
    },

    // Function to initialise user authentication
    "__init": function() {
        // Get authentication token from cookie
        token = Cookie.get('tc_user_auth');
        console.log(token);
        // Check if token exists
        if (token) {
            // Set user as logged in
            this.loggedIn = true;
            // Call userLoggedIn function
            user.userLoggedIn(token);
        } else {
            // Show login button
            user.showLogin();
        }

    }

}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function(event) {
    // Initialize user authentication
    user.__init();
});
