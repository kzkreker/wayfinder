package org.wayfinder.controller;

import org.springframework.web.bind.annotation.*;
import org.wayfinder.mavlink.client.MavClient;
import org.wayfinder.mavlink.mavdata.model.DroneStatus;
import org.wayfinder.model.leaflet.LeafletLatLng;


/**
 * Created by bedash on 19.04.15.
 */
@RestController
@RequestMapping("/rest/drone")
public class DroneController {

    @RequestMapping(value = "/status",method = RequestMethod.GET)
    public @ResponseBody
    DroneStatus getStatus() {
        MavClient mavClient = MavClient.getInstance();
        return mavClient.getDroneStatus();
    }

    @RequestMapping(value = "/goto",method = RequestMethod.POST)
    public @ResponseBody
    void goTo(@RequestBody LeafletLatLng leafletLatLng) {
        MavClient mavClient = MavClient.getInstance();
        mavClient.goTo(leafletLatLng);
    }
}
