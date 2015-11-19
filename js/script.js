    L.mapbox.accessToken = 'pk.eyJ1Ijoicm1iYXJsZXkiLCJhIjoiY2lmaDVyeWlxYXZqdnJ4a25lMXd0Y205OSJ9.HpeUER_l8KN0T8OyMAcKIA';
    var geojson = [
        {
          "type": "FeatureCollection",
          "features": [
            {
             "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -77.5940059,
                  43.077969
                ]
              },
            "properties": {
              "name": "School of the Holy Childhood",
              "phoneFormatted": "(585) 359-3710",
              "phone": "5853593710",
              "address": "100 Groton PKWY",
              "city": "Rochester",
              "country": "United States",
              "postalCode": "14623",
              "state": "NY",
              "url": "http://holychildhood.org",
              "icon": 'icons/daycare.png',
              "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus est, consectetur in tincidunt nec, viverra non orci. Proin euismod, lectus vel placerat pharetra, nibh erat elementum arcu, quis sodales enim massa sed lectus. Aenean vitae fermentum felis, ac maximus nisl. Cras mauris urna, convallis sodales rhoncus non, venenatis non ligula. Nunc faucibus tempus tempus. Maecenas sagittis turpis eu elit pretium ultrices. Nulla non velit tincidunt, tempor arcu vel, tempus massa. Praesent laoreet ante nibh, vel tempus felis venenatis a. Pellentesque at ipsum ut neque tempus auctor."
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -77.641304,
                  43.17958
                ]
              },
             "properties": {
                "name": "Mary's Place Outreach",
                "phoneFormatted": " (585) 270-8626",
                "phone": "5852708826",
                "address": "Bldg. A 414 Lexington Ave",
                "city": "Rochester",
                "country": "United States",
                "postalCode": "14613",
                "state": "NY",
                "url": "http://marysplaceoutreach.org/",
                "icon": 'icons/world.png',
                "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus est, consectetur in tincidunt nec, viverra non orci. Proin euismod, lectus vel placerat pharetra, nibh erat elementum arcu, quis sodales enim massa sed lectus. Aenean vitae fermentum felis, ac maximus nisl. Cras mauris urna, convallis sodales rhoncus non, venenatis non ligula. Nunc faucibus tempus tempus. Maecenas sagittis turpis eu elit pretium ultrices. Nulla non velit tincidunt, tempor arcu vel, tempus massa. Praesent laoreet ante nibh, vel tempus felis venenatis a. Pellentesque at ipsum ut neque tempus auctor."
              }
            }
          ]
        }
    ];
    var map = L.mapbox.map('map', 'examples.map-i80bb8p3')
    .setView([43.1656, -77.6114], 12);
    
    L.control.locate({ keepCurrentZoomLevel: true }).addTo(map);

    var services = document.getElementById('services');
    var locations = L.mapbox.featureLayer().addTo(map);

    locations.setGeoJSON(geojson);

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

      link.onclick = function() {
        setActive(service);

        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
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

      popup.setContent('<h2>' + prop.name + '</h2><div id="blurb">' + prop.info + '</div>') ;
      locale.bindPopup(popup);

      locale.setIcon(L.icon({
        iconUrl: prop.icon,
        iconSize: [32, 37],
        iconAnchor: [28, 28],
        popupAnchor: [0, -34]
      }));
    });