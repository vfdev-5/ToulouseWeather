(function () {
    'use strict';

    angular
        .module('starter.controllers.googlemap', [])
        .controller('GoogleMapCtrl', MapController);

    MapController.$inject = ['$scope', '$http', '$ionicPopup', '$cordovaGeolocation', '$compile', 'CitiesLF', 'Options'];

    function MapController($scope, $http, $ionicPopup, $cordovaGeolocation, $compile, Cities, Options) {

        console.log("Google Map controller init");

        var vm = this;

        vm.currentAddress = "";
        vm.hasGeolocation = false;
        vm.centerOnMe = _centerOnMe;
        vm.watchID = null;

        // Listen to cities.service
        $scope.$on('sendAllCities', _setup_all_markers);

        // Default actions:
        _initialize();
        _setupGeolocation();
        Cities.request_all();

        $scope.$on('$ionicView.leave', function(e) {
            console.log('GoogleMap tab view leave');
            _clearWatch();
        });


        // Define local variables

        vm._geo_center = null;
        vm._geo_center_icon = null;
        vm._geo_accurary_circle = null;

        // Define local methods

        function _initialize() {

            console.log("Initialize Google maps");

            var myLatlng = new google.maps.LatLng(45.505,1.01);

            var mapOptions = {
                center: myLatlng,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
//            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
//            var compiled = $compile(contentString)($scope);
//
//            var infowindow = new google.maps.InfoWindow({
//                content: compiled[0]
//            });

//            var marker = new google.maps.Marker({
//                position: myLatlng,
//                map: map,
//                title: 'Somewhere here'
//            });

//            google.maps.event.addListener(marker, 'click', function() {
//                infowindow.open(map,marker);
//            });

            vm.map = map;

        }

        function _clearWatch() {
            if (vm.watchID != null) {
                console.log('Clear geolocation watch');
                vm.watchID.clearWatch();
                vm.watchID = null;
            }
        }

        function _setupGeolocation() {

            var posOptions = {timeout: 3000, enableHighAccuracy: false};
            vm.watchID = $cordovaGeolocation.watchPosition(posOptions);
            vm.watchID.then(
                null,
                function(err) {
                    // error
                    console.error('Geo location error : code=' + err.code + ', message=' + err.message);
                    if (err.code == 1) {
                        $ionicPopup.alert({
                            title: "Geolocation problem",
                            template: "You need to enable geolocation on your device"
                        });
                    }

                },
                function (position) {

                    console.log("Get geolocation info : \n" +
                      'Latitude: '          + position.coords.latitude          + '\n' +
                      'Longitude: '         + position.coords.longitude         + '\n' +
                      'Altitude: '          + position.coords.altitude          + '\n' +
                      'Accuracy: '          + position.coords.accuracy          + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                      'Heading: '           + position.coords.heading           + '\n' +
                      'Speed: '             + position.coords.speed             + '\n' +
                      'Timestamp: '         + position.timestamp                + '\n'
                    );

                    _draw_geolocation_marker(
                        position.coords.latitude,
                        position.coords.longitude,
                        position.coords.accuracy
                    );

                    //if (vm.currentAddress === "") {
                    _setupCurrentAddress(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    //}

                    vm.hasGeolocation = true;

                }
            );

        }


        function _setupCurrentAddress(lat, lng) {
            var request = 'https://maps.googleapis.com/maps/api/geocode/json?';
            request += 'latlng='+lat + ','+ lng;
            request += '&key=' + GOOGLE_MAP_KEY;
            $http.get(request)
                .success(function(data, status, headers, config) {
                    console.log("Response : " + data.results[0]["formatted_address"]);
                    var s = data.results[0]["formatted_address"].split(',');
                    if (s.length > 1) {
                        vm.currentAddress = s[s.length-2] + ', ' + s[s.length-1];
                    } else {
                        vm.currentAddress = data.results[0]["formatted_address"];
                    }
                })
                .error(function(data, status, headers, config) {
                    vm.currentAddress = "unknown";
                });
        }


        function _centerOnMe() {

            if(!vm.map) {
              return;
            }

            if (!vm.hasGeolocation) {
                _setupGeolocation();
            }

            if (vm._geo_center != null) {
                console.log("Center on me");
                vm.map.setCenter(vm._geo_center);
                vm.map.setZoom((vm.map.getZoom() > 16) ? vm.map.getZoom() : 16);
            }

//            $scope.loading = $ionicLoading.show({
//              content: 'Getting current location...',
//              showBackdrop: true
//            });
//
//            navigator.geolocation.getCurrentPosition(function(pos) {
//                vm.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//                $scope.loading.hide();
//            }, function(error) {
//                alert('Unable to get location: ' + error.message);
//            });

        }

        function _draw_geolocation_marker(lat, lng, accuracy) {

            vm._geo_center = new google.maps.LatLng(lat, lng);

            if (vm._geo_center_icon == null) {
                vm._geo_center_icon = new google.maps.Marker({
                    map: vm.map,
                    position: vm._geo_center,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#0044FF',
                        fillOpacity: 0.9,
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 0.9,
                        strokeWeight: 2
                    }
                });
            } else {
                vm._geo_center_icon.setPosition(vm._geo_center);
            }

            if (vm._geo_accurary_circle == null) {
                vm._geo_accurary_circle = new google.maps.Circle({
                    strokeColor: '#0000AA',
                    strokeOpacity: 0.5,
                    strokeWeight: 0.5,
                    fillColor: '#82BCFF',
                    fillOpacity: 0.15,
                    map: vm.map,
                    center: vm._geo_center,
                    radius: accuracy
                });
            } else {
                vm._geo_accurary_circle.setCenter(vm._geo_center);
                vm._geo_accurary_circle.setRadius(accuracy);
            }

        }


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