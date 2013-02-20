function requestService(opts) {

}

function addPlace(opts) {
    alert(opts);
    var addPlace = {
        type: 'POST',
        //url: "https://maps.googleapis.com/maps/api/place/add/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0",
        url: "http://uni-tas.elasticbeanstalk.com/rest/placeactions",
        datatype: 'json',
        data: {
            "location": {
                "lat": opts.lat(),
                "lng": opts.lng()
            },
            "accuracy": 50,
            "name": opts.name,
            "types": [opts.type],
            "language": "en-US"
        },
        success: function (respond, textStatus, jqXHR) {
            alert("in respond!");
            if (respond) {
                alert(respond);
                alert(respond["status"]);
                alert(respond["reference"]);
                alert(respond["id"]);
                open_info(latLng, respond["id"]);
            } else {
                alert("something wrong with response");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("error!");
            alert(textStatus);
            alert(errorThrown);
        }
    };
    $.ajax(addPlace);
    nearbySearch(opts);
}

function addEvent(opts) {
    var addEvent = {
        type: 'POST',
        //url: "https://maps.googleapis.com/maps/api/place/event/add/format?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0",
        url: "https://ourwebservice",
        datatype: 'json',
        data: {
            "duration": opts.duration,
            "language": "EN-CA",
            "reference": opts.reference,
            "summary": opts.description,
            "url": opts.url
        },
        success: function (respond, textStatus, jqXHR) {
            alert("in respond!");
            if (respond) {
                alert(respond);
                alert(respond["status"]);
                alert(respond["reference"]);
                alert(respond["id"]);
                open_info(latLng, respond["id"]);
            } else {
                alert("something wrong with response");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("error!");
            alert(textStatus);
            alert(errorThrown);
        }
    };
    $.ajax(addEvent);
    nearbySearch(opts);
}

