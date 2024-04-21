/**
 * BIQ (Bookings Instant Quotes) - Module for handling API requests related to quotes and user authentication.
 * @namespace BIQ
 */
var BIQ = {
    /**
     * Status constant for successful response.
     * @constant {string}
     */
    STATUS_OK: "OK",

    /**
     * Status constant for error response.
     * @constant {string}
     */
    STATUS_ERROR: "ERROR",

    /**
     * Base URL for the API host.
     * @type {string}
     */
    api_host: "https://api.taxicode.com/",

    /**
     * Authentication key for accessing the API.
     * @type {string}
     */
    key: "FmxHJkqDsBcUQavP",

    /**
     * Function to request quotes from the API.
     * @param {Object} data - Data object containing quote search parameters.
     * @param {Function} success - Success callback function to handle API response.
     */
    getQuotes: function(data, success) {
        var url = BIQ.api_host + "booking/quote/";
        $.ajax({
            type: "POST",
            url: url,
            data: { ...data, key: BIQ.key, other_rates: "blackcab,uber" },
            success: success,
            dataType: "json"
        });
    },

    /**
     * Function to perform user login via API.
     * @param {Object} data - Data object containing user login credentials.
     * @param {Function} success - Success callback function to handle API response.
     */
    login: function(data, success) {
        var url = BIQ.api_host + "user/login/";
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: success,
            dataType: "json"
        });
    },

    /**
     * Function to perform user logout via API.
     * @param {Function} success - Success callback function to handle API response.
     */
    logout: function(success) {
        var url = BIQ.api_host + "user/logout/";
        $.ajax({
            type: "GET",
            url: url,
            success: success,
            dataType: "json"
        });
    }
};
