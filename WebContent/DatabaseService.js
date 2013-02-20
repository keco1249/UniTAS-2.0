function DatabaseService(layout,mapPane){
	this.layout = layout;
	this.mapPane = mapPane;
	//this one is for searching
	this.places_service = new google.maps.places.PlacesService(this.mapPane.map);
	//this one is temporary
	this.pretend_database = [];


	this.addPlace = function(place){
		var str = "Pretending to store a place that looks like: \n";
		for(key in place){
			str+= (key+" : "+place[key]+"\n");
		}
		alert(str);
	};
}

DatabaseService.prototype.nearbySearch = function(searchString, callback){
	this.places_service.nearbySearch({
		location: this.mapPane.map.getCenter(),
		radius: 2000,
		keyword: searchString
	},
		function (results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var places = [];			
				$.each(results,function(index, result){
					var newPlace = new Place({
						name : result.name,
						address : result.vicinity,
						location : result.geometry.location,
						icon : result.icon,
						id : result.id,
						reference : result.reference,
						types : result.types,
						events : result.events
					});
					places.push(newPlace);
				});

				callback(places,status);
				
			}else{
			
				callback([],status);
		
			}
		}
	);
};