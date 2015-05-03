package org.wayfinder.controller;

import org.springframework.web.bind.annotation.*;
import org.wayfinder.mavlink.client.MavClient;
import org.wayfinder.mavlink.mavdata.model.DroneLocation;
import org.wayfinder.mavlink.mavdata.model.DroneStatus;
import org.wayfinder.model.leaflet.LeafletLatLng;

import java.util.List;

/**
 * Created by bedash on 19.04.15.
 */

@RestController
@RequestMapping("/rest/drone")
public class MavClientController {

    @RequestMapping(value = "/status",method = RequestMethod.GET)
    public @ResponseBody
    DroneStatus getStatus() {
        MavClient mavClient = MavClient.getInstance();
        return mavClient.getDroneStatus();
    }

    @RequestMapping(value = "/gotomission",method = RequestMethod.POST,consumes="application/json")
    public void gotoMission(@RequestBody List<LeafletLatLng> leafletLatLngs) {
        MavClient mavClient = MavClient.getInstance();
        mavClient.gotoMission(leafletLatLngs);
    }

    @RequestMapping(value = "/getmission",method = RequestMethod.GET)
    public @ResponseBody
    List<DroneLocation> getMission() {
        MavClient mavClient = MavClient.getInstance();
        return mavClient.getMission();
    }


}
