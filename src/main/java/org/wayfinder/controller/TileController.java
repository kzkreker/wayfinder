package org.wayfinder.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.wayfinder.tiles.client.TilesClient;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by kreker on 01.05.15.
 */

@RestController
@RequestMapping("/rest/tiles")
public class TileController {
    @RequestMapping(value = "/{zoom}/{x}/{y}.png",method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[]
    getTile(@PathVariable(value="zoom") Integer zoom,
            @PathVariable(value="x") Integer x,
            @PathVariable(value="y") Integer y) throws IOException {
        TilesClient tilesClient = TilesClient.getInstance();

        InputStream inputStream = tilesClient.getTile(zoom,x,y);
        return IOUtils.toByteArray(inputStream);

    }
}
