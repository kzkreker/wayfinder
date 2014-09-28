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
    <title>WayFinder</title>

    <!--CSS-->
    <link href="<c:url value="/resources/bower_components/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet">
    <link href="<c:url value="/resources/bower_components/leaflet/dist/leaflet.css"/>" rel="stylesheet">
    <link href="<c:url value="/resources/bower_components/font-awesome/css/font-awesome.min.css"/>" rel="stylesheet">
    <link href="<c:url value="/resources/css/app.css"/>" rel="stylesheet">
</head>

<body>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="navbar-header">
        <div class="navbar-icon-container">
            <a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn"><i class="fa fa-bars fa-lg white"></i></a>
            <a href="#" class="navbar-icon pull-right visible-xs" id="sidebar-toggle-btn"><i class="fa fa-search fa-lg white"></i></a>
        </div>
        <a class="navbar-brand" href="#">WayFinder</a>
    </div>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
            <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="about-btn"><i class="fa fa-question-circle white"></i>&nbsp;&nbsp;О приложении</a></li>
            <li class="dropdown">
                <a id="toolsDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-globe white"></i>&nbsp;&nbsp;Карта <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="full-extent-btn"><i class="fa fa-arrows-alt"></i>&nbsp;&nbsp;Развернуть во весь экран</a></li>
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="legend-btn"><i class="fa fa-picture-o"></i>&nbsp;&nbsp;Показать легенду</a></li>
               </ul>
            </li>

            <li class="dropdown">
                <a id="droneDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-paper-plane white"></i>&nbsp;&nbsp;Автопилот <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="controll-extent-btn"><i class="fa fa-dashboard"></i>&nbsp;&nbsp;Панель управления</a></li>
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="route-extent-btn"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;Расчет маршрута</a></li>
                </ul>
            </li>
        </ul>
    </div><!--/.navbar-collapse -->
</div>

<div id="container">
    <div id="sidebarManage" class="sidebar">
        <div class="sidebar-wrapper">
            <div class="panel panel-default features">
                <div class="panel-heading">
                    <h3 class="panel-title">Панель управления
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-hide-btn"><i class="fa fa-chevron-left"></i></button></h3>
                </div>
                <div class="panel-body">

                </div>
            </div>
        </div>
    </div>

    <div id="sidebar-way" class="sidebar" style="display: none">
        <div class="sidebar-wrapper">
            <div class="panel panel-default features">
                <div class="panel-heading">
                    <h3 class="panel-title">Расчет маршрута
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-way-hide-btn"><i class="fa fa-chevron-left"></i></button></h3>
                </div>
                <div class="panel-body">

                </div>
            </div>
        </div>
    </div>

    <div id="map"></div>
</div>
    <!--JS-->
    <script src="<c:url value="/resources/bower_components/jquery/dist/jquery.min.js"/>"></script>
    <script src="<c:url value="/resources/bower_components/bootstrap/dist/js/bootstrap.min.js"/>"></script>
    <script src="<c:url value="/resources/bower_components/leaflet/dist/leaflet.js"/>"></script>
    <script src="<c:url value="/resources/js/app.js"/>"></script>
</body>
</html>
