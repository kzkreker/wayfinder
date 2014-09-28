package org.wayfinder.data.geojson.jackson;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.wayfinder.data.geojson.LngLatAlt;

import java.io.IOException;


public class LngLatAltSerializer extends JsonSerializer<LngLatAlt> {

	@Override
	public void serialize(LngLatAlt value, JsonGenerator jgen, SerializerProvider provider) throws IOException,
            JsonProcessingException {
		jgen.writeStartArray();
		jgen.writeNumber(value.getLongitude());
		jgen.writeNumber(value.getLatitude());
		if (value.hasAltitude())
			jgen.writeNumber(value.getAltitude());
		jgen.writeEndArray();
	}
}
