<%@ page language="java" contentType="text/html; charset=utf8"
         pageEncoding="utf8"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Fixed Top Navbar Example for Bootstrap</title>
    <link href="<c:url value="/resources/css/bootstrap.min.css"/>" rel="stylesheet">
    <link href="<c:url value="/resources/css/leaflet.css"/>" rel="stylesheet">
    <script src="<c:url value="/resources/js/jquery-2.1.1.min.js"/>"></script>
    <script src="<c:url value="/resources/js/bootstrap.min.js"/>"></script>
    <script src="<c:url value="/resources/js/leaflet.js"/>"></script>
</head>

<body>

<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Way Finder</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Расчет траектории</a></li>
                <li><a href="#about">Архив треков</a></li>
                <li><a href="#about">Выход</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container">
    <div class="jumbotron">
        <div id="map" class="map" style="height: 500px"></div>
    </div>
</div>
</body>

<script>
    var map = L.map('map').setView([59.902687, 30.314775], 18);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-20v6611k'
    }).addTo(map);

    var point;
    $.ajax({
        url: '/rest/map/points/all/', // указываем URL и
        dataType : "json",
        async : false,
        success: function (data, textStatus) { // вешаем свой обработчик на функцию success
            if (!$.isEmptyObject(data)) {
                point = data;
            }
        }
    });

    function onEachFeature(feature, layer) {
        var popupContent = "<p>I started out as a GeoJSON </p>";

        layer.bindPopup(popupContent);
    }

    L.geoJson(point, {
        onEachFeature: onEachFeature
    }).addTo(map);

</script>
</html>
