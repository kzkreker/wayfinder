/**
 * Created by kreker on 15.04.15.
 * tileserver.com/osm_tiles/
 * http://c.tile.openstreetmap.org
 */

var southWest = L.latLng(55.4165, 39.52881),
    northEast = L.latLng(60.6920, 28.2070),
    bounds = L.latLngBounds(southWest, northEast);

map = L.map('map', {
    center:  new L.LatLng(59.902687, 30.314775),
    zoom: 10,
    maxBounds:bounds,
    maxZoom:18,
    minZoom:10,
    contextmenu: true,
    contextmenuWidth: 230,
    contextmenuItems: [{
        text: 'Проложить маршрут отсюда',
        callback: setStart
    }, {
        text: 'Проложить маршрут сюда',
        callback: setEnd
    }, '-',
    {
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
});

var mission = new L.LayerGroup().setZIndex(7).addTo(map);
var markers = new L.LayerGroup().addTo(map);
var pointers = new L.LayerGroup().addTo(map);
var point = new L.LayerGroup().addTo(map);
var missionPoint = new L.LayerGroup().addTo(map);
var paths = new L.LayerGroup().setZIndex(3).addTo(map);
var vector = new L.LayerGroup().setZIndex(1).addTo(map);
var buildingsLayer = new L.LayerGroup().addTo(map);

var iconFrom = L.icon({
    iconUrl: 'resources/images/marker-icon-green.png',
    shadowSize: [50, 64],
    shadowAnchor: [4, 62],
    iconAnchor: [12, 40]
});

var iconTo = L.icon({
    iconUrl: 'resources/images/marker-icon-red.png',
    shadowSize: [50, 64],
    shadowAnchor: [4, 62],
    iconAnchor: [12, 40]
});

var iconCar = L.icon({
    iconUrl: 'resources/images/car.png',
    iconAnchor: [20, 20]
});

var redLine = new L.Polyline( [],{
    color: 'red',
    weight: 5,
    opacity: 0.8,
    smoothFactor: 1
})
    .addTo(paths);

var vectorPolyLine = new L.Polyline([],{
    color: 'green',
    weight: 12,
    opacity: 0.9,
    smoothFactor: 1
})
    .addTo(vector);

var firstPolyLine = new L.Polyline([], {
    color: 'blue',
    weight: 5,
    opacity: 0.4,
    smoothFactor: 1
})
    .addTo(mission);

var carPointer = new L.marker(new L.LatLng(0,0),{icon:iconCar})
    .addTo(markers);

var tileLayer = L.tileLayer('http://tileServer.com/osm_tiles/{z}/{x}/{y}.png', {
    maxZoom: 18
})
    .addTo(map);

var start = null;
var stop = null;
var pointList = [];
var loadedMission = [];
var buildings = {};


getStatus();
getMission();
getBuildungs();

setInterval(function() {getMission()}, 5000);
setInterval(function() {getBuildungs()}, 5000);
setInterval(function() {getStatus()}, 1000);

function setStart (e) {
    start = e.latlng;
    $("#input-start").val(start.lat + ", " +  start.lng);
    redrawPointers();
    getPath();
}

function setEnd (e) {
    stop = e.latlng;
    $("#input-stop").val(start.lat + ", " +  start.lng);
    redrawPointers();
    getPath();
}

function redrawPointers(){
    pointers.clearLayers();
    if(start) {
        L.marker([start.lat, start.lng],{icon:iconFrom}).addTo(pointers);
    }
    if(stop) {
        L.marker([stop.lat, stop.lng],{icon:iconTo}).addTo(pointers);
    }
}

function getPath(){
    if (start && stop) {
        $.ajax({
            type: "GET",
            data: { point:[start.lat+","+start.lng,stop.lat+","+stop.lng],
                    type:'json',
                    points_encoded:'false'},
            url: 'http://graphhopper:8989/route',
            dataType: "json",
            traditional: true,
            success: function (data) {
                var points =  data.paths[0].points.coordinates;
                drawPath(points)
            }
        });
    }
}

function drawPath(points){
    var content = "";
    pointList = [];

    points.forEach(function(item,i) {
        pointList.push(new L.LatLng(item[1], item[0]));
        content += '<tr id ="path_'+ i +'" class="path-table-body-tr"><td>' +
            i + '</td><td>'+
            item[1].toFixed(5) + '</td><td>' +
            item[0].toFixed(5) + '</td></tr>';
    });

    redLine.setLatLngs(pointList)

    $('#path-table')
        .show();

    $('#path-table-body')
        .empty()
        .append(content);
}

function showCoordinates (e) {
    alert(e.latlng);
}

function centerMap (e) {
    map.panTo(e.latlng);
}

function zoomIn () {
    map.zoomIn();
}

function zoomOut () {
    map.zoomOut();
}

function getMission(){
    $.ajax({
        url: 'rest/drone/getmission',
        dataType: "JSON",
        contentType: 'application/json',
        success: function (data) {
            if (!$.isEmptyObject(data)) {
                loadedMission = data;
                redrawMission(loadedMission);
            }
        }
    });
}

$("#goto-mission").click(function() {
    if(pointList.length>0){
        $.ajax({
            type: "POST",
            dataType: "JSON",
            contentType: 'application/json',
            url: 'rest/drone/gotomission',
            data:JSON.stringify(pointList),
            success: function (data) {
                console.log(data);
            }
        });
    }
});

function getBuildungs(){
    $.ajax({
        url: 'rest/overpass/status',
        dataType: "JSON",
        contentType: 'application/json',
        success: function (data) {
            if (!$.isEmptyObject(data)) {
                buildings = data;
                redrawBuildings(buildings);
            }
        }
    });
}

function getStatus(){
    $.ajax({
        url: 'rest/drone/status',
        dataType : "json",
        success: function (data) {
            if (!$.isEmptyObject(data)) {
                redrawStatus(data);
            }
        }
    });
}

function redrawStatus(droneStatus){
    if(droneStatus.droneLocation){
        $("#loc-cell").text(droneStatus.droneLocation.lat.toFixed(5) +"/" + droneStatus.droneLocation.lon.toFixed(5));
        $("#next-cell").text(droneStatus.nextCommand.lat.toFixed(5) +"/" + droneStatus.nextCommand.lon.toFixed(5));
        $("#groundSpeedCell").text(droneStatus.groundSpeed.toFixed(5));
        $("#altitudeCell").text(droneStatus.altitude.toFixed(5));
        $("#modeCell").text(droneStatus.mode);

        carPointer.setLatLng(new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));

        var vectorList = [];
        vectorList.push(new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));
        vectorList.push(new L.LatLng(droneStatus.nextCommand.lat, droneStatus.nextCommand.lon));
        vectorPolyLine.setLatLngs(vectorList);
    }
}

function redrawMission(missionPoints){
    var content ="";
    var pointList = [];

    missionPoints.forEach(function(item,i) {
        pointList.push(new L.LatLng(item.lat, item.lon));
        content += '<tr id ="mission_'+ i +'" class="path-loaded-table-body-tr"><td>' +
            i + '</td><td>'+
            item.lat.toFixed(5) + '</td><td>' +
            item.lon.toFixed(5) + '</td></tr>';
    });

    firstPolyLine.setLatLngs(pointList);

    $('#path-loaded-table')
        .show();

    $('#path-loaded-table-body')
        .empty()
        .append(content);
}

function redrawBuildings(buildings) {
    buildingsLayer.clearLayers();
    L.geoJson(buildings, {
        style: {
            weight: 2,
            color: "#999",
            opacity: 1,
            fillColor: "#B0DE5C",
            fillOpacity: 0.8
        },
        onEachFeature: onEachFeature
    }).addTo(buildingsLayer);
}

$("#route-extent-btn").click(function() {
    $('#sidebar-way').show();
    $('#sidebar-way-loaded').hide();
    map.invalidateSize();
});

$("#sidebar-hide-btn").click(function() {
    $('#sidebar-manage').hide();
    map.invalidateSize();
});

$("#controll-extent-btn").click(function() {
    $('#sidebar-manage').show();
    $('#sidebar-way-loaded').hide();
    map.invalidateSize();
});

$("#sidebar-way-hide-btn").click(function() {
    $('#sidebar-way').hide();
    map.invalidateSize();
});

$("#full-extent-btn").click(function() {
    $('#sidebar-way').hide();
    $('#sidebar-manage').hide();
    map.invalidateSize();
});

$("#route-loaded-btn").click(function() {
    $('#sidebar-way').hide();
    $('#sidebar-manage').hide();
    $('#sidebar-way-loaded').show();
    map.invalidateSize();
});

$("#sidebar-way-loaded-hide-btn").click(function() {
    $('#sidebar-way-loaded').hide();
    map.invalidateSize();
});

$("body").on('mouseenter', ".path-table-body-tr",
    function() {
        var pointId = this.id.replace("path_","");
        L.marker([pointList[pointId].lat, pointList[pointId].lng]).addTo(point);
    })
    .on('mouseleave', ".path-table-body-tr",
    function() {
            point.clearLayers();
    })
    .on('mouseenter', ".path-loaded-table-body-tr",
    function() {
        var missionPointId = this.id.replace("mission_","");
        L.marker([loadedMission[missionPointId].lat, loadedMission[missionPointId].lon])
            .addTo(missionPoint);
    })
    .on('mouseleave', ".path-loaded-table-body-tr",
    function() {
        missionPoint.clearLayers();
    });

function onEachFeature(feature, layer) {
    var popupContent = "";

    if (feature.properties && feature.properties.addrhousenumber && feature.properties.addrstreet) {
        popupContent += "<p>" + feature.properties.addrstreet +"</p>";
        popupContent += "<p>" + feature.properties.addrhousenumber +"</p>";
    }

    layer.bindPopup(popupContent);
}
