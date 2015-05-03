package org.wayfinder.tiles.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.client.urlconnection.HttpURLConnectionFactory;
import com.sun.jersey.client.urlconnection.URLConnectionClientHandler;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URL;

/**
 * Created by kreker on 03.05.15.
 */
public class TilesClient {

    private Client client;
    private static String hostName = "tileServer.com";
    private static String port = "80";

    private  static  class TilesClientHolder{
        private final static TilesClient instance = new TilesClient();
    }

    public static TilesClient getInstance(){
        return TilesClientHolder.instance;
    }

    private TilesClient() {

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

    public InputStream getTile(Integer zoom, Integer x,Integer y) {

        WebResource webResource =
                client.resource("http://" + hostName + ":" + port + "/osm_tiles/"+zoom+"/"+x+"/"+y+".png");
        ClientResponse response = webResource
                .type("image/png")
                .get(ClientResponse.class);

        if (response.getStatus() != 200)
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());

        return response.getEntityInputStream();
    }

}
