package org.wayfinder.controller;

import org.springframework.web.bind.annotation.*;
import org.wayfinder.graphhopper.client.GraphHopperClient;

import java.util.List;

/**
 * Created by kreker on 05.05.15.
 */

@RestController
@RequestMapping("/rest/graphhopper")
public class GraphHopperController {

    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<List<Double>> getPath(@RequestParam String [] point,
                 @RequestParam String type,
                 @RequestParam String points_encoded) {
        GraphHopperClient graphHopperClient = GraphHopperClient.getInstance();
        return graphHopperClient.getPath(point,type,points_encoded);
    }

}
