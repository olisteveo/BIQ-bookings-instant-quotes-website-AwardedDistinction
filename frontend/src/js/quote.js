var quoting = false;

var journey = {
    "pickup" : "Vauxhall",
    "destination" : "Battersea",
    "date" : "03-09-2024 10:30:34",
    "passengers" : "2"
}

function createQuoteCard(idx, itm) {
    var quoteCard = $("<div id=\"quote-" + idx +"\" class='quote-card'></div>");

    var h3 = $("<h3>" + itm.company_name + "</h3><p>");
    quoteCard.append(h3);
    var img = $("<img class='quote-card-image'/>");
    img.attr({
        "src": itm.vehicles[0].image,
        "style": "max-width: 200px; max-height: 150px;" // Set maximum width and height had to do inline
    });
    quoteCard.append(img);
    var rating = itm.rating.score;
    if(rating) {
        var p = $("<p>Rating : " + rating + "/5</p>");
        quoteCard.append(p);
    }

    var p = $("<p>&pound" + itm.price.toFixed(2) + "</p>");
    quoteCard.append(p);
    
    var p = $("<button class=\"book-now\">Book Now</button>");
    quoteCard.append(p);
    return quoteCard; // Return entire quote card as jQuery object
}

document.addEventListener("DOMContentLoaded", function(event) {
    $("#biq-journey-form-submit").on("click", function(e) {
        e.preventDefault();
        if(quoting) { return } // show in report spam click protected
        quoting = true;
        var f = $("#biq-journey-form"),
            j = {
                "pickup": f.find("[name=pickup]").val(),
                "destination": f.find("[name=destination]").val(),
                "date": f.find("[name=date]").val() + f.find("[name=time]").val(),
                "passengers": parseInt(f.find("[name=passengers]").val())
            };
        console.log(j);
        console.log(f);
        $("#quote-results").html($("<p><p><img src='/img/loading.gif' alt='Loading...' />"));
        BIQ.getQuotes(j, function(response) {
            if (response.status == BIQ.STATUS_OK) {
                if (Object.keys(response.quotes).length) {
                    var ele = $("<div id='quote-cards'></div>"); // Create a container for quote cards
                    $.each(response.quotes, function(idx, itm) {
                        ele.append(createQuoteCard(idx, itm)); // Append each quote card to the container
                    });
                    $("#quote-results").html(ele); // Replace the content of #quote-results with the container
                } else {
                    var ele = $("<h4>" + response.warnings[0] + "</h4>");
                }
                $("#quote-results").html(ele);
                showMap();
            } else {
                $("#quote-results").html($("<h4>" + response.error + "</h4>"));
            }
            quoting = false;
            console.log(response);
        });
        return false;
    });

    $("body").on("click", "#quote-results #quote-cards .quote-card button.book-now", function(e) {
        alert(e.currentTarget);
        console.log($(e.currentTarget));
    })

    Taxicode_Autocomplete.add("#pickup", "places");
    Taxicode_Autocomplete.add("#destination", "places");
});
