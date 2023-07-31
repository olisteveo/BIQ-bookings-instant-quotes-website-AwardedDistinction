



var journey = {
    "pickup" : "York",
    "vias" : "",
    "destination" : "York Station",
    "date" : "03-09-2024 10:30:34",
    "passengers" : "2"
}






console.log("event")





document.addEventListener("DOMContentLoaded", function(event) {
    console.log("event loaded")
    console.log(getQuotes(journey, function(response){
        console.log(response)
    }))

})