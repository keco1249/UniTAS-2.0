
var layout; // all the "global" type stuff should at least be contained in a big layout class (until we come up with a good design)

//Class definitions:
//TODO: Methods should go on the prototypes

function MapLayout(){
	this.searchBarOption = new SearchBarOption(this);
	this.searchBar = new SearchBar(this,"input#nearbySearchBar","input#nearbySearchButton");
	this.searchBar2 = new SearchBar(this, "input#locationSearchBar","input#locationSearchButton");
	this.sideBar = new SideBar(this,"resultlist");
	this.mapPane = new MapPane(this, new google.maps.LatLng(40.00651985589961, -105.2630627155304), 16, "map_canvas");
	this.databaseService = new DatabaseService(this,this.mapPane);
	//this.viewBar = new viewBar(this);
	
	
	this.showPlaces = function(places){
		layout.sideBar.showPlaces(places);
		layout.mapPane.showPlaceMarkers(places);
		if(places.length > 0){
			layout.mapPane.showPlaceInfo(places[0]);
		}
		
	};
}

function viewBar(layout){
	
	//this.selectBox = selectBox;
	//$(#search_container).hide();
	
	this.layout = layout;
	var me = this;
	$("#search_button_div").hide();
	//me.hideSearch();
	
	this.hideSearch = function(){
				//$("#search_button_div").hide();
			return;
	};
}

function SearchBarOption(layout){
	this.layout = layout;
	$("#filter_div").hide();
	$(".tab_content").hide();
	$(".tab_content:first").show(); 

	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel"); 
		$("#"+activeTab).fadeIn(); 
	});
	$("#location").click(function(){
		
		$("#filter_div").fadeIn();
	})
	$("#nearby").click(function(){
		$("#filter_div").fadeOut();
	})
}

function SearchBar(layout,fieldId,buttonId){
	this.layout = layout;
	this.fieldId = fieldId;
	this.buttonId = buttonId;
	
	var me = this;
	
	this.doSearch = function(){
		this.layout.databaseService.nearbySearch(
				$(me.fieldId).val(),
				function(places, status){
					me.layout.showPlaces(places);
					
			});
	};
	
	$(buttonId).click(function(){
		me.doSearch();
	});
	
	$(fieldId).keypress(function(e){
		if(e.which == 13){
			me.doSearch();
			return false; //this "absorbs" the keypress and prevents it from being sent down to other listeners or the default action
		}
	});
}

