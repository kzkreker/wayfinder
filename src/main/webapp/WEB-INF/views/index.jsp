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
    <link href="<core:url value="resources/bower_components/leaflet-draw/dist/leaflet.draw.css"/>" rel="stylesheet" />
    <link href="<core:url value="resources/bower_components/lmtm-Leaflet.MeasureControl/leaflet.measurecontrol.css"/>" rel="stylesheet" />

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
            <li>
                <a href="#" data-toggle="modal" data-target="#app-info-modal" id="about-btn">
                <i class="fa fa-question-circle white"></i>
                &nbsp;&nbsp;О приложении
                </a>
            </li>

            <li class="dropdown">
                <a id="toolsDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-globe white"></i>
                    &nbsp;&nbsp;Карта
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="full-extent-btn">
                            <i class="fa fa-arrows-alt"></i>
                            &nbsp;&nbsp;Развернуть во весь экран
                        </a>
                    </li>
                    <li>
                        <a href="#"  id="legend-btn" data-toggle="modal" data-target="#map-info-modal">
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
    </div>
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
                                    <tr id='loc-td'>
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

                                <tbody  id="wall-table-body">

                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="sidebar-way" class="sidebar">
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

                                <button id="set-auto" type="button" class="btn btn-default">
                                    Auto
                                </button>

                                <button id="set-hold" type="button" class="btn btn-default">
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
                <h4 class="modal-title" id="map-info-modal-label">Условные обозначения</h4>
            </div>
            <div class="modal-body">
                <div class="row" >
                    <div class="col-xs-4 col-sm-4">
                        <img src="resources/images/car.png" class="img-thumbnail">
                    </div>
                    <div class="col-xs-8 col-sm-8"  >
                        <blockquote>
                            <p>БПЛА</p>
                            <footer>Текущее положение БПЛА на карте</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-4 col-sm-4">
                        <img src="resources/images/marker-icon-blue.png" class="img-thumbnail">
                    </div>
                    <div class="col-xs-8 col-sm-8">
                        <blockquote>
                            <p>Маркер точки путии</p>
                            <footer>Указывает на точку пути на карте</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-4 col-sm-4">
                        <img src="resources/images/marker-icon-green.png" class="img-thumbnail">
                    </div>
                    <div class="col-xs-8 col-sm-8">
                        <blockquote>
                            <p>Указатель начала пути</p>
                            <footer>Указывает на начало пути БПЛА</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-4 col-sm-4">
                        <img src="resources/images/marker-icon-red.png" class="img-thumbnail">
                    </div>

                    <div class="col-xs-8 col-sm-8">
                        <blockquote>
                            <p>Указатель конца пути</p>
                            <footer>Указывает на конец пути БПЛА</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-12">
                        <blockquote>
                            <p>Синяя линия</p>
                            <footer>Загруженный трек автопилота</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-12">
                        <blockquote>
                            <p>Красная линия</p>
                            <footer>Маршрут по дорогам общего пользования</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-12">
                        <blockquote>
                            <p>Зеленая линия</p>
                            <footer>Вектор движения робота</footer>
                        </blockquote>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-12">
                        <blockquote>
                            <p>Здания различных цветов</p>
                            <footer>Красный<20m до  здания, Желтый >20m но <30m, Зеленый>30м</footer>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="app-info-modal" tabindex="-1" role="dialog" aria-labelledby="app-info-modal-label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="app-info-modal-label">О приложении</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12 col-sm-12">
                        <blockquote>
                            <p>Философия приложения</p>
                            <footer>Использование метеданных OSM для расчета тека автопилотов APM 2.5</footer>
                        </blockquote>
                    </div>
                </div>
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
    <script src="<core:url value="resources/bower_components/leaflet-draw/dist/leaflet.draw.js"/>"></script>
    <script src="<core:url value="resources/bower_components/lmtm-Leaflet.MeasureControl/leaflet.measurecontrol.js"/>"></script>
    <script src="<core:url value="resources/js/app.js"/>"></script>

</body>
</html>
