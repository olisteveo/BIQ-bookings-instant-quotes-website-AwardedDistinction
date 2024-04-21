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

// Wait for the DOM to be fully loaded
$(document).ready(function() {
    // Add event listeners to clear inputs when 'x' is clicked
    $('#clear-pickup').click(function(event) {
        event.preventDefault(); // Prevent form submission
        $('#pickup').val(''); // Clear the pickup input field
    });

    $('#clear-destination').click(function(event) {
        event.preventDefault(); // Prevent form submission
        $('#destination').val(''); // Clear the destination input field
    });
});

// Function to get the current date plus a specified number of days
function dateNowPlusDays(d) {
    var n = new Date(),
        nd = new Date(n.setDate(n.getDate() + d));
    return nd;
}

function showMap(pickupLat, pickupLng, destinationLat, destinationLng, journey) {
    $("#map-container").show(); // Show the map container
    const map = initializeMap(); // Initialize the map

    // Display the map banner after the map has been initialized
    $(".map-banner").show();

    const pickup = new google.maps.LatLng(pickupLat, pickupLng);
    const destination = new google.maps.LatLng(destinationLat, destinationLng);
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: {
            strokeColor: '#FF0000', // Red colour
            strokeOpacity: 0.8,
            strokeWeight: 3
        }
    });

    const request = {
        origin: pickup,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);

            // Extract journey details
            const journeyDate = journey.date;
            const pickupAddress = journey.pickup.string;
            const destinationAddress = journey.destination.string;
            const passengers = journey.people;
            const distance = journey.distance;
            const duration = journey.duration_text;

            // Construct HTML to display journey details
            const journeyDetailsHTML = `
                <p>Date: ${journeyDate}</p>
                <p>Pickup: ${pickupAddress}</p>
                <p>Destination: ${destinationAddress}</p>
                <p>Passengers: ${passengers}</p>
                <p>Distance: ${distance} miles</p>
                <p>Duration: ${duration}</p>
            `;

            // Append journey details to the map banner
            $(".map-banner").html(journeyDetailsHTML);
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

    // Check if 'journey' property exists
    if (results.hasOwnProperty('journey')) {
        const journey = results.journey;

        // Extract journey details
        const journeyDate = journey.date;
        const pickupAddress = journey.pickup.string;
        const destinationAddress = journey.destination.string;
        const passengers = journey.people;
        const distance = journey.distance;
        const duration = journey.duration_text;

        // Construct HTML to display journey details
        const journeyDetailsHTML = `
            <p>Date: ${journeyDate}</p>
            <p>Pickup: ${pickupAddress}</p>
            <p>Destination: ${destinationAddress}</p>
            <p>Passengers: ${passengers}</p>
            <p>Distance: ${distance} miles</p>
            <p>Duration: ${duration}</p>
        `;

        // Append journey details to the map banner
        $(".map-banner").html(journeyDetailsHTML);

        // Check if 'pickup' and 'destination' properties have the expected structure
        if (isValidLocation(journey.pickup) && isValidLocation(journey.destination)) {
            // Extract pickup and destination coordinates from the quote data
            const pickupLat = parseFloat(journey.pickup.position[0]);
            const pickupLng = parseFloat(journey.pickup.position[1]);
            const destinationLat = parseFloat(journey.destination.position[0]);
            const destinationLng = parseFloat(journey.destination.position[1]);

            // Check if the extracted coordinates are valid numbers
            if (!isNaN(pickupLat) && !isNaN(pickupLng) && !isNaN(destinationLat) && !isNaN(destinationLng)) {
                // Show the map and update the route
                showMap(pickupLat, pickupLng, destinationLat, destinationLng, journey);
            } else {
                console.error("Invalid latitude or longitude values");
            }
        } else {
            console.error("Invalid structure of 'pickup' or 'destination' properties");
        }
    } else {
        console.error("Missing 'journey' property in the results object");
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

// Test cases
// const validLocation = { position: [51.5074, -0.1278] }; // Valid location object
// const invalidLocation1 = { position: [51.5074] }; // Missing longitude
// const invalidLocation2 = { position: [51.5074, -0.1278, 0] }; // Additional value
// const invalidLocation3 = { }; // Missing position property
// const invalidLocation4 = null; // Null value

// Log results of the test cases
// console.log("Valid location:", isValidLocation(validLocation)); // Should return true
// console.log("Invalid location 1:", isValidLocation(invalidLocation1)); // Should return false
// console.log("Invalid location 2:", isValidLocation(invalidLocation2)); // Should return false
// console.log("Invalid location 3:", isValidLocation(invalidLocation3)); // Should return false
// console.log("Invalid location 4:", isValidLocation(invalidLocation4)); // Should return false


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
        if ($(this).scrollTop() > 1200) {
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
