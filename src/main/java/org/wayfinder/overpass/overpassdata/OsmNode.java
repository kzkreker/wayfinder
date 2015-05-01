package org.wayfinder.overpass.overpassdata;

/**
 * Created by kreker on 01.05.15.
 */

public class OsmNode {

    Long id;
    String type;
    Double lat;
    Double lon;

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

    public Double getLat() {
        return lat;
    }
    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }
    public void setLon(Double lon) {
        this.lon = lon;
    }

    public OsmNode(){};

    public OsmNode(String type,Long id,Double lat,Double lon){
        this.type = type;
        this.id = id;
        this.lat =lat;
        this.lon = lon;
    }

}
