package org.wayfinder.mavlink.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.client.urlconnection.HttpURLConnectionFactory;
import com.sun.jersey.client.urlconnection.URLConnectionClientHandler;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.wayfinder.mavlink.mavdata.model.DroneLocation;
import org.wayfinder.mavlink.mavdata.model.DroneStatus;
import org.wayfinder.model.leaflet.LeafletLatLng;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URL;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by bedash on 19.04.15.
 */
public class MavClient {

    private Client  client;
    private static String hostName = "roverSim";
    private static String port = "8080";

    private DroneLocation location;
    private Double groundSpeed;
    private Double altitude;
    private String mode;
    private DroneLocation nextCommand;
    private List<DroneLocation> mission;

    private MavClient() {

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

        Timer timer = new Timer("MavClientTimer");
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    location = getDataFromUrl("location", DroneLocation.class);
                    nextCommand = getDataFromUrl("next", DroneLocation.class);
                    groundSpeed = getDataFromUrl("groundspeed", Double.class);
                    altitude = getDataFromUrl("altitude", Double.class);
                    mode = getDataFromUrl("mode", String.class).replace("\"", "");
                    mission  = getDroneMission("get_mission");
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        }, 0, 1000);

    }

    private  static  class MavClientHolder{
        private final static MavClient instance = new MavClient();
    }

    public static MavClient getInstance(){
        return MavClientHolder.instance;
    }

    public DroneStatus getDroneStatus(){
        return new DroneStatus(location,groundSpeed,mode,altitude,nextCommand);
    }

    public void gotoMission(List<LeafletLatLng> coordinates){

        WebResource webResource = client.resource("http://" + hostName + ":" + port + "/gotomission");
        ClientResponse response =webResource
                .accept("application/json")
                .type("application/json")
                .post(ClientResponse.class, coordinates);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());
    }

    public List<DroneLocation> getMission() {
        return mission;
    }

    private <T> T getDataFromUrl(String uri,Class<T> responseObject){

        WebResource webResource = client.resource("http://" + hostName + ":" + port + "/"+uri);
        ClientResponse response = webResource
                .accept(MediaType.APPLICATION_JSON_TYPE)
                .type(MediaType.APPLICATION_JSON_TYPE)
                .get(ClientResponse.class);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());

        return response.getEntity(responseObject);
    }

    private List<DroneLocation> getDroneMission(String uri){

        WebResource webResource = client.resource("http://" + hostName + ":" + port + "/"+uri);
        ClientResponse response = webResource
                .accept(MediaType.APPLICATION_JSON_TYPE)
                .type(MediaType.APPLICATION_JSON_TYPE)
                .get(ClientResponse.class);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());

        return response.getEntity(new GenericType<List<DroneLocation>>(){});
    }

    public String droneHold(){
        return getDataFromUrl("hold", String.class);
    }

    public String droneAuto(){
        return getDataFromUrl("auto", String.class);
    }
}
