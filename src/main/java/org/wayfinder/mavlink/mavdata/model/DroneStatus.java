package org.wayfinder.mavlink.mavdata.model;

import org.wayfinder.data.geojson.Point;

/**
 * Created by bedash on 19.04.15.
 */
public class DroneStatus {

    private DroneLocation droneLocation;
    private Double groundspeed;
    private String mode;

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Double getGroundspeed() {
        return groundspeed;
    }

    public void setGroundspeed(Double groundspeed) {
        this.groundspeed = groundspeed;
    }

    public DroneLocation getDroneLocation() {
        return droneLocation;
    }

    public void setDroneLocation(DroneLocation droneLocation) {
        this.droneLocation = droneLocation;
    }

    public DroneStatus(){}

    public DroneStatus(DroneLocation droneLocation, Double groundspeed, String mode){
        this.droneLocation = droneLocation;
        this.groundspeed = groundspeed;
        this.mode = mode;
    }

    @Override
    public  String toString(){
        StringBuilder result = new StringBuilder();
        result.append("{");
        result.append("position: " + getDroneLocation() + ", ");
        result.append("groundspeed: " + getGroundspeed() + ", ");
        result.append("mode: " + getMode());
        result.append("}");
        return result.toString();
    }

}
