/**
 * Created by kreker on 15.04.15.
 * tileserver.com/osm_tiles/
 * http://c.tile.openstreetmap.org
 */

function moveTo (e) {
    console.log(e.latlng);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data:JSON.stringify(e.latlng),
        url: 'rest/drone/goto',
        dataType : "json",
        success: function (data, textStatus) {

        }
    });
}

function showCoordinates (e) {
    alert(e.latlng);
}
function centerMap (e) {
    map.panTo(e.latlng);
}
function zoomIn (e) {
    map.zoomIn();
}
function zoomOut (e) {
    map.zoomOut();
}

map = L.map('map', {
    center:  new L.LatLng(59.902687, 30.314775),
    zoom: 10,
    contextmenu: true,
    contextmenuWidth: 180,
    contextmenuItems: [
    {
        text: 'Следовать...',
        callback: moveTo
    },{
        text: 'Показать координаты',
        callback: showCoordinates
    }, {
        text: 'Центрировать карту',
        callback: centerMap
    }, '-', {
        text: 'Приблизить',
        icon: 'resources/images/zoom-in.png',
        callback: zoomIn
    }, {
        text: 'Отдалить',
        icon: 'resources/images/zoom-out.png',
        callback: zoomOut
    }]
})


var markers = new L.LayerGroup().addTo(map);

L.tileLayer('http://tileServer.com/osm_tiles/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

$("#sidebar-hide-btn").click(function() {
    $('#sidebarManage').hide();
    map.invalidateSize();
});

function getStatus(){
    $.ajax({
        url: 'rest/drone/status',
        dataType : "json",
        success: function (data, textStatus) {
            if (!$.isEmptyObject(data)) {
                var droneStatus = data;
                redrawStatus(droneStatus);
            }
        }
    });
}

function redrawStatus(droneStatus){
    $("#latCell").text(droneStatus.droneLocation.lat.toFixed(5));
    $("#lonCell").text(droneStatus.droneLocation.lon.toFixed(5));
    $("#groundSpeedCell").text(droneStatus.groundspeed.toFixed(5));
    $("#modeCell").text(droneStatus.mode);

    markers.clearLayers();
    var marker = L.marker([droneStatus.droneLocation.lat, droneStatus.droneLocation.lon]).addTo(markers);
}

setInterval(function() {
    getStatus()
}, 1000);