package org.wayfinder.mavlink.mavdata.model;

import java.io.Serializable;

/**
 * Created by bedash on 19.04.15.
 */

public class DroneLocation implements Serializable {
    private Double lat;
    private Double lon;

    public Double getLon() {
        return lon;
    }
    public void setLon(Double lon) {
        this.lon = lon;
    }

    public Double getLat() {
        return lat;
    }
    public void setLat(Double lat) {
        this.lat = lat;
    }

    @Override
    public  String toString(){
        StringBuilder result = new StringBuilder();

        result.append("{" );
        result.append("lat: " + getLat());
        result.append(", " );
        result.append("lon: " + getLon());
        result.append("}");

        return result.toString();
    }

}
