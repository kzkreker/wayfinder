package org.wayfinder.mavlink.mavdata.model;

/**
 * Created by bedash on 19.04.15.
 */

public class DroneStatus {

    private DroneLocation droneLocation;
    private Double groundSpeed;
    private Double altitude;
    private String mode;
    private DroneLocation nextCommand;

    public String getMode() {
        return mode;
    }
    public void setMode(String mode) {
        this.mode = mode;
    }

    public Double getGroundSpeed() {
        return groundSpeed;
    }
    public void setGroundSpeed(Double groundSpeed) {
        this.groundSpeed = groundSpeed;
    }

    public DroneLocation getDroneLocation() {
        return droneLocation;
    }
    public void setDroneLocation(DroneLocation droneLocation) {
        this.droneLocation = droneLocation;
    }

    public Double getAltitude() {
        return altitude;
    }
    public void setAltitude(Double altitude) {
        this.altitude = altitude;
    }

    public DroneLocation getNextCommand() {
        return nextCommand;
    }
    public void setNextCommand(DroneLocation nextCommand) {
        this.nextCommand = nextCommand;
    }


    public DroneStatus(){}

    public DroneStatus(DroneLocation droneLocation, Double groundSpeed,
                       String mode, Double altitude, DroneLocation nextCommand){
        this.droneLocation = droneLocation;
        this.groundSpeed = groundSpeed;
        this.mode = mode;
        this.altitude = altitude;
        this.nextCommand = nextCommand;
    }

    @Override
    public  String toString(){
        StringBuilder result = new StringBuilder();
        result.append("{");
        result.append("position: " + getDroneLocation() + ", ");
        result.append("groundSpeed: " + getGroundSpeed() + ", ");
        result.append("mode: " + getMode());
        result.append("}");
        return result.toString();
    }

}
