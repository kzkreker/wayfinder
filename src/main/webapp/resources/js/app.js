/**
 * Created by kreker on 15.04.15.
 * tileserver.com/osm_tiles/
 * http://c.tile.openstreetmap.org
 */

map = L.map('map', {
    center:  new L.LatLng(59.902687, 30.314775),
    zoom: 10,
    contextmenu: true,
    contextmenuWidth: 230,
    contextmenuItems: [{
        text: 'Проложить маршрут отсюда',
        callback: setStart
    }, {
        text: 'Проложить маршрут сюда',
        callback: setEnd
    }, '-', {
        text: 'Следовать...',
        callback: moveTo
    }, {
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

var markers = new L.LayerGroup().addTo(map);
var pointers = new L.LayerGroup().addTo(map);
var point = new L.LayerGroup().addTo(map);
var paths = new L.LayerGroup().addTo(map);

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

var start = null;
var stop = null;
var pointList = [];

L.tileLayer('http://tileServer.com/osm_tiles/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

function moveTo (e) {
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
            success: function (data, textStatus) {
                var points =  data.paths[0].points.coordinates;
                drawPath(points)
            }
        });
    }
}

function drawPath(points){
    var content = "";
    paths.clearLayers();
    pointList = [];

    points.forEach(function(item,i) {
        pointList.push(new L.LatLng(item[1], item[0]));
        content += '<tr id ="path_'+ i +'" class="path-table-body-tr"><td>' +
            i + '</td><td>'+
            item[1].toFixed(5) + '</td><td>' +
            item[0].toFixed(5) + '</td></tr>';
    });

    var firstPolyLine = new L.Polyline(pointList, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1

    });

    firstPolyLine.addTo(paths);

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

function zoomIn (e) {
    map.zoomIn();
}

function zoomOut (e) {
    map.zoomOut();
}


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
    $("#groundSpeedCell").text(droneStatus.groundSpeed.toFixed(5));
    $("#altitudeCell").text(droneStatus.altitude.toFixed(5));
    $("#modeCell").text(droneStatus.mode);

    markers.clearLayers();
    L.marker([droneStatus.droneLocation.lat, droneStatus.droneLocation.lon],{icon:iconCar})
        .addTo(markers);
}

setInterval(function() {
    getStatus()
}, 1000);

//panel view
$("#route-extent-btn").click(function() {
    $('#sidebar-way').show();
    map.invalidateSize();
});

$("#sidebar-hide-btn").click(function() {
    $('#sidebar-manage').hide();
    map.invalidateSize();
});

$("#controll-extent-btn").click(function() {
    $('#sidebar-manage').show();
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

$("body").on('mouseenter', ".path-table-body-tr",
    function() {
        var pointId = this.id.replace("path_","");
        console.log(pointList[pointId]);
        L.marker([pointList[pointId].lat, pointList[pointId].lng]).addTo(point);
    }
);

$("body").on('mouseleave', ".path-table-body-tr",
    function() {
        point.clearLayers();
    }
);

//map graw