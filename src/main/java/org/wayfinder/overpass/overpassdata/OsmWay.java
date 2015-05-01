package org.wayfinder.overpass.overpassdata;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by kreker on 01.05.15.
 */

public class OsmWay {

    Long id;
    String type;
    List<Long> nodes;
    HashMap<String, Object> properties;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public List<Long> getNodes() {
        return nodes;
    }
    public void setNodes(List<Long> nodes) {
        this.nodes = nodes;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }
    public void setProperties(HashMap<String, Object> properties) {
        this.properties = properties;
    }

    public OsmWay(Long id,
                  String type,
                  List<Long> nodes,
                  HashMap<String, Object> properties){
        this.id = id;
        this.type = type;
        this.nodes = nodes;
        this.properties = properties;
    }

    public OsmWay(){}
}
