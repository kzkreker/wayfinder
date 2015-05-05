package org.wayfinder.graphhopper.util;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kreker on 05.05.15.
 */

public class GraphHopperHelper {

    public static List<List<Double>> parseGraphHopper(String json){
        List<List<Double>> coords = new ArrayList<>();
        try {
            JSONObject jsonObj = new JSONObject(json);
            JSONArray paths = jsonObj.getJSONArray("paths");
            JSONObject path = paths.getJSONObject(0);
            JSONObject points = path.getJSONObject("points");
            JSONArray coordinates =  points.getJSONArray("coordinates");

            for (int i = 0; i < coordinates.length(); i++) {
                JSONArray obj = coordinates.getJSONArray(i);
                List<Double> list = new ArrayList<>();
                list.add(obj.getDouble(0));
                list.add(obj.getDouble(1));
                coords.add(list);
            }
            return coords;
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return coords;
    }
}
