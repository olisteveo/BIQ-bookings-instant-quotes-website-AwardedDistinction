// Function to generate star rating HTML based on numeric rating
function generateStarRating(rating) {
    // Initialize variables
    var starsHTML = '';
    var fullStars = Math.floor(rating);
    var halfStar = rating - fullStars >= 0.5;

    // Add full stars
    for (var i = 0; i < fullStars; i++) {
        starsHTML += '<img class=\"star-icon\" src="/img/star.png" alt="Full Star">';
    }

    // Add half star if required
    if (halfStar) {
        starsHTML += '<img class=\"star-icon\" src="/img/half-star.png" alt="Half Star">';
    }

    // Add empty stars to complete 5 stars
    for (var j = fullStars + (halfStar ? 1 : 0); j < 5; j++) {
        starsHTML += '<img class=\"star-icon\" src="/img/empty-star.png" alt="Empty Star">';
    }

    return starsHTML;
}

// Object to manage quote functionalities
const quotes = {
    "quoting": false, // Flag to track if quoting is in progress

    // Function to handle the "Book Now" button click event
    "onBookNowClick": function(e) {
        alert(e.currentTarget);
        console.log($(e.currentTarget));
    },

    // Function to check if quoting is in progress
    "isQuoting": function() {
        return this.quoting;
    },

    // Function to handle the form submission for searching quotes
    "onSearchSubmit": function(e) {
        // Prevent form submission
        e.preventDefault();

        // Check if quoting is already in progress
        if (quotes.isQuoting()) { return; }

        // Set quoting to true to prevent multiple submissions
        quotes.quoting = true;

        // Hide map and related banners
        $("#map-container").hide();
        $(".map-banner").hide();
        $(".other-rates-banner").hide();

        // Extract form data
        var f = $("#biq-journey-form"),
            j = {
                "pickup": f.find("[name=pickup]").val(),
                "destination": f.find("[name=destination]").val(),
                "date": f.find("[name=date]").val() + f.find("[name=time]").val(),
                "passengers": parseInt(f.find("[name=passengers]").val())
            };

        // Log form data
        console.log(j);
        console.log(f);

        // Display loading indicator
        $("#quote-results").html($("<p><img src='/img/loading.gif' alt='Loading...' /></p>"));

        // Request quotes
        BIQ.getQuotes(j, quotes.renderResults);
    },

    // Function to render quote search results
    "renderResults": function(results) {
        if (results.status == BIQ.STATUS_OK) {
            if (Object.keys(results.quotes).length) {
                var ele = $("<div id='quote-results'></div>"); // Create a container for quote results
                var highlightedQuotes = []; // Array to store highlighted quotes
                var otherQuotes = []; // Array to store other quotes
                var uberQuote = null; // Store Uber quote separately
                var blackCabQuote = null; // Store Black Cab quote separately

                // Separate quotes into highlighted, Uber, and Black Cab categories
                $.each(results.quotes, function(idx, itm) {
                    if (itm.highlight) {
                        highlightedQuotes.push(itm); // Add to highlighted quotes
                    } else if (itm.company_name.toLowerCase() === "uber") {
                        uberQuote = itm; // Store Uber quote
                    } else if (itm.company_name.toLowerCase() === "black cab") {
                        blackCabQuote = itm; // Store Black Cab quote
                    } else {
                        otherQuotes.push(itm); // Add to other quotes
                    }
                });

                // Render highlighted quotes
                if (highlightedQuotes.length > 0) {
                    var highlightedContainer = $("<div id='highlighted-quotes' class='quote-section'></div>");
                    $.each(highlightedQuotes, function(idx, itm) {
                        highlightedContainer.append(quotes.createQuoteCard(idx, itm)); // Append each highlighted quote card to the container
                    });
                    ele.append(highlightedContainer); // Append highlighted quotes to the main container

                    // Add horizontal border after the highlighted quotes
                    highlightedContainer.after("<div class='horizontal-border'></div>");
                }

                // Render other quotes in rows of 4
                if (otherQuotes.length > 0) {
                    var otherQuotesContainer = $("<div id='other-quotes' class='quote-section'></div>");
                    var row = $("<div class='quote-row'></div>");
                    $.each(otherQuotes, function(idx, itm) {
                        row.append(quotes.createQuoteCard(idx, itm)); // Append each other quote card to the row
                        if ((idx + 1) % 4 === 0 || idx === otherQuotes.length - 1) {
                            otherQuotesContainer.append(row); // Append the row to the other quotes container
                            row = $("<div class='quote-row'></div>"); // Start a new row
                        }
                    });
                    ele.append(otherQuotesContainer); // Append other quotes to the main container
                }

                // Render Uber quote if available
                if (uberQuote) {
                    ele.append(quotes.createOtherRateCard("uber", uberQuote));
                }

                // Render Black Cab quote if available
                if (blackCabQuote) {
                    ele.append(quotes.createOtherRateCard("blackcab", blackCabQuote));
                }

                $("#quote-results").html(ele); // Replace the content of #quote-results with the container

                // Show the other rates banner after other rates quotes are initialized
                $(".other-rates-banner").show();
            } else {
                var ele = quotes.quoteError(results.warnings[0]);
                $("#quote-results").html(ele);
            }
            $("#quote-results").append(quotes.otherRates(results.other_rates));
            showMap();
        } else {
            $("#quote-results").html(quotes.quoteError(results.error));
        }
        quotes.quoting = false;
        console.log(results);
        // Test quoteError function
        console.log(quotes.quoteError("Error message")); // Should return HTML for error message

    },

    // Function to generate error message HTML
    "quoteError": function(msg) {
        return $("<h4 class=\"error\">" + msg + "</h4>")
    },

    // Function to create HTML for other rate cards
    "otherRates": function(other_rates) {
        var ele = $("<div id=\"other-rates\"></div>"); // Create a container for quote cards
        if (other_rates.hasOwnProperty("blackcab")) {
            ele.append(quotes.createOtherRateCard("blackcab", other_rates.blackcab));
        }
        if (other_rates.hasOwnProperty("uber")) {
            ele.append(quotes.createOtherRateCard("uber", other_rates.uber));
        }
        return ele;
    },

    // Function to create HTML for a specific other rate card
    "createOtherRateCard": function(rate, other_rates) {
        var quoteCard = $("<div id=\"otherRatesQuote-" + rate + "\" class='quote-card'></div>");

        // Add title
        var h3 = $("<h3>" + other_rates.title + "</h3><p>");
        quoteCard.append(h3);

        // Add image
        var img = $("<img class='quote-card-image'/>");
        img.attr({
            "src": other_rates.image,
            "style": "max-width: 200px; max-height: 150px;" // Set maximum width and height had to do inline
        });
        quoteCard.append(img);

        // Add price
        var price = $("<p>&pound" + other_rates.price.toFixed(2) + "</p>");
        quoteCard.append(price);

        // Add about information with maximum word limit
        var maxWords = 15; // Maximum number of words to display
        var aboutWords = other_rates.about.split(' '); // Split about text into words
        var truncatedAbout = aboutWords.slice(0, maxWords).join(' '); // Join the first maxWords words
        if (aboutWords.length > maxWords) {
            truncatedAbout += '...'; // Add ellipsis if the about text exceeds the maximum word count
        }
        var about = $("<p>" + truncatedAbout + "</p>");
        quoteCard.append(about);

        return quoteCard; // Return entire other rates quote card as jQuery object
    },

    // Function to create HTML for a quote card
    "createQuoteCard": function(idx, itm) {
        var quoteCard = $("<div id=\"quote-" + idx + "\" class='quote-card'></div>");
        if (itm.highlight) {
            var h2 = $("<h2>" + itm.highlight + "</h2><p>");
            quoteCard.append(h2);
        }

        // Add company name
        var h3 = $("<h3>" + itm.company_name + "</h3><p>");
        quoteCard.append(h3);

        // Add vehicle image
        var img = $("<img class='quote-card-image'/>");
        img.attr({
            "src": itm.vehicles[0].image,
            "style": "max-width: 200px; max-height: 150px;" // Set maximum width and height had to do inline
        });
        quoteCard.append(img);

        // Generate star rating HTML
        var ratingHTML = generateStarRating(itm.rating.score);
        var ratingContainer = $("<div class='rating-container'></div>");
        ratingContainer.html(ratingHTML);
        quoteCard.append(ratingContainer);

        // Add price
        var p = $("<p>&pound" + itm.price.toFixed(2) + "</p>");
        quoteCard.append(p);

        // Add "Book Now" button
        var p = $("<button class=\"book-now\">Book Now</button>");
        quoteCard.append(p);

        return quoteCard; // Return entire quote card as jQuery object
    },

// Function to initialize the quote module
"__init": function() {
    // Initialize form components
    Taxicode_Autocomplete.add("#pickup", "places");
    Taxicode_Autocomplete.add("#destination", "places");
    $('#time').timepicker({
        timeFormat: 'h:mm p',
        defaultTime: '11',
        interval: 5,
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });

    // Customize the datepicker appearance
    $("#date").datepicker({
        dateFormat: 'mm/dd/yy', // Set the date format
        showOtherMonths: true, // Show dates from other months
        selectOtherMonths: true, // Allow selection of dates from other months
        changeMonth: true, // Show a dropdown to change the month
        changeYear: true, // Show a dropdown to change the year
        showButtonPanel: true, // Show the button panel at the bottom
        beforeShow: function(input, inst) {
            setTimeout(function() {
                $(inst.dpDiv).addClass('custom-datepicker'); // Add custom class for styling
            }, 0);
        }
    });

    // Set default date - one day in the future dateNowPlusDays(1);
    var defaultDate = dateNowPlusDays(1);
    $("#date").val(new Number(defaultDate.getMonth() + 1) + '/' + defaultDate.getDate() + '/' + defaultDate.getFullYear());

    // Bind form submission event
    $("#biq-journey-form-submit").on("click", quotes.onSearchSubmit);

    // Bind "Book Now" button click event
    $("body").on("click", "#quote-results #quote-cards .quote-card button.book-now", quotes.onBookNowClick);
    }

};

// Initialize quote module on DOM content load
document.addEventListener("DOMContentLoaded", function(event) {
    quotes.__init();
});
