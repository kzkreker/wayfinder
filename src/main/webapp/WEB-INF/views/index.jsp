<%@ page language="java" contentType="text/html; charset=utf8"
         pageEncoding="utf8"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="core"%>
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
    <link href="<core:url value="resources/bower_components/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet">
    <link href="<core:url value="resources/bower_components/leaflet/dist/leaflet.css"/>" rel="stylesheet">
    <link href="<core:url value="resources/bower_components/font-awesome/css/font-awesome.min.css"/>" rel="stylesheet">
    <link href="<core:url value="resources/css/app.css"/>" rel="stylesheet">
    <link href="<core:url value="resources/bower_components/Leaflet.contextmenu/dist/leaflet.contextmenu.css"/>" rel="stylesheet" />
</head>

<body>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="navbar-header">
        <div class="navbar-icon-container">
            <a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn">
                <i class="fa fa-bars fa-lg white"></i>
            </a>
            <a href="#" class="navbar-icon pull-right visible-xs" id="sidebar-toggle-btn">
                <i class="fa fa-search fa-lg white"></i>
            </a>
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
                    <li>
                        <a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="legend-btn" data-toggle="modal" data-target="#map-info-modal">
                        <i class="fa fa-picture-o"></i>
                        &nbsp;&nbsp;Показать легенду
                        </a>
                    </li>
               </ul>
            </li>

            <li class="dropdown">
                <a id="droneDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-paper-plane white"></i>&nbsp;&nbsp;Автопилот <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="controll-extent-btn"><i class="fa fa-dashboard"></i>&nbsp;&nbsp;Статус движения</a></li>
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="route-extent-btn"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;Расчет маршрута</a></li>
                    <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="route-loaded-btn"><i class="fa fa-tasks"></i>&nbsp;&nbsp;Загруженный маршрут</a></li>
                </ul>
            </li>
        </ul>
    </div><!--/.navbar-collapse -->
</div>

<div id="container">
    <div id="sidebar-manage" class="sidebar">
        <div class="sidebar-wrapper">
            <div class="panel panel-default features">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        Статус движения
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-hide-btn"><i class="fa fa-chevron-left"></i></button>
                    </h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-hover table-striped">
                                <caption> Статус БПЛА</caption>
                                <tbody>
                                <tr>
                                    <td>Координаты</td>
                                    <td id='loc-cell'></td>
                                </tr>
                                <tr>
                                    <td>Скорость</td>
                                    <td id='groundSpeedCell'></td>
                                </tr>
                                <tr>
                                    <td>Высота</td>
                                    <td id='altitudeCell'></td>
                                </tr>
                                <tr>
                                    <td>Режим</td>
                                    <td id='modeCell'></td>
                                </tr>
                                <tr>
                                    <td>Заряд батареи </td>
                                    <td id='bat-cell'></td>
                                </tr>

                                <tr>
                                    <td>Следующая точка</td>
                                    <td id='next-cell'></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <table  id="wall-table" class="table table-hover table-striped">
                                <caption> Ближайшие здания</caption>

                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="sidebar-way" class="sidebar"  style="display: none">
        <div class="sidebar-wrapper">
            <div class="panel panel-default features">

                <div class="panel-heading">
                    <h3 class="panel-title">Расчет маршрута
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-way-hide-btn">
                            <i class="fa fa-chevron-left"></i>
                        </button>
                    </h3>
                </div>

                <div class="panel-body">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label for="input-start" class="col-sm-2 control-label">От</label>
                            <div class="col-sm-10">
                                <input class="form-control " disabled id="input-start" placeholder="Маршрут отсюда - на карте">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="input-stop" class="col-sm-2 control-label">До</label>
                            <div class="col-sm-10">
                                <input  class="form-control " disabled id="input-stop" placeholder="Маршрут сюда - на карте">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="input-hight" class="col-sm-2 control-label">Высота</label>
                            <div class="col-sm-10">
                                <input  class="form-control " disabled id="input-hight" placeholder="Высота относительно поверхности">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-sm-12">
                                <button id="goto-mission" class="btn btn-default">
                                    Загрузить
                                </button>

                                <button type="button" class="btn btn-default">
                                    Сбросить
                                </button>

                                <button type="button" class="btn btn-default">
                                    Auto
                                </button>

                                <button type="button" class="btn btn-default">
                                    Hold
                                </button>
                            </div>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <table  id="path-table" class="table table-hover table-striped" style="display: none">
                                <caption> Точки Пути </caption>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Широта</th>
                                        <th>Долгота</th>
                                    </tr>
                                </thead>
                                <tbody  id="path-table-body">
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

    <div id="sidebar-way-loaded" class="sidebar"  style="display: none">
        <div class="sidebar-wrapper">
            <div class="panel panel-default features">
                <div class="panel-heading">
                    <h3 class="panel-title">Загруженный маршрут
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-way-loaded-hide-btn"><i class="fa fa-chevron-left"></i></button></h3>
                </div>
                <div class="panel-body">

                    <div class="row">
                        <div class="col-md-12">
                            <table  id="path-loaded-table" class="table table-hover table-striped" style="display: none">
                                <caption> Точки Пути </caption>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Широта</th>
                                    <th>Долгота</th>
                                </tr>
                                </thead>
                                <tbody  id="path-loaded-table-body">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="map"></div>
</div>

<div class="modal fade" id="map-info-modal" tabindex="-1" role="dialog" aria-labelledby="map-info-modal-label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="map-info-modal-label">Modal title</h4>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

    <!--JS-->
    <script src="<core:url value="resources/bower_components/jquery/dist/jquery.min.js"/>"></script>
    <script src="<core:url value="resources/bower_components/bootstrap/dist/js/bootstrap.min.js"/>"></script>
    <script src="<core:url value="resources/bower_components/leaflet/dist/leaflet.js"/>"></script>
    <script src="<core:url value="resources/bower_components/Leaflet.contextmenu/dist/leaflet.contextmenu.js"/>"></script>
    <script src="<core:url value="resources/bower_components/point-polygon-distance/point-polygon-distance.js"/>"></script>
    <script src="<core:url value="resources/js/app.js"/>"></script>

</body>
</html>
