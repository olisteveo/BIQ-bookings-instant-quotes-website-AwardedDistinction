// map.js

// Define the custom styles for the map
var customMapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
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
