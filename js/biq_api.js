var BIQ = {
    STATUS_OK : "OK",
    STATUS_ERROR : "ERROR",
    "api_host" : "https://api.taxicode.com/",

    "getQuotes" : function(data, success) {
        var url = BIQ.api_host + "booking/quote/"
        $.ajax({
            type: "GET",
            url: url,
            data: data,
            success: success,
            dataType: "json"
          });
    }
}
