

// Initialise the map when quotes are loaded
function initializeMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.5074, lng: 0.1272 },
        zoom: 8
    });
}
// Function to get the current date plus a specified number of days
function dateNowPlusDays(d) {
    var n = new Date(),
        nd = new Date(n.setDate(n.getDate() + d));
    return nd;
}

// Function to show the route map
function showMap() {
    $("#map-container").show(); // Show the map container
    initializeMap(); // Initialize the map
}

// Function to hide the logout button container
function hideLogout() {
    $("#logout-button-container").hide(); // Hide the logout button container
}

// Function to hide the login button container
function hideLoginButton() {
    $("#login-button-container").hide(); // Hide the login button container
}

// Function to hide the login form
function hideLogin() {
    document.querySelector("#login-form-dialog").close(); // Close the login form dialog
    user.showLogin(); // Show the login
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("event loaded");

    // Event handler for the "Show Login Form" button click
    $("#show-login-form").on("click", user.onUserLoginClick);

    // Event handler for the login form submission
    $("#login-form-submit").on("click", function(e){
        e.preventDefault();
        var f = $("#login-form");
        BIQ.login({
            "email" : f.find("[name='login']").val(),
            "password" : f.find("[name='password']").val()
        }, function(response) {
            console.log(response);
            if(response.status == BIQ.STATUS_OK) {
                // Set user authentication token in a cookie
                Cookie.set("tc_user_auth", response.user.auth_token, 30);
                // Notify user login
                user.userLoggedIn(response.user.auth_token);
                hideLogin(); // Hide the login form
                user.showLogout(); // Show the logout button
                alert("refresh to get rid");
            } else {
                alert("Unable to Login");
            }
        });
    });

    // Event handler for cancelling login
    $("#cancel-login").on("click", function(e){
        e.preventDefault();
        hideLogin(); // Hide the login form
    });

    // Event handler for logout
    $("#logout").on("click", function(e){
        e.preventDefault();
        BIQ.logout(function(response) {
            console.log(response);
            // Remove user authentication token cookie
            Cookie.remove("tc_user_auth");
            hideLogout(); // Hide the logout button container
            user.showLogin(); // Show the login button
        });
    });

    // Event handler for window scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 400) {
            $('#back-to-top').fadeIn(); // Fade in the "Back to Top" button
        } else {
            $('#back-to-top').fadeOut(); // Fade out the "Back to Top" button
        }
    });

    // Event handler for "Back to Top" button click
    $('#back-to-top a').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 800); // Scroll to the top of the page
        return false;
    });
});