function MapPane(layout, location, zoom, DIVid){
	this.layout = layout;
	this.DIVid = DIVid;
	this.infoWindow = null;
	this.mapOptions = {
		center : location,
		zoom :zoom,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	
	this.markers = [];
	// this.markerListeners = [];
	this.map = new google.maps.Map(document.getElementById(this.DIVid), this.mapOptions);

	this.openInfo = function(latLng,content){
		if(this.infoWindow){
			this.infoWindow.close();
		}
		
		this.infoWindow = new google.maps.InfoWindow({
			content: content,
			position: latLng
		});
		
		this.infoWindow.open(this.map);
		
	};
	
	this.showPlaceInfo = function(place){
		var summary = new PlaceSummary(this.layout,place);
		var latLng = place.location;
		this.openInfo(latLng,summary.generateHTML());
	};
	
	this.clearMarkers = function(){
		var me = this;

		$.each(me.markers,function(index,oldMarker){
			oldMarker.setMap(null);
		});
		// $.each(me.markerListeners,function(index,oldListner){
			// google.maps.event.removeListener(oldListener);
		// });
		me.markers = [];
		// me.markerListeners = [];
	};
	
	this.showPlaceMarkers = function(places){
		var me = this;
		
		me.clearMarkers();
		
		$.each(places,function(index,place){
			var newMarker = new google.maps.Marker({
				position : place.location,
				clickable : true,
				draggable : false,
				map : me.map
			});
			
			// me.markerListeners.push(
			google.maps.event.addListener(newMarker, 'click', function(){
				me.showPlaceInfo(place);
			});

			me.markers.push(newMarker);
			
		});
	};

	// google.maps.event.addListener(this.map,"rightclick",function(mouseEvent){
		// // add_place(mouseEvent.latLng,"Test Location 9","store");
	// });


};
	
function Place(opts){
	this.location = null;
	this.name = null;
	this.description = '';
	this.types = [];
	this.events = [];
	this.id = null;
	
	// this.marker = null;
	// this.placeForm = null; //TODO: Eliminate this direction of reference?
	// this.summary = null; //TODO: Eliminate this direction of reference?
	
	for(key in opts){
		if(opts[key]!=undefined){
			this[key]=opts[key];
		}
	}
	
}

function Event(place, opts){
	this.place = place;
	this.name = 'New Event';
	this.address = place.address;
	this.description = '';
	this.types = [];
	this.members = [];
	this.organizer = '';
	
	for(key in opts){
		this[key]=opts[key];
	}
}

function EventForm(layout, eventData){
	this.layout = layout;
	this.eventData = eventData;
	
	this.generateHTML = function(){
		var me = this;
		
		var fields = {
			"name" : $("<input>").attr("type","text").attr("class","event_form_input").attr("value",eventData.name),
			"description" : $("<input>").attr("type","text").attr("class","event_form_input").attr("value",eventData.description),
			"organizer" : $("<input>").attr("type","text").attr("class","event_form_input").attr("value",eventData.organizer)
		};
		
		var labels = {
			"name" : "Name:",
			"description" : "Description:",
			"organizer" : "Contact:"
		};
		
		var jq = $("<div>").attr("class","event_form_div");
		jq.append(
			$("<p>").attr("class","event_form_name").append(eventData.name)
		);
		
		$.each(fields,function(property, input){
			var thing = $("<p>").attr("class","event_form_field").append(
				$("<p>").attr("class","event_form_field_label").append(labels[property]),
				input
			);
			jq.append(thing);
		});
		
		jq.append(
			$("<p>").attr("class","event_button_row").append(
				$("<a>").attr("class","event_cancel_button").attr("href","#").append("").data("eventData",me.eventData).click(function(){
					var eventData = $(this).data("eventData");
					var summary = new PlaceSummary(me.layout, eventData.place);
					me.layout.mapPane.openInfo(eventData.place.location,summary.generateHTML());
				}),
				$("<a>").attr("class","event_okay_button").attr("href","#").append("").data("eventData",me.eventData).click(function(){
					var eventData = $(this).data("eventData");
					$.each(fields,function(property, input){
						eventData[property] = input.val();
					});
					if(eventData.place.events.indexOf(eventData)==-1){
						eventData.place.events.push(eventData);
					}
					var summary = new PlaceSummary(me.layout,eventData.place);
					var contents = summary.generateHTML();
					me.layout.mapPane.openInfo(eventData.place.location,contents);
					me.layout.sideBar.generateHTML();
				})
			)
		
		);
		
		return jq.get(0);
	};
	
}

function PlaceSummary(layout, place){
	this.layout = layout;
	this.place = place;
	
	// this just returns a new LI, whereas SideBar's similarly named function actually puts it on the DOM. This is confusing and it might be better if the actual DOM LI was an instance variable in PlaceSummary and could be updated directly
	this.generateHTML = function(){
		var me = this;
		
		var jq = $("<div>").attr("class", "result_div");
		
		var jqImage = $("<div>").attr("class", "res_image_div").append(
			$("<img>").attr("src", this.place.icon).attr("width", "20")
		);
		
		var jqLocate = $("<div>").attr("class", "locate").append(
			$("<img>").attr("class", "locate_button").attr("href","#").attr("src","images/location.png").data("place", me.place).click(
				function(){		
					var place = $(this).data("place");
					me.layout.mapPane.openInfo(place.location, me.generateHTML());
				}
			)
		);
		
		var jqName = $("<div>").attr("class", "res_name_div").append(
			$("<p>").attr("class","result_name").append(
				$("<a>").attr("href","#").attr("class","result_name_link").append(this.place.name).data("place",me.place).click(
					function(){
						
						var place = $(this).data("place");
						me.layout.mapPane.openInfo(place.location,me.generateHTML());
						
					}
				)
			)
			
		);
		
		// var jqBody = $("<div>").attr("class", "res_body_div").append(
			// $("<p>").attr("class","result_address").append(place.address),
			// $("<p>").attr("class","result_events_header").append("Events:")
		// );
		jqName.append(
			$("<p>").attr("class","result_address").append(place.address),
			$("<p>").attr("class","result_events_header").append("Events:")
		);

		jq.append(
			jqImage,
			jqName/*,
			jqBody,
			jqLocate*/
		);
		
		var eventList = $("<ul>").attr("class","result_events_ul");

		$.each(me.place.events,function(index,eventData){
			var summary = (new EventSummary(me.layout,eventData));
			eventList.append(
				$("<li>").attr("class","result_events_li").append(summary.generateHTML())
			);
		}),
		
		eventList.append(
			$("<li>").attr("class","result_events_li").append(
				$("<a>").attr("class","event_add_button").attr("href","#").append("").data("place",me.place).click(
					function(){
						var place = $(this).data("place");
						var form = new EventForm(me.layout, new Event(place,{}));
						me.layout.mapPane.openInfo(place.location,form.generateHTML());
					}
				)
			)
		);
		
		
		jq.append(eventList);
		
		return jq.get(0);
	};
}

function EventSummary(layout, eventData){
	this.layout = layout;
	this.eventData = eventData;
	
	this.generateHTML = function(){
		var me = this;
		
		var jq = $("<div>").attr("class","event_summary").append(
			$("<p>").attr("class","event_summary_name").append(
				$("<a>").attr("class","event_remove_button").attr("href","#").append("").data("eventData",me.eventData).click(
					function(){
						var eventData = $(this).data("eventData");
						var eventArray = eventData.place.events;
						var index = eventArray.indexOf(eventData);
						if(index!=-1){
							eventArray.splice(index,1);
						}
						var form = new PlaceSummary(me.layout, eventData.place);
						me.layout.mapPane.openInfo(eventData.place.location,form.generateHTML());
						me.layout.sideBar.generateHTML();
					}
				),
				$("<a>").attr("class","event_name_link").attr("href","#").append(me.eventData.name).data("eventData",me.eventData).click(
					function(){
						var eventData = $(this).data("eventData");
						var form = new EventForm(me.layout,eventData);
						me.layout.mapPane.openInfo(eventData.place.location,form.generateHTML());
					}
				)
			)
		);
		
		return jq.get(0);
	};
	
}

function SideBar(layout, ULid){
	this.layout = layout;
	this.ULid = ULid;
	
	this.placeSummaries = [];
	// this.places = [];
	
	this.showPlaces = function(places){
		this.placeSummaries = [];
		var me = this;
		$.each(places,function(index,place){
			me.addPlace(place);
		});
		this.generateHTML();
	};
	
	this.addPlace = function(place){
		this.placeSummaries.push(new PlaceSummary(this.layout,place));
	};
	
	this.addPlaceSummary = function(summary){
		this.placeSummaries.push(summary);
	};
	
	this.generateHTML = function(){
		$("ul#"+this.ULid).empty();
		var me = this;
		$.each(this.placeSummaries, function(index,summary){
			$("ul#"+me.ULid).append($("<li>").attr("class","result_li").append(summary.generateHTML()));
		});
	};
}


//junk code:
//this is how I would expect to add a place to the database, but there's all that JSONP trouble
add_place = function(latLng,name,type){
	var request = {
			type: 'POST',
			url:"https://maps.googleapis.com/maps/api/place/add/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0",
			datatype:'json',
			data:{
				"location": {
					"lat": latLng.lat(),
					"lng": latLng.lng()
				},
				"accuracy": 50,
				"name": name,
				"types": [type],
				"language": "en-US"
			},
			success: function(respond,textStatus,jqXHR){
				alert("in respond!");
				if(respond){
					alert(respond);
					alert(respond["status"]);
					alert(respond["reference"]);
					alert(respond["id"]);
					open_info(latLng, respond["id"]);
				}else{
					alert("something wrong with response");
				}
			},
			error: function(jqXHR,textStatus,errorThrown){
				alert("error!");
				alert(textStatus);
				alert(errorThrown);
			}
		};
	$.ajax(request);
};

//"main method"		
$(document).ready(function() {
	
	$("#nearbySearchBar").attr("placeholder", "New text");
	layout = new MapLayout();
});