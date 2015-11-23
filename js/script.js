L.mapbox.accessToken = 'pk.eyJ1Ijoicm1iYXJsZXkiLCJhIjoiY2lmaDVyeWlxYXZqdnJ4a25lMXd0Y205OSJ9.HpeUER_l8KN0T8OyMAcKIA';

var map = L.mapbox.map('map', 'mapbox.streets', {
  zoomControl: false
}).setView([43.1656, -77.6114], 12);

// Add search bar to map
var geocoderControl = L.mapbox.geocoderControl("mapbox.places", {
  position: 'topleft',
  autocomplete: true,
  keepOpen: false
}).addTo(map);

// Change placeholder text
document.querySelector('.leaflet-control-mapbox-geocoder-form input').placeholder = "Search for Location";

// Close autocomplete box when search is finished
geocoderControl.on('select', function() {
  geocoderControl._toggle();
});

// Store User's search location and add a marker for their location
geocoderControl.on('select', function(res) {
  var coord = res.feature.geometry.coordinates;
  L.mapbox.featureLayer({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: coord
    },
    properties: {
      title: "Home",
      "marker-size": "large",
      "marker-color": "#F00",
      "marker-symbol": "building"
    }
  }).addTo(map);
});

// Find user's location.
L.control.locate({
  keepCurrentZoomLevel: true
}).addTo(map);

//Move Zoom Control away from other Controls
new L.Control.Zoom({
  position: 'topright'
}).addTo(map);

var services = document.getElementById('services');
var locations = L.mapbox.featureLayer().addTo(map);
locations.loadURL('data.geojson');

// Set active marker
function setActive(el) {
  var siblings = services.getElementsByTagName('div');
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].className = siblings[i].className
      .replace(/active/, '').replace(/\s\s*$/, '');
  }
  el.className += ' active';
}

locations.on("ready", function() {
  locations.eachLayer(function(locale) {
    var prop = locale.feature.properties;

    // Each marker on the map.
    var popup = L.popup({
      maxWidth: 650
    });

    // Build sidebar

    // Plan on refactoring sidebar.
    // Goal is to make a flat accordion-style sidebar with categories/icons as   // headings. Want to only show markers with associated categories.

    var service = services.appendChild(document.createElement('div'));
    service.className = 'item';

    var link = service.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';

    link.innerHTML = prop.name + '<br />' + prop.address;

    var details = service.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }
    if (prop.hours) {
      details.innerHTML += '<br>' + prop.hours;
    }
    if (prop.url) {
      details.innerHTML += '<br /><a href="' + prop.url + '">' + prop.url + '</a>';
    }

    // When a sidebar item is clicked, animate the map to center
    // its associated locale and open its popup.
    link.onclick = function() {
      setActive(service);
      map.setView(locale.getLatLng(), 13);
      locale.openPopup();
      return false;
    };

    // Marker interaction
    locale.on('click', function(e) {
      // 1. center the map on the selected marker.
      map.panTo(locale.getLatLng());

      // 2. Set active the markers associated listing.
      setActive(service);
    });

    // Build popup tooltip
    popup.setContent('<h2>' + prop.name + '</h2><div id="blurb">' + prop.info + '</div>' + '<div id="hours">Hours: ' + prop.hours + '</div>');
    locale.bindPopup(popup);

    locale.setIcon(L.icon({
      iconUrl: prop.icon,
      iconSize: [32, 37],
      iconAnchor: [28, 28],
      popupAnchor: [0, -34]
    }));
  });
});
