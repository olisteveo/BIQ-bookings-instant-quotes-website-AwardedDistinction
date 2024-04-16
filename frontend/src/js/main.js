// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Initialise the map when quotes are loaded
function initializeMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.5074, lng: 0.1272 },
        zoom: 8
    });
    return map;
}

// Function to get the current date plus a specified number of days
function dateNowPlusDays(d) {
    var n = new Date(),
        nd = new Date(n.setDate(n.getDate() + d));
    return nd;
}

// Function to show the route map
function showMap(pickupLat, pickupLng, destinationLat, destinationLng) {
    $("#map-container").show(); // Show the map container
    const map = initializeMap(); // Initialize the map
    console.log(pickupLat, pickupLng, destinationLat, destinationLng);
    const pickup = new google.maps.LatLng(pickupLat, pickupLng);
    const destination = new google.maps.LatLng(destinationLat, destinationLng);
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    const request = {
        origin: pickup,
        destination: destination,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
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

function renderResults(results) {
    console.log(results);
    // Check if 'pickup' and 'destination' properties exist
    if (results.journey.hasOwnProperty('pickup') && results.journey.hasOwnProperty('destination')) {
        // Check if 'pickup' and 'destination' properties have the expected structure
        if (isValidLocation(results.journey.pickup) && isValidLocation(results.journey.destination)) {
            // Extract pickup and destination coordinates from the quote data
            const pickupLat = parseFloat(results.journey.pickup.position[0]);
            const pickupLng = parseFloat(results.journey.pickup.position[1]);
            const destinationLat = parseFloat(results.journey.destination.position[0]);
            const destinationLng = parseFloat(results.journey.destination.position[1]);

            // Check if the extracted coordinates are valid numbers
            if (!isNaN(pickupLat) && !isNaN(pickupLng) && !isNaN(destinationLat) && !isNaN(destinationLng)) {
                // Show the map and update the route
                showMap(pickupLat, pickupLng, destinationLat, destinationLng);
            } else {
                console.error("Invalid latitude or longitude values");
            }
        } else {
            console.error("Invalid structure of 'pickup' or 'destination' properties");
        }
    } else {
        console.error("Missing 'pickup' or 'destination' properties in the results object");
    }
}

// Function to validate the structure of a location object
function isValidLocation(location) {
    return (
        location &&
        location.hasOwnProperty('position') &&
        Array.isArray(location.position) &&
        location.position.length === 2
    );
}

// Event listener for when the DOM is fully loaded
$(document).ready(function() {
    console.log("Document is ready");

    // Load previous search suggestions from cookie
    var previousSearches = getCookie("previous_searches");
    if (previousSearches) {
        // Split the cookie value into an array of search suggestions
        var searchSuggestions = previousSearches.split(",");
        // Add search suggestions to the autocomplete feature of the search inputs
        $("#pickup, #destination").autocomplete({
            source: searchSuggestions
        });
    }

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

    // Event handler for search form submission
    $("#biq-journey-form-submit").on("click", function(e) {
        e.preventDefault();
        var f = $("#biq-journey-form");
        var journeyData = {
            "pickup": f.find("[name=pickup]").val(),
            "destination": f.find("[name=destination]").val(),
            "date": f.find("[name=date]").val() + f.find("[name=time]").val(),
            "passengers": parseInt(f.find("[name=passengers]").val())
        };
        $("#quote-results").html($("<p><img src='/img/loading.gif' alt='Loading...' /></p>"));
        BIQ.getQuotes(journeyData, renderResults); // Call renderResults with the quote data

        // Update previous search suggestions
        var previousSearches = getCookie("previous_searches");
        if (previousSearches) {
            // Split the cookie value into an array of search suggestions
            var searchSuggestions = previousSearches.split(",");
            // Add the new search to the array
            searchSuggestions.push(journeyData.pickup);
            searchSuggestions.push(journeyData.destination);
            // Remove duplicate entries
            searchSuggestions = Array.from(new Set(searchSuggestions));
            // Update the cookie with the new search suggestions
            setCookie("previous_searches", searchSuggestions.join(","), 30);
        } else {
            // If no previous searches exist, create a new cookie with the current search
            setCookie("previous_searches", journeyData.pickup + "," + journeyData.destination, 30);
        }
    });
});
