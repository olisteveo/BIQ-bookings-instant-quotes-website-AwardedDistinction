

// Initialize the map when quotes are loaded
function initializeMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.5074, lng: 0.1272 },
        zoom: 8
    });
}
function dateNowPlusDays(d) {
    var n = new Date(),
        nd = new Date(n.setDate(n.getDate() + d));
    return nd;
}

function showMap() {
    $("#map-container").show();
    initializeMap();
}

function hideLogout() {
    $("#logout-button-container").hide();
}

function hideLoginButton() {
    $("#login-button-container").hide();
}

function hideLogin() {
    document.querySelector("#login-form-dialog").close();
    user.showLogin();
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("event loaded");
    
    $("#show-login-form").on("click", user.onUserLoginClick);
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
                user.userLoggedIn(response.user.auth_token);
                hideLogin();
                user.showLogout();
                alert("refresh to get rid");
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
            user.showLogin();
        })

    });
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
})