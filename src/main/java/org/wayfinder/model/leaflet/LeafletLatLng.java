package org.wayfinder.model.leaflet;

/**
 * Created by bedash on 19.04.15.
 */
public class LeafletLatLng {
    private Double lat;
    private Double lng;

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
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
        result.append("lng: " + getLng());
        result.append("}");

        return result.toString();
    }

}
