
frameWidth = 600;
frameHeight = 350;

var map = new L.Map('map', {attributionControl: true}).setView([60, 10.6], 10);
map.attributionControl.setPrefix(""); // Fjerner powered by Leaflet
var hash = new L.Hash(map);

var skikart = new L.TileLayer("http://kart{s}.turkompisen.no/cgi-bin/tilecache.cgi/1.0.0/skikart/{z}/{x}/{y}.png", {
	attribution: 'Â© <a href="http://www.openstreetmap.org" target="_new">OpenStreetMap</a>-bidragsytere, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_new">CC-BY-SA</a> og <a href="http://www.skogoglandskap.no" target="_new">Skog og Landskap</a>', 
	subdomains: ["1", "2", "3", "4"],
	//scheme: "tms",
	maxZoom: 18
});

var turkart = new L.TileLayer("http://kart{s}.turkompisen.no/cgi-bin/tilecache.cgi/1.0.0/turkart/{z}/{x}/{y}.png", {
	attribution: 'Â© <a href="http://www.openstreetmap.org" target="_new">OpenStreetMap</a>-bidragsytere, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_new">CC-BY-SA</a> og <a href="http://www.skogoglandskap.no" target="_new">Skog og Landskap</a>', 
	subdomains: ["1", "2", "3", "4"],
	//scheme: "tms",
	maxZoom: 18
});
	
map.addLayer(turkart);



var marker = new L.Marker();
function panTo(minLat, maxLat, minLon, maxLon, centerLon, centerLat) {
    var southWest = new L.LatLng(minLat,minLon);
	var northEast = new L.LatLng(maxLat,maxLon);
	var bounds = new L.LatLngBounds(southWest, northEast);
	map.fitBounds(bounds);
	
	
}


function layerSkikart() {
	map.removeLayer(turkart);
	map.addLayer(skikart);
    
    hash.updateEmbedCode();
}

function layerTurkart() {
	map.removeLayer(skikart);
	map.addLayer(turkart);
    
    hash.updateEmbedCode();
}



var baseMaps = {
    "Turkart": turkart,
    "Skikart": skikart
};
//L.control.layers(baseMaps).addTo(map);


$('#mapHeight').change(function(){
    
    var val = $('#mapHeight').val();
    $('#map').height(val);
    frameHeight = val;
    hash.updateEmbedCode();
    
    //Force center after changing frame
    map.invalidateSize(true);
});

$('#mapWidth').change(function(){
    
    var val = $('#mapWidth').val();
    $('#map').width(val);
    frameWidth = val;
    hash.updateEmbedCode();
    
    //Force center after changing frame
    map.invalidateSize(true);
});

/*
map.on('baselayerchange', function(e) {
    map.fireEvent("moveend");
    console.log("sdfdsfdsf");
});

map.on('layeradd', function(e) {
    map.fireEvent("moveend");
});
*/

function searchPlace() {
    searchName($('#mapSearch').val());
}

function searchName(value) {
    
	$.getJSON('http://open.mapquestapi.com/nominatim/v1/search?format=json&limit=8&countrycodes=no&q=' + value, {/*somedata*/}, function(json_data){
        
        
        var item = json_data[0];
        var lat = item.lat;
        var lon = item.lon;
		
	    panTo(item.boundingbox[0], item.boundingbox[1], item.boundingbox[2], item.boundingbox[3], lon, lat);
        //console.log(item.boundingbox[0], item.boundingbox[1], item.boundingbox[2], item.boundingbox[3]);

	});
}
		

		
		
