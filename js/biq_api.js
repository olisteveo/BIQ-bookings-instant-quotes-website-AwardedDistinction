
var api_host = "https://api.taxicode.com/";


function getQuotes(data, success){
    var url = api_host + "booking/quote/"
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: success,
        dataType: "json"
      });
}
