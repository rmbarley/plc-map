L.mapbox.accessToken = 'pk.eyJ1Ijoicm1iYXJsZXkiLCJhIjoiY2lmaDVyeWlxYXZqdnJ4a25lMXd0Y205OSJ9.HpeUER_l8KN0T8OyMAcKIA';

var map = L.mapbox.map('map', 'examples.map-i80bb8p3')
.setView([43.1656, -77.6114], 12);

L.control.locate({ keepCurrentZoomLevel: true }).addTo(map);

var services = document.getElementById('services');
var locations = L.mapbox.featureLayer().addTo(map);

var geojson = L.mapbox.featureLayer().loadURL("data.geojson").addTo(map);
//locaitons.setGeoJSON(geojson);

// Set active marker
function setActive(el) {
  var siblings = services.getElementsByTagName('div');
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].className = siblings[i].className
    .replace(/active/, '').replace(/\s\s*$/, '');
  }

  el.className += ' active';
}

locations.eachLayer(function(locale) {

  var prop = locale.feature.properties;

  // Each marker on the map.
  var popup = L.popup({
    maxWidth: 650
  });

  // Build sidebar
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
  popup.setContent('<h2>' + prop.name + '</h2><div id="blurb">' + prop.info + '</div>') ;
  locale.bindPopup(popup);

  locale.setIcon(L.icon({
    iconUrl: prop.icon,
    iconSize: [32, 37],
    iconAnchor: [28, 28],
    popupAnchor: [0, -34]
  }));
});