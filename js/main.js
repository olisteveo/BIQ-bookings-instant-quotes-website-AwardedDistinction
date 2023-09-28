



var journey = {
    "pickup" : "York",
    "destination" : "York Station",
    "date" : "03-09-2024 10:30:34",
    "passengers" : "2"
}

function quoteCard(quote_id, quote_data) {
    return "<div id=\"quote-" + quote_id + "\"><h3>" + quote_id + ": - " + quote_data.company_name + " &pound;" + parseFloat(quote_data.vehicles[0].price).toFixed(2) + "</h3></div>"
}

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
    $("#biq-journey-form-submit").on("click", function(e){
        e.preventDefault();
        var f = $("#biq-journey-form"),
            j = {
                "pickup" : f.find("[name=pickup]").val(),
                "destination" : f.find("[name=destination]").val(),
                "date" : f.find("[name=date]").val() + f.find("[name=time]").val(),
                "passengers" : parseInt(f.find("[name=passengers]").val())
            };
            console.log(j)
            console.log(f)
        BIQ.getQuotes(j, function(response){
            if(response.status == BIQ.STATUS_OK) {
                if (Object.keys(response.quotes).length) {

                    var ele = $("<div></div>")
                    $.each(response.quotes, function(idx, itm) {
                        console.log(itm)
                        ele.append(quoteCard(idx, itm))
        
                    })
                } else {
                    var ele = $("<h4>" + response.warnings[0] + "</h4>")
                }
                $("#quote-results").html(ele)
            } else {
                $("#quote-results").html($("<h4>" + response.error + "</h4>"))
            }
            console.log(response)
        })
        return false
    });
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

    $("#cancel-login").on("click", function(e){
        e.preventDefault();
        hideLogin();
    })
    });
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