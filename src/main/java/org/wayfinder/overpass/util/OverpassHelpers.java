package org.wayfinder.overpass.util;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.wayfinder.model.geojson.*;
import org.wayfinder.overpass.overpassdata.OsmNode;
import org.wayfinder.overpass.overpassdata.OsmWay;

import java.util.*;

/**
 * Created by kreker on 01.05.15.
 */
public class OverpassHelpers {

    public static FeatureCollection parseOsm(String json ){

        HashMap<Long,OsmNode> osmNodeMap = new HashMap<>();
        ArrayList<OsmWay> osmWays =new ArrayList<>();

        try {

            JSONObject jsonObj = new JSONObject(json);
            JSONArray c = jsonObj.getJSONArray("elements");
            for (int i = 0; i < c.length(); i++) {

                JSONObject obj = c.getJSONObject(i);
                String type = obj.getString("type");

                if (type.equals("node")) {
                    OsmNode node = parseNode(obj);
                    osmNodeMap.put(node.getId(),node);
                }
                else if (type.equals("way")) {
                    OsmWay osmWay = parseWay(obj);
                    osmWays.add(osmWay);
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }

        return getFeatures(osmNodeMap,osmWays);
    }

    private static FeatureCollection getFeatures(HashMap<Long,OsmNode> osmNodeMap, ArrayList<OsmWay> osmWays){
        FeatureCollection featureCollection = new FeatureCollection();

        for(OsmWay osmWay : osmWays){
            Feature feature = new Feature();
            Polygon polygon = new Polygon();

            List<List<LngLatAlt>> cordinates = new ArrayList<>();
            List<LngLatAlt> simplePolygon = new ArrayList<>();

            for(Long node : osmWay.getNodes()){
                OsmNode osmNode = osmNodeMap.get(node);
                simplePolygon.add(new LngLatAlt(osmNode.getLon(),osmNode.getLat()));
            }

            cordinates.add(simplePolygon);
            polygon.setCoordinates(cordinates);

            feature.setId(osmWay.getId().toString());
            feature.setProperties(osmWay.getProperties());
            feature.setGeometry(polygon);
            featureCollection.add(feature);
        }

        return featureCollection;
    }

    private static OsmNode parseNode(JSONObject obj){
        try {
            return
                new OsmNode(obj.getString("type"), obj.getLong("id"),
                            obj.getDouble("lat"),obj.getDouble("lon"));
        }
        catch (Exception e){
            e.printStackTrace();
            return new OsmNode();
        }
    }

    private static OsmWay parseWay(JSONObject obj){
        try {

            List<Long> nodes = new ArrayList<>();
            HashMap<String, Object> properties = new HashMap<>();

            JSONArray jsonArray = obj.getJSONArray("nodes");
            for (int i = 0; i < jsonArray.length(); i++) {
                nodes.add(jsonArray.getLong(i));
            }

            JSONObject prop = obj.getJSONObject("tags");
            for(Iterator<String> iter = prop.keys();iter.hasNext();) {
                String key = iter.next();
                properties.put(key,prop.getString(key));
            }

            return
                new OsmWay(obj.getLong("id"),
                           obj.getString("type"),
                           nodes,
                           properties);
        }
        catch (Exception e){
            e.printStackTrace();
            return new OsmWay();
        }
    }
}
