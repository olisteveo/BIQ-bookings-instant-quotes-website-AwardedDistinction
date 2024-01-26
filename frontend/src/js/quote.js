const quotes = {

    "quoting"   : false,

    "onBookNowClick"    : function(e) {
        alert(e.currentTarget);
        console.log($(e.currentTarget));
    },

    "isQuoting" : function() {
        return this.quoting;
    },

    "onSearchSubmit"    : function(e) {
        e.preventDefault();
        if(quotes.isQuoting()) { return } // show in report spam click protected
        quotes.quoting = true;
        var f = $("#biq-journey-form"),
            j = {
                "pickup": f.find("[name=pickup]").val(),
                "destination": f.find("[name=destination]").val(),
                "date": f.find("[name=date]").val() + f.find("[name=time]").val(),
                "passengers": parseInt(f.find("[name=passengers]").val())
            };
        console.log(j);
        console.log(f);
        $("#quote-results").html($("<p><img src='/img/loading.gif' alt='Loading...' /></p>"));
        BIQ.getQuotes(j, quotes.renderResults);
    },

    "renderResults" : function(results) {
        if (results.status == BIQ.STATUS_OK) {
            if (Object.keys(results.quotes).length) {
                var ele = $("<div id='quote-cards'></div>"); // Create a container for quote cards
                $.each(results.quotes, function(idx, itm) {
                    ele.append(quotes.createQuoteCard(idx, itm)); // Append each quote card to the container
                });
                $("#quote-results").html(ele); // Replace the content of #quote-results with the container
            } else {
                var ele = quotes.quoteError(results.warnings[0]);
            }
            $("#quote-results").html(ele);
            showMap();
        } else {
            $("#quote-results").html(quotes.quoteError(results.error));
        }
        quotes.quoting = false;
        console.log(results);
    },

    "quoteError" : function(msg) {
        return $("<h4 class=\"error\">" + msg + "</h4>")
    },

    "createQuoteCard"   : function(idx, itm) {
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
    },

    "__init"    : function() {    
        Taxicode_Autocomplete.add("#pickup", "places");
        Taxicode_Autocomplete.add("#destination", "places");    
        $( "#date" ).datepicker();
        $('#time').timepicker({
            timeFormat: 'h:mm p',
            defaultTime: '11',
            interval: 5,
            dynamic: true,
            dropdown: true,
            scrollbar: true
        });
        // Getter
        var defaultDate = dateNowPlusDays(3);
       $("#date").val( new Number(defaultDate.getMonth() +1) + '/' + defaultDate.getDate() + '/' + defaultDate.getFullYear());
       $("#biq-journey-form-submit").on("click", quotes.onSearchSubmit);

       $("body").on("click", "#quote-results #quote-cards .quote-card button.book-now", quotes.onBookNowClick);
    }
};
