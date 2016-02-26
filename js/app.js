var locations = [
    {
        name: "Eddie's Napolis Ristorante Italiano",
        lat: 33.151599,
        lng: -96.863381,
        id: "526b285311d2a71868713db1"
    },
    {
        name: "Nothing Bundt Cakes",
        lat: 33.121468,
        lng: -96.807232,
        id: "4ec2c020b8f7a3b7f969fec9"
    },
    {
        name: "Blue Goose Cantina",
        lat: 33.155768,
        lng: -96.839326,
        id: "4cc02249ee009521ee4bfd24"
    },
    {
        name: "Platia Greek Kouzina",
        lat: 33.105689,
        lng: -96.799840,
        id: "4ca23dedb0ff8cfac624ad5e"
    },
    {
        name: "la Madeleine Country French Café",
        lat: 33.094221,
        lng: -96.816266,
        id: "4b7d476bf964a52017b62fe3"
    },
    {
        name: "Tasty Garden",
        lat: 33.110295,
        lng: -96.807654,
        id: "5033d563e4b0e414aabc054a"
    },
    {
        name: "5th Street Patio Cafe",
        lat: 33.148007,
        lng: -96.824885,
        id: "4aabe50ff964a520be5a20e3"
    },
    {
        name: "Simply Thai Bistro",
        lat: 33.151302,
        lng: -96.825958,
        id: "50843c7ce4b0ec60c638d20f"
    },
    {
        name: "Palio's Pizza Cafe",
        lat: 33.108163,
        lng: -96.840685,
        id: "4c2cca332219c92897a7a648"
    },
    {
        name: "Crudo Wood Fired Bistro & Tavern",
        lat: 33.123780,
        lng: -96.824680,
        id: "508b226fe4b0c35052bcdd5c"
    }
];


// Initialize map
var map;
function initMap() {
    "use strict";
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.1314, lng: -96.8541},
        zoom: 12,
        disableDefaultUI: true,
		zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        style: google.maps.ZoomControlStyle.LARGE
      }
    });
    // ViewModel
    ko.applyBindings(new ViewModel());
}



// Alert the user if google maps isn't working
function googleError() {
	alert('Google Maps is not loading. Please try refreshing the page later.');
  //  document.getElementById('map').innerHTML = "<h2>Google Maps is not loading. Please try refreshing the page later.</h2>";
}

// Place constructor
var Place = function (data) {
    "use strict";
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.phone = ko.observable('');
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.rating = ko.observable('');
    this.url = ko.observable('');
    this.canonicalUrl = ko.observable('');
    this.photoPrefix = ko.observable('');
    this.photoSuffix = ko.observable('');
    this.contentString = ko.observable('');
};

// ViewModel
var ViewModel = function () {
    "use strict";
    var self = this;

    // Create an array of places
    this.placeList = ko.observableArray([]);

    // Call Place constructor
    locations.forEach(function (placeItem) {
        self.placeList.push(new Place(placeItem));
    });

    // Initialize the infowindow
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });

    // Initialize marker
    var marker;

    // For each place, set markers, request Foursquare data, and set event listeners for the infowindow
    self.placeList().forEach(function (placeItem) {

        // Define markers for each place
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
            map: map,
            animation: google.maps.Animation.DROP
        });
        placeItem.marker = marker;

        // Make AJAX request to Foursquare
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + placeItem.id() +           '?client_id=ENDMD30Q3KODETFWL2YUJVYLI0KU5XJ3N1QU1C01ER1H5TYK&client_secret=DODZAYTYC33JEAPRXKOEI35HBJKBBYCP140J0MJAYW0POC5L&v=20150601',
            dataType: "json",
            success: function (data) {
                // Make results easier to handle
                var result = data.response.venue;

                // placeItem.name(result.name);

                // The following lines handle inconsistent results from Foursquare
                // Check each result for properties, if the property exists,
                // add it to the Place constructor
                var contact = result.hasOwnProperty('contact') ? result.contact : '';
                if (contact.hasOwnProperty('formattedPhone')) {
                    placeItem.phone(contact.formattedPhone || '');
                }

                var location = result.hasOwnProperty('location') ? result.location : '';
                if (location.hasOwnProperty('address')) {
                    placeItem.address(location.address || '');
                }

                var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
                if (bestPhoto.hasOwnProperty('prefix')) {
                    placeItem.photoPrefix(bestPhoto.prefix || '');
                }

                if (bestPhoto.hasOwnProperty('suffix')) {
                    placeItem.photoSuffix(bestPhoto.suffix || '');
                }

                var description = result.hasOwnProperty('description') ? result.description : '';
                placeItem.description(description || '');

                var rating = result.hasOwnProperty('rating') ? result.rating : '';
                placeItem.rating(rating || 'none');

                var url = result.hasOwnProperty('url') ? result.url : '';
                placeItem.url(url || '');

                placeItem.canonicalUrl(result.canonicalUrl);

                // Content of the infowindow
                var contentString = '<div id="iWindow"><h4>' + placeItem.name() + '</h4><div id="pic"><img src="' +
                        placeItem.photoPrefix() + '110x110' + placeItem.photoSuffix() +
                        '" alt="Image Location"></div><p>' +
                        placeItem.phone() + '</p><p>' + placeItem.address() + '</p><p>' +
                        '</p><p>Rating: ' + placeItem.rating() +
                        '</p><p><a target="_blank" href=' + placeItem.url() + '>' + placeItem.url() +
                        '</a></p><p><a target="_blank" href=' + placeItem.canonicalUrl() +
                        '>Foursquare Page</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        placeItem.lat() + ',' + placeItem.lng() + '>Directions</a></p></div>';

                google.maps.event.addListener(placeItem.marker, 'click', function () {
                    infowindow.open(map, this);
                    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        placeItem.marker.setAnimation(null);
                    }, 500);
                    infowindow.setContent(contentString);
                });
            },
            // Alert the user on error. Set messages in the DOM and infowindow
            error: function (e) {
			//	shouldShowMessage: ko.observable(true);
				//infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
							var viewModel = {
    			shouldShowMessage: true
   				 };
				ko.applyBindings(viewModel);
           		}

        });

        // This event listener makes the error message on AJAX error display in the infowindow
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
            placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                placeItem.marker.setAnimation(null);
            }, 500);
        });
    });

    // Activate the appropriate marker when the user clicks a list item
    self.showInfo = function (placeItem) {
        google.maps.event.trigger(placeItem.marker, 'click');
        self.hideElements();
    };

    self.toggleNav = ko.observable(false);
    this.navStatus = ko.pureComputed (function () {
        return self.toggleNav() === false ? 'nav' : 'navClosed';
        }, this);

    self.hideElements = function (toggleNav) {
        self.toggleNav(true);
        return true;
    };

    self.showElements = function (toggleNav) {
        self.toggleNav(false);
        return true;
    };

    // Filter markers per user input

    // Array containing only the markers based on search
    self.visible = ko.observableArray();

    // All markers are visible by default before any user input
    self.placeList().forEach(function (place) {
        self.visible.push(place);
    });

    // Track user input
    self.userInput = ko.observable('');

    // If user input is included in the place name, make it and its marker visible
    // Otherwise, remove the place & marker
    self.filterMarkers = function () {
        // Set all markers and places to not visible.
        var searchInput = self.userInput().toLowerCase();
        self.visible.removeAll();
        self.placeList().forEach(function (place) {
            place.marker.setVisible(false);
            // Compare the name of each place to user input
            // If user input is included in the name, set the place and marker as visible
            if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
                self.visible.push(place);
            }
        });
        self.visible().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };

}; // ViewModel
