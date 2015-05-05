package org.wayfinder.graphhopper.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.client.urlconnection.HttpURLConnectionFactory;
import com.sun.jersey.client.urlconnection.URLConnectionClientHandler;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.wayfinder.graphhopper.util.GraphHopperHelper;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URL;
import java.util.List;

/**
 * Created by kreker on 27.04.15.
 */
public class GraphHopperClient {

    private Client client;
    private static String hostName = "graphhopper";
    private static String port = "8989";


    private  static  class GraphHopperClientHolder{
        private final static GraphHopperClient instance = new GraphHopperClient();
    }

    public static GraphHopperClient getInstance(){
        return GraphHopperClientHolder.instance;
    }

    private GraphHopperClient() {
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

    public List<List<Double>> getPath(String [] point, String type,String pointsEncoded) {
        WebResource webResource = client.resource("http://" + hostName + ":" + port + "/route");
        ClientResponse response = webResource
                .queryParam("point", point[0])
                .queryParam("point", point[1])
                .queryParam("type", type)
                .queryParam("points_encoded", pointsEncoded)
                .get(ClientResponse.class);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());

        String json = response.getEntity(String.class);
        return GraphHopperHelper.parseGraphHopper(json);
    }
}
