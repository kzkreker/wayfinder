package org.wayfinder.controller;

import org.codehaus.jettison.json.JSONException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.wayfinder.mavlink.client.MavClient;
import org.wayfinder.mavlink.mavdata.model.DroneLocation;
import org.wayfinder.model.geojson.FeatureCollection;
import org.wayfinder.overpass.client.OverpassClient;

import java.io.IOException;

/**
 * Created by kreker on 01.05.15.
 */

@RestController
@RequestMapping("/rest/overpass")
public class OverpassClientController {

    @RequestMapping(value = "/status",method = RequestMethod.GET)
    public @ResponseBody
    FeatureCollection getBuildings() throws IOException, JSONException {
        OverpassClient overpassClient = OverpassClient.getInstance();
        return overpassClient.getBuildings();
    }
}
