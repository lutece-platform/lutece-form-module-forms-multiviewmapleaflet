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
loadresource.setAttribute("src", "js/plugins/leaflet/leaflet/leaflet.js" );
loadresource.async = false;
document.getElementsByTagName("head")[0].appendChild(loadresource);
loadresource = document.createElement('script');
loadresource.setAttribute("type", "text/javascript");
loadresource.setAttribute("src", "js/plugins/leaflet/leaflet/leaflet.markercluster.js" );
loadresource.async = false;
document.getElementsByTagName("head")[0].appendChild(loadresource);

/* The back office is served with Cross-Origin-Embedder-Policy: require-corp, which refuses a cross-origin
   image fetched in no-cors mode unless it carries Cross-Origin-Resource-Policy. Tile servers answer CORS
   (Access-Control-Allow-Origin) but not CORP, so the tiles have to be fetched in cors mode: the crossorigin
   attribute. Leaflet 1.x takes it as the crossOrigin option; the build shipped by plugin-leaflet predates
   it and creates its <img> in _createTile, hence the fallback. */
function corsTileLayer(url, options) {
    if (typeof L.TileLayer.prototype._createTile !== 'function') {
        return new L.TileLayer(url, options);
    }
    var CorsTileLayer = L.TileLayer.extend({
        _createTile: function () {
            var tile = L.TileLayer.prototype._createTile.call(this);
            tile.crossOrigin = 'anonymous';
            return tile;
        }
    });
    return new CorsTileLayer(url, options);
}

window.addEventListener('load', function(){
    var container = document.getElementById('forms-admin-map');
    var source = document.getElementById('geojson_points');
    if ( container === null || source === null ) {
        return;
    }
    var map = L.map('forms-admin-map').setView([48.85632, 2.33272], 12);
    var points = JSON.parse(source.textContent);
    var tileUrl = container.dataset.tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    var tileAttrib = container.dataset.tileAttribution || 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    corsTileLayer(tileUrl, {minZoom: 8, maxZoom: 16, attribution: tileAttrib, crossOrigin: 'anonymous'}).addTo(map);
    var markers = L.markerClusterGroup().addTo(map);
    var features = points.features;
    for (var i = 0; i < features.length; i++) {
        if ( features[i]["geometry"]["type"] == "Point" ) {
            var coordinates = features[i]["geometry"]["coordinates"];
            var marker = L.marker([coordinates[1],coordinates[0]]);
            var properties = features[i]["properties"];
            marker.bindPopup(properties["popupContent"])
            markers.addLayer(marker);
        }
        else if ( features[i]["geometry"]["type"] == "Polygon" ) {
            markers.addLayer(L.polygon(features[i]["geometry"]["coordinates"]));
        }
        else if ( features[i]["geometry"]["type"] == "Polyline" ) {
            markers.addLayer(L.polyline(features[i]["geometry"]["coordinates"]));
        }
    }
});

/* Add local storage param to show/hide map */
document.addEventListener('DOMContentLoaded', function(){
    const map = document.getElementById('forms-admin-map');
    const toggle = document.getElementById('admin-forms-map-toggle');
    if ( map === null || toggle === null ) {
        return;
    }
    const icon = toggle.querySelector('i');
    const stored = localStorage.getItem('admin-forms-map-visibility');
    let isMapVisible = stored !== null ? ( stored === 'true' ) : true;
    const render = function(){
        map.hidden = !isMapVisible;
        if ( icon !== null ) {
            icon.classList.toggle('ti-arrows-minimize', isMapVisible);
            icon.classList.toggle('ti-arrows-maximize', !isMapVisible);
        }
    };
    render();
    toggle.addEventListener('click', function(){
        isMapVisible = !isMapVisible;
        render();
        localStorage.setItem('admin-forms-map-visibility', isMapVisible);
    });
});
