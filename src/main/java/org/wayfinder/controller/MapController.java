package org.wayfinder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.wayfinder.model.geojson.Feature;
import org.wayfinder.model.geojson.Point;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by kreker on 27.09.14.
 */
@RestController
@RequestMapping("/rest/map/points")
public class MapController {

    @RequestMapping(value = "/all",method = RequestMethod.GET)
    public @ResponseBody
    String getJson() {
        try {
            Feature feature = new Feature();

            Map propertyMap = new HashMap();
            propertyMap.put("popupContent", "Im a pop up");
            feature.setProperties(propertyMap);
            Point point = new Point(30.314775,59.902687);
            feature.setGeometry(point);
            return new ObjectMapper().writeValueAsString(feature);
        }
        catch (IOException e){
            e.printStackTrace();
        }
        return  null;
    }
}
