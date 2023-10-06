
var quoting = false;

var journey = {
    "pickup" : "Vauxhall",
    "destination" : "Battersea",
    "date" : "03-09-2024 10:30:34",
    "passengers" : "2"
}
function dateNowPlusDays(d) {
    var n = new Date(),
        nd = new Date(n.setDate(n.getDate() + d));
    return nd;
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

// Back to top button
$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 400) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top a').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});

function showLogout() {
    $("#logout-button-container").show();
}

function hideLogout() {
    $("#logout-button-container").hide();
}

function showLogin() {
    $("#login-button-container").show();
}

function hideLoginButton() {
    $("#login-button-container").hide();
}

function hideLogin() {
    $("#login-form-container").hide();
    showLogin();
}

function userLoggedIn(tc_user_auth){
    showLogout();
    $("#login-button-container").hide();
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("event loaded");
    token = Cookie.get('tc_user_auth');
    console.log(token);
    if (token) {
        userLoggedIn(token);
    } else {
        showLogin();
    }
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
            } else {
                $("#quote-results").html($("<h4>" + response.error + "</h4>"));
            }
            quoting = false;
            console.log(response);
        });
        return false;
    });
    
    $("body").on("click", "#quote-results #quote-cards .quote-card button.book-now", function(e) {
        console.log("yfufgu");
        alert(e.currentTarget);
        console.log($(e.currentTarget));
    })
    
    $("#show-login-form").on("click", function(e) {
        $("#login-form-container").show();
        hideLoginButton();
    });
    $("#login-form-submit").on("click", function(e){
        e.preventDefault()
        var f = $("#login-form");
        BIQ.login({
            "email" : f.find("[name='login']").val(),
            "password" : f.find("[name='password']").val()
        }, function(response) {
            console.log(response);
            if(response.status == BIQ.STATUS_OK) {
                Cookie.set("tc_user_auth", response.user.auth_token, 30);
                userLoggedIn(response.user.auth_token);
                hideLogin();
                showLogout();
            } else {
                alert("Unable to Login")
            }
        });
    });
    // cancel login
    $("#cancel-login").on("click", function(e){
        e.preventDefault();
        hideLogin();
    });
    // logout
    $("#logout").on("click", function(e){
        e.preventDefault()
        BIQ.logout(function(response) {
            console.log(response);
            Cookie.remove("tc_user_auth");
            hideLogout();
            showLogin();
        })

    });
})