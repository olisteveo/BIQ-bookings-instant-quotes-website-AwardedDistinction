// map.js

// Define the custom styles for the map
var customMapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5" // Color for map geometry elements
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off" // Hide icon labels
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161" // Text color
            }
        ]
    },
    // Add more custom styles as needed
];

// Create a new StyledMapType object, passing the custom styles array
var customMapType = new google.maps.StyledMapType(customMapStyles, { name: 'Custom Style' });

// Apply the custom map type to the map
map.mapTypes.set('custom_style', customMapType);
map.setMapTypeId('custom_style');

// Function to initialise the map
function initializeMap() {
    const mapOptions = {
        center: { lat: 51.5074, lng: -0.1278 }, // London coordinates as an example
        zoom: 12, // Initial zoom level
        scrollwheel: false, // Disable scroll wheel zooming
        gestureHandling: "auto", // Enable touchpad gestures
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#cccce6" // Background color
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#000000" // Text color
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff" // Text outline color
                    },
                    {
                        "visibility": "on" // Show text outline
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2A2C7B" // Water color
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b3b3d9" // Grass/greenland color
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff" // Road color
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#d9d9d9" // Motorway color
                    }
                ]
            },
            {
                "featureType": "road.text",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ff3333" // Road name color
                    }
                ]
            },
            {
                "featureType": "road.text",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff" // Road name outline color
                    },
                    {
                        "weight": 2 // Road name outline weight
                    }
                ]
            },
            // Add styles for parks
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#e6e6f2" // Park color
                    }
                ]
            },
            // Add styles for buildings
            {
                "featureType": "poi.business",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#BDBDBD" // Building color
                    }
                ]
            }
        ],
        mapTypeControl: false, // Hide map/satellite button
        fullscreenControl: false, // Hide fullscreen button
        zoomControl: false, // Hide zoom control
        streetViewControl: false // Hide Street View control
    };

    // Return a new google maps object with the specified options
    return new google.maps.Map(document.getElementById('map'), mapOptions);
}
