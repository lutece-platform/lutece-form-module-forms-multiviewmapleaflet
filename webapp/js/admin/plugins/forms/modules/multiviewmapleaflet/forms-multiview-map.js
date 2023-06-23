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

$(window).on('load', function(){
    var map = L.map('forms-admin-map').setView([48.85632, 2.33272], 12);
    var points = JSON.parse($("#geojson_points").text());
    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16, attribution: osmAttrib}).addTo(map);
    var markers = L.markerClusterGroup().addTo(map);
    var features= points.features;
    for (var i = 0; i < features.length; i++) {
		if ( features[i]["geometry"]["type"] == "Point" ) {
	        var coordinates = features[i]["geometry"]["coordinates"];
	        var marker = L.marker([coordinates[1],coordinates[0]]);
	        var properties = features[i]["properties"];
	        marker.bindPopup(properties["popupContent"])
	        markers.addLayer(marker);
        }
        else if ( features[i]["geometry"]["type"] == "Polygon" ) {
	        var coordinates = features[i]["geometry"]["coordinates"];
	        var polygon = L.polygon(coordinates );
	    	markers.addLayer(polygon);
        }
        else if ( features[i]["geometry"]["type"] == "Polyline" ) {
	        var coordinates = features[i]["geometry"]["coordinates"];
	        var polyline = L.polyline(coordinates );
	    	markers.addLayer(polyline);
        }
        
    }
});

/* Add local storage param to show/hide map */
$( function(){
    const map = '#forms-admin-map', btnMap = '#forms-admin-map + button';
    let mapVisibity = localStorage.getItem( 'admin-forms-map-visibility' );
    let isMapVisible = mapVisibity != null ? ( mapVisibity === 'true' ) : true;
    if( !isMapVisible ){
        $( map ).toggle();
        $( btnMap ).children().toggleClass('fa-expand');
    }
    $( '#admin-forms-map-toggle' ).on( 'click', function(){
        $( map ).toggle();
        $( btnMap ).children().toggleClass('fa-expand');
        localStorage.setItem( 'admin-forms-map-visibility' , !isMapVisible )
    });
})