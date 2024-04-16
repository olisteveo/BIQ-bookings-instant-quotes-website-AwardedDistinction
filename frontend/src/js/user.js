const user = {
    "loggedIn" : false, 

    "userLoggedIn" : function(token) {
        user.showLogout();
        $("#login-button-container").hide();
    },

    "showLogin" :function() {
        $("#login-button-container").show();
    },

    "showLogout" :function() {
        $("#logout-button-container").show();
    },



    "onUserLoginClick" :function(e) {
        document.querySelector("#login-form-dialog").showModal();
        hideLoginButton();
    },

    getBookings: function(success_function, failure_function) {
        // Load bookings
        Taxicode_API.get("user/bookings", {
            data: {"auth_token": Cookie.get("user")},
            success: function(response) {
                if (response.status == "OK") {
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
                // Custom failire function
                if (typeof failure_function == "function") {
                    failure_function("Failed to login.");
                }
            }
        });
    },

    "__init" : function() {
        token = Cookie.get('tc_user_auth');
        console.log(token);
        if (token) {
            this.loggedIn = true;
            user.userLoggedIn(token);
        } else {
            user.showLogin();
        }
    
    }

}

document.addEventListener("DOMContentLoaded", function(event) {
    user.__init();
});