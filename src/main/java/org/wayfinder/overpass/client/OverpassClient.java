package org.wayfinder.overpass.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.representation.Form;
import com.sun.jersey.client.urlconnection.HttpURLConnectionFactory;
import com.sun.jersey.client.urlconnection.URLConnectionClientHandler;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.wayfinder.mavlink.client.MavClient;
import org.wayfinder.mavlink.mavdata.model.DroneLocation;
import org.wayfinder.model.geojson.FeatureCollection;
import org.wayfinder.overpass.util.OverpassHelpers;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by kreker on 01.05.15.
 */
public class OverpassClient {

    private Client client;
    private static String hostName = "overpass-api.de";
    private static String port = "80";
    private FeatureCollection buildings;
    private static Integer radius = 50;



    private  static  class OverpassClientHolder{
        private final static OverpassClient instance = new OverpassClient();
    }

    public static OverpassClient getInstance(){
        return OverpassClientHolder.instance;
    }

    private OverpassClient() {

        ClientConfig config = new DefaultClientConfig();
        config.getClasses().add(JacksonJsonProvider.class);
        this.client = new Client(new URLConnectionClientHandler(
                new HttpURLConnectionFactory() {
                    Proxy p = null;

                    @Override
                    public HttpURLConnection getHttpURLConnection(URL url)
                            throws IOException {
                        if (p == null) {
                            p = Proxy.NO_PROXY;
                        }
                        return (HttpURLConnection) url.openConnection(p);
                    }
                }), config);

        Timer timer = new Timer("OverpassClientTimer");
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    MavClient mavClient = MavClient.getInstance();
                    DroneLocation  droneLocation = mavClient.getDroneStatus().getDroneLocation();
                    buildings = getBuildingsOverpass(droneLocation,radius);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        }, 0, 5000);

    }

    private FeatureCollection  getBuildingsOverpass(DroneLocation droneLocation, Integer radius) {
        if(droneLocation!=null) {
            String data =
                    "<osm-script output=\"json\">\n" +
                            "    <query into=\"_\" type=\"way\">\n" +
                            "        <around lat=\"" + droneLocation.getLat() + "\" lon=\"" + droneLocation.getLon() + "\" radius=\"" + radius + "\"/>\n" +
                            "        <has-kv k=\"building\" modv=\"\" v=\"\"/>\n" +
                            "    </query>\n" +
                            "    <union into=\"_\">\n" +
                            "        <item set=\"_\"/>\n" +
                            "        <recurse from=\"_\" type=\"down\"/>\n" +
                            "    </union>\n" +
                            "    <print from=\"_\" limit=\"\" mode=\"body\" order=\"id\"/>\n" +
                            "</osm-script> ";

            Form form = new Form();
            form.add("data", data);

            WebResource webResource = client.resource("http://" + hostName + ":" + port + "/api/interpreter");
            ClientResponse response = webResource
                    .type(MediaType.APPLICATION_FORM_URLENCODED_TYPE)
                    .post(ClientResponse.class, form);

            if (response.getStatus() != 200)
                throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());

            String json = response.getEntity(String.class);

            return OverpassHelpers.parseOsm(json);
        }
        return new FeatureCollection();
    }

    public FeatureCollection getBuildings(){
        return  this.buildings;
    }
}
