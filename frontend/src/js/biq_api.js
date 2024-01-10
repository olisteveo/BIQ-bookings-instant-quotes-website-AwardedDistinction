var BIQ = {
    STATUS_OK : "OK",
    STATUS_ERROR : "ERROR",
    "api_host" : "https://api.taxicode.com/",
    "key" : "FmxHJkqDsBcUQavP",

    "getQuotes" : function(data, success) {
        var url = BIQ.api_host + "booking/quote/"
        $.ajax({
            type: "POST",
            url: url,
            data: { ...data, key : BIQ.key },
            success: success,
            dataType: "json"
          });
    },
    "login" : function(data, success) {
        var url = BIQ.api_host + "user/login/";
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: success,
            dataType: "json"
          });
    },
    "logout" : function(success) {
        var url = BIQ.api_host + "user/logout/";
        $.ajax({
            type: "GET",
            url: url,
            success: success,
            dataType: "json"
        });
    }
}
