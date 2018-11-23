var loadresource;

loadresource = document.createElement('link');
loadresource.setAttribute("rel", "stylesheet");
loadresource.setAttribute("type", "text/css");
loadresource.setAttribute("href", "js/plugins/leaflet/leaflet/leaflet.css");
document.getElementsByTagName("head")[0].appendChild(loadresource);

loadresource = document.createElement('link');
loadresource.setAttribute("rel", "stylesheet");
loadresource.setAttribute("type", "text/css");
loadresource.setAttribute("href", "js/plugins/leaflet/leaflet/MarkerCluster.css");
document.getElementsByTagName("head")[0].appendChild(loadresource);

loadresource = document.createElement('link');
loadresource.setAttribute("rel", "stylesheet");
loadresource.setAttribute("type", "text/css");
loadresource.setAttribute("href", "js/plugins/leaflet/leaflet/MarkerCluster.Default.css");
document.getElementsByTagName("head")[0].appendChild(loadresource);

loadresource = document.createElement('script');
loadresource.setAttribute("type", "text/javascript");
loadresource.setAttribute("src",   "js/plugins/leaflet/leaflet/leaflet.js" );
loadresource.async = false;
document.getElementsByTagName("head")[0].appendChild(loadresource);

loadresource = document.createElement('script');
loadresource.setAttribute("type", "text/javascript");
loadresource.setAttribute("src",   "js/plugins/leaflet/leaflet/leaflet.markercluster.js" );
loadresource.async = false;
document.getElementsByTagName("head")[0].appendChild(loadresource);

$(window).load(function () {
    var map = L.map('map').setView([48.85632, 2.33272], 12);
    var points = JSON.parse($("#geojson_points").text());
    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16, attribution: osmAttrib}).addTo(map);
    var markers = L.markerClusterGroup().addTo(map);
    for (var i = 0; i < points.length; i++) {
        var coordinates = points[i]["geometry"]["coordinates"];
        var marker = L.marker([coordinates[1],coordinates[0]]);
        var properties = points[i]["properties"];
        marker.bindPopup(properties["popupContent"])
        markers.addLayer(marker);
    }
});
