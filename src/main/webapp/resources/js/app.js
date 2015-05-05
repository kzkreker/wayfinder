var southWest = L.latLng(55.4165, 39.52881),
    northEast = L.latLng(60.6920, 28.2070),
    bounds = L.latLngBounds(southWest, northEast);

map = L.map('map', {
    center:  new L.LatLng(59.902687, 30.314775),
    zoom: 14,
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
    }, '-',{
        text: 'Центрировать карту',
        callback: centerMap
    }, {
        text: 'Центрировать по БПЛА',
        callback: centerRobot
    } , '-', {
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
L.Control.measureControl().addTo(map);
var popup = L.popup();

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

var tileLayer = L.tileLayer('rest/tiles/{z}/{x}/{y}.png', {
    maxZoom: 18
})
    .addTo(map);

var start = null;
var stop = null;
var pointList = [];
var loadedMission = [];
var buildings = {};
var droneStatus = null;

getStatus();
getMission();
getBuildungs();

setInterval(function() {getMission()}, 5000);
setInterval(function() {getBuildungs()}, 5000);
setInterval(function() {getStatus()}, 1000);

function setStart (e) {
    start = e.latlng;
    $("#input-start").val(start.lat.toFixed(5) + ", " +  start.lng.toFixed(5));
    redrawPointers();
    getPath();
}

function setEnd (e) {
    stop = e.latlng;
    $("#input-stop").val(start.lat.toFixed(5) + ", " +  start.lng.toFixed(5));
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
            url: '/rest/graphhopper',
            dataType: "json",
            traditional: true,
            success: function (data) {
                var points =  data;
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


function centerRobot () {
    map.panTo (new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));
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
            loadedMission = data;
            redrawMission(loadedMission);
        }
    });
}

$("#set-hold").click(function(){
    $.ajax({
        url: 'rest/drone/hold',
        dataType: "JSON",
        contentType: 'application/json',
        success: function (data) {
        }
    });
});

$("#set-auto").click(function(){
    $.ajax({
        url: 'rest/drone/auto',
        dataType: "JSON",
        contentType: 'application/json',
        success: function (data) {
        }
    });
});

$("#goto-mission").click(function() {
    if(pointList.length>0){
        $.ajax({
            type: "POST",
            dataType: "JSON",
            contentType: 'application/json',
            url: 'rest/drone/gotomission',
            data:JSON.stringify(pointList),
            success: function (data) {

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
                droneStatus = data;
                redrawStatus(droneStatus);
            }
        }
    });
}

function redrawStatus(droneStatus){
    if(droneStatus.droneLocation){
        $("#loc-cell").text(droneStatus.droneLocation.lat.toFixed(5) +", " + droneStatus.droneLocation.lon.toFixed(5));
        $("#next-cell").text(droneStatus.nextCommand.lat.toFixed(5) +", " + droneStatus.nextCommand.lon.toFixed(5));
        $("#groundSpeedCell").text(droneStatus.groundSpeed.toFixed(5));
        $("#altitudeCell").text(droneStatus.altitude.toFixed(5));
        $("#bat-cell").text("89%");
        $("#modeCell").text(droneStatus.mode);

        carPointer.setLatLng(new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));

        var vectorList = [];
        vectorList.push(new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));
        vectorList.push(new L.LatLng(droneStatus.nextCommand.lat, droneStatus.nextCommand.lon));
        vectorPolyLine.setLatLngs(vectorList);

        var content = "";

        if(typeof buildings.features != 'undefined') {
            buildings.features.forEach(function (item, i) {
                if (typeof item.properties.addrstreet == 'undefined') item.properties.addrstreet = "Без адреса";
                if (typeof item.properties.addrhousenumber == 'undefined') item.properties.addrhousenumber = "-";
                if (typeof item.properties.buildinglevels == 'undefined') item.properties.buildinglevels = "-";

                var dist = distToFeature(item, droneStatus);

                content += '<tr id ="building_' + i + '" class="wall-table-body-tr"><td>' +
                    item.properties.addrstreet + '</td><td>' +
                    dist.toFixed(1) + '</td><td>' +
                    item.properties.addrhousenumber + '</td><td>' +
                    item.properties.buildinglevels + '</td></tr>';

            });

            $('#wall-table')
                .show();

            $('#wall-table-body')
                .empty()
                .append(content);

            redrawBuildings(buildings)
        }
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

        style: function(feature){
            var dist = distToFeature(feature,droneStatus);

            if (dist>=30)
                return { weight: 2,color: "#999", opacity: 1,fillColor: "GreenYellow", fillOpacity: 0.8};
            else if (dist>20&&dist<30)
                return { weight: 2,color: "#999", opacity: 1,fillColor: "Yellow", fillOpacity: 0.8};
            else if (dist<=20)
                return { weight: 2,color: "#999", opacity: 1,fillColor: "Red", fillOpacity: 0.8};
        }
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

$("#loc-td").click(function() {
    map.panTo (new L.LatLng(droneStatus.droneLocation.lat, droneStatus.droneLocation.lon));
});

$("#sidebar-way-loaded-hide-btn").click(function() {
    $('#sidebar-way-loaded').hide();
    map.invalidateSize();
});

$("body").on('mouseenter', ".path-table-body-tr",
    function() {
        var pointId = this.id.replace("path_","");
        L.marker([pointList[pointId].lat, pointList[pointId].lng])
            .addTo(point);
        map.panTo ([pointList[pointId].lat, pointList[pointId].lng]);
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
        map.panTo([loadedMission[missionPointId].lat, loadedMission[missionPointId].lon]    );
    })
    .on('mouseleave', ".path-loaded-table-body-tr",
    function() {
        missionPoint.clearLayers();
    })
    .on('mouseenter', ".wall-table-body-tr",
    function() {
        var buildingId = this.id.replace("building_","");
        var building = buildings.features[buildingId];
        console.log(building);
        var popupContent = "";

        if (building .properties && building.properties.addrhousenumber && building.properties.addrstreet) {
            popupContent += "<p>" + building.properties.addrstreet +" " + building.properties.addrhousenumber +"</p>";
        }

        var position = building.geometry.coordinates[0][0];
        console.log(position );

        popup.setLatLng([position[1], position[0]])
             .setContent(popupContent)
             .openOn(map);
    })
    .on('mouseleave', ".wall-table-body-tr",
    function() {
        map.closePopup();
    });

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

function dist2(v, w){
    var R = 6371;
    var x1 = v.x-w.x;
    var dLat = x1.toRad();
    var x2 = v.y-w.y;
    var dLon = x2.toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(w.x.toRad()) * Math.cos(v.x.toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
}

function distToSegment(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    if (t < 0) return dist2(p, v);
    if (t > 1) return dist2(p, w);
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

function distToFeature(feature,droneStatus){

    var points = feature.geometry.coordinates[0];
    var minDist = -1;

    for(var i = 0; i <  points.length-1; i++ ){
        var pointV = points[i];
        var pointW = points[i+1];

        var dis = distToSegment(latlonToPoint(droneStatus.droneLocation),
                                 arrToPoint(pointV),
                                 arrToPoint(pointW));

        if(minDist==-1)
            minDist = dis;

        if(minDist > dis )
            minDist = dis;
    }
    return minDist;
};

function arrToPoint(arr){
    var point = {};
    point['x'] = arr[1];
    point['y'] = arr[0];
    return point;
}

function latlonToPoint(latlon){
    var point = {};
    point['x'] = latlon.lat;
    point['y'] = latlon.lon;
    return point;
}