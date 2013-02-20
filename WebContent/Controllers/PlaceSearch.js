function searchService(opts) {

}

function nearbySearch(searchString, callback, opts) {
	this.places_service.nearbySearch({
		location : this.mapPane.map.getCenter(),
		radius : 2000,
		keyword : searchString
	}, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var places = [];
			$.each(results, function(index, result) {
				var newPlace = {
					name : result.name,
					address : result.formatted_address,
					location : result.geometry.location,
					icon : result.icon,
					id : result.id,
					reference : result.reference,
					types : result.types
				};
				places.push(newPlace);
			});

			callback(places, status);

		} else {

			callback([], status);

		}
	});

	results = searchService(opts);
	refreshResults(results);
}

function textSearch(opts) {
	opts.URL = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query='
			+ opts
			+ '&sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0';
	results = searchService(opts);
	refreshResults(results);
}

function refreshResults(results) {
	// Update Map
	// Update List
	// GUIDriver.Refresh
}