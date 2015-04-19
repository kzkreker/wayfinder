package org.wayfinder.mavlink.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.representation.Form;
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

/**
 * Created by bedash on 19.04.15.
 */
public class MavClient {

    private Client  client;
    private static String hostName = "roverSim";
    private static String port = "8080";

    private MavClient(){
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
    }

    private  static  class MavClientHolder{
        private final static MavClient instance = new MavClient();
    }

    public static MavClient getInstance(){
        return MavClientHolder.instance;
    }

    public DroneStatus getDroneStatus(){
        DroneLocation location = getDataFromUrl("location", DroneLocation.class);
        Double groundspeed = getDataFromUrl("groundspeed", Double.class);
        String mode = getDataFromUrl("mode", String.class).replace("\"","");
        return new DroneStatus(location, groundspeed, mode);
    }

    public void goTo(LeafletLatLng leafletLatLng){
        Form form = new Form();
        form.add("lat", leafletLatLng.getLat());
        form.add("lon", leafletLatLng.getLng());

        WebResource webResource = client.resource("http://" + hostName + ":" + port + "/track");
        ClientResponse response = webResource
                .type(MediaType.APPLICATION_FORM_URLENCODED_TYPE)
                .post(ClientResponse.class, form);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());
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


}
