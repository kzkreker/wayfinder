/**
 * Created by kreker on 15.04.15.
 */
var map = L.map('map').setView([59.902687, 30.314775], 18);

L.tileLayer('http://tileserver.com/osm_tiles/{z}/{x}/{y}.png', {
    maxZoom: 18
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

$("#sidebar-hide-btn").click(function() {
    $('#sidebarManage').hide();
    map.invalidateSize();
});