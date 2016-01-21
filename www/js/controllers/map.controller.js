(function () {
    'use strict';

    angular
        .module('starter.controllers.map', ['leaflet-directive'])
        .config(function($logProvider){
            $logProvider.debugEnabled(false);
        })
        .controller('MapCtrl', MapController);

    MapController.$inject = ['$scope', '$http', '$ionicPopup', 'CitiesLF', '$cordovaGeolocation', 'Options'];

    var _osm_layer = {
        name: 'OpenStreetMap',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        type: 'xyz',
        layerOptions: {
            showOnSelector: false,
        }
    };

    var _googlemap_layers = {
        googleTerrain: {
            name: 'Google Terrain',
            layerType: 'TERRAIN',
            type: 'google'
        },
        googleHybrid: {
            name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
        },
        googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
        }
    };

    var _mapbox_layer = {
        name: "Mapbox Streets",
        url: "http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png",
        type: "xyz",
        options: {
            showOnSelector: false,
            apikey: "pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q",
            mapid: "bufanuvols.ll5em372"
        }
    };

    function MapController($scope, $http, $ionicPopup, Cities, $cordovaGeolocation) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        console.log("Leaflet Map controller init");

        var vm = this;

        vm.hasGeolocation = false;

        // Listen to cities.service
        $scope.$on('sendAllCities', _setup_all_markers);

        // Default actions:
        angular.extend($scope, {
            center: {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            },
            layers: {
                baselayers: {
                    osm: _osm_layer,
//                    mapbox: _mapbox_layer,
//                    googleRoadmap: _googlemap_layers.googleRoadmap
                },
            },
            markers: {
            },
        });

        var posOptions = {timeout: 10000, maximumAge: 300, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                console.log("Get geolocation : lat/lng = " + position.coords.latitude + ", " + position.coords.longitude);
                $scope.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 8
                };
                vm.hasGeolocation = true;

            }, function(err) {
              // error
              console.error('Geo location error');
        });



        Cities.request_all();

        // Define local methods

        function _city_to_marker(city) {
            var marker = {
                lat: city.lat,
                lng: city.lng,
                draggable: false,
                opacity: 0.75,
                city: city,
            };
            return marker;
        };

        function _setup_all_markers(foo, cities) {
            console.log('Setup markers : ' + cities);
            var markers = {};
            for (var i=0; i<cities.length; i++) {
                markers[i] = _city_to_marker(cities[i]);
            }
            $scope.markers = markers;
        };


    };

})();