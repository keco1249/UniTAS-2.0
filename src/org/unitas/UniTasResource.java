package org.unitas;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.codehaus.jettison.json.JSONObject;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

@Path("/place")
public class UniTasResource {

	@POST
	@Path("/add")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public JSONObject addPlace(JSONObject place) {
		JSONObject response = new JSONObject();
		try {
			String resource = "https://maps.googleapis.com/maps/api/place/add/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0";
			JSONObject addPlace = new JSONObject();
			
			addPlace.put("location", place.get("location"));
			addPlace.put("accuracy", place.get("accuracy"));
			addPlace.put("name", place.get("name"));
			addPlace.put("types", place.get("types"));
			addPlace.put("language", "en-AU");
			
			response = postAction(addPlace, resource);
			
		} catch (Exception e) {

			e.printStackTrace();

		}
		return response;
	}

	@POST
	@Path("/delete")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public JSONObject deletePlace(JSONObject place) {
		JSONObject response = new JSONObject();
		try {
			String resource = new String("https://maps.googleapis.com/maps/api/place/delete/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0");
			JSONObject delPlace = new JSONObject();
			
			delPlace.put("reference", place.get("reference"));
			
			response = postAction(delPlace, resource);

		} catch (Exception e) {

			e.printStackTrace();

		}
		return response;
	}

	@POST
	@Path("/event/add")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public JSONObject addEvent(JSONObject event) {
		JSONObject response = new JSONObject();
		try {

			String resource = new String("https://maps.googleapis.com/maps/api/place/event/add/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0");
			JSONObject addEvent = new JSONObject();
			
			addEvent.put("duration", event.get("duration"));
			addEvent.put("language", event.get("language"));
			addEvent.put("reference", event.get("reference"));
			addEvent.put("summary", event.get("summary"));
			addEvent.put("url", event.get("url"));
			
			
			response = postAction(addEvent, resource);
		} catch (Exception e) {

			e.printStackTrace();

		}
		return response;
	}

	@POST
	@Path("/event/delete")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public JSONObject deleteEvent(JSONObject event) {
		JSONObject response = new JSONObject();
		try {
			String resource = "https://maps.googleapis.com/maps/api/place/event/delete/json?sensor=false&key=AIzaSyBLSBTaFr11MIh8otpdIPyT1xlTBAuBsi0";

			JSONObject delEvent = new JSONObject();
			
			delEvent.put("reference", event.get("reference"));
			delEvent.put("event_id", event.get("event_id"));

			response = postAction(delEvent, resource);

		} catch (Exception e) {

			e.printStackTrace();

		}
		return response;
	}

	private JSONObject postAction(JSONObject obj, String resource) {
		JSONObject response = new JSONObject();
		try {
			Client client = Client.create();

			WebResource webResource = client.resource(resource);

			webResource.entity(obj);

			response = webResource.accept("application/json").post(JSONObject.class);

		} catch (Exception e) {

			e.printStackTrace();

		}
		return response;
	}

}
