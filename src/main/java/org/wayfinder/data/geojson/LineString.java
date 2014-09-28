package org.wayfinder.data.geojson;


public class LineString extends MultiPoint {

	public LineString() {
	}

	public LineString(LngLatAlt... points) {
		super(points);
	}
}
