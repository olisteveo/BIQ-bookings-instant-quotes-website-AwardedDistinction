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