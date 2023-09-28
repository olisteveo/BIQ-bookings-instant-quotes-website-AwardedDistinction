



var journey = {
    "pickup" : "York",
    "destination" : "York Station",
    "date" : "03-09-2024 10:30:34",
    "passengers" : "2"
}

function quoteCard(quote_id, quote_data) {
    return "<div id=\"quote-" + quote_id + "\"><h3>" + quote_id + ": - " + quote_data.company_name + " &pound;" + parseFloat(quote_data.vehicles[0].price).toFixed(2) + "</h3></div>"
}


document.addEventListener("DOMContentLoaded", function(event) {
    console.log("event loaded")
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
        e.preventDefault()
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
    })
})