<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traverang</title>
    <link href="/css/style.css" rel="stylesheet">
    <link href="/css/login.css" rel="stylesheet">
    <link href="/css/quotes.css" rel="stylesheet">
    <link href="/css/map.css" rel="stylesheet">
    <link href="/img/icon.png" rel="shortcut icon">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script src="https://api.taxicode.com/jswrapper/"></script>
    <script src="/js/main.js" defer></script>
    <script src="/js/biq_api.js" defer></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="checkout.js"></script>
</head>
<body>
    <div id="header">
        <div id="logo">
            <img src="img/logo2.png" alt="Logo">
            <a id="top"></a>
        </div>
        <div id="login-button-container" style="display:none">
            <button id="show-login-form">&#128100;</button>
            <div class="tooltip">Login</div>
        </div>
        <div id="logout-button-container" style="display:none">
            <button id="logout">Logout</button>
        </div>
    </div>
    <section class="quote-form">
        <form id="biq-journey-form">
            <div class="form-row">
                <label for="pickup">Pickup</label>
                <input type="text" id="pickup" name="pickup" value="Vauxhall">
            </div>
            <div class="form-row">
                <label for="destination">Destination</label>
                <input type="destination" id="destination" name="destination" value="Battersea">
            </div>
            <div class="form-row">
                <label for="date">Date</label>
                <input type="text" id="date" name="date" value="">
            </div>
            <div class="form-row">
                <label for="time">Time</label>
                <input type="text" id="time" name="time" value="">
            </div>
            <div class="form-row">
                <label for="passengers">Passengers</label>
                <input type="passengers" id="passengers" name="passengers" value="3">
            </div>
            <button id="biq-journey-form-submit">Get Quotes</button>
        </form>
    </section>
    <div id="map-container">
        <div id="map"></div>
    </div>
    <div id="quote-results"></div>
    <div id="back-to-top">
        <a href="#top">Back to Top &#11014;</a>
    </div>
    <script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
    <dialog id="login-form-dialog">
        <div id="login-form-container">
            <form id="login-form">
                <label for="login">Email</label><br/>
                <input type="text" id="login" name="login"><br/>
                <label for="password">Password</label><br/>
                <input type="password" id="password" name="password"><br/>
                <button id="login-form-submit">Login</button>
                <button id="cancel-login">Cancel</button>
            </form>
        </div>
    </dialog>
    <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtu2IRw-I9aVFGAUmI8D6B_Vu7vxMTswo&libraries=places&callback=initializeMap"></script>
</body>
</html>