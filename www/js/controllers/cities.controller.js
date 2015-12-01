(function () {
    'use strict';

    angular
        .module('starter.controllers.cities', [])
        .controller('CityCtrl', CityController);

    CityController.$inject = ['$scope', '$http', '$ionicPopup', 'CitiesLF', '$ionicModal', '$cordovaToast'];

    function CityController($scope, $http, $ionicPopup, Cities, $ionicModal, $cordovaToast) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        var vm = this;
        vm.showDelete=false;
        vm.showReorder=false;
        vm.cities = {};
        vm.removeCity = _remove_city;
        vm.reorderCity = _reorder_city;
        vm.searchCity = _search_city;

        vm.foundCity = null;
        vm.addFoundCity = _add_found_city;
        vm.scMessage = '';

        // Listen to cities.service
        $scope.$on('sendAllCities', _setup_all_cities)

        // Define scope functions:
        $scope.showAlert = _show_alert;

        // Default actions:
        _request_all_cities();

        // Define local functions:
        function _show_alert(title, text) {
            $ionicPopup.alert({
                title: title,
                template: text
            });
        };

        function _request_all_cities() {
            console.log("Request all cities");
            Cities.request_all();
        }

        function _setup_all_cities(foo, cities) {
            console.log("Setup all cities : " + cities);
            vm.cities = cities;
        }

        function _search_city(query) {

            console.log("Search city : query=" + query.city_name);

            $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + query.city_name + '&APPID=8eb6e9b0f16cd2d2504e1bd6ea1e707a')
                .success(function(data, status, headers, config) {

                    // check the 'cod' : Error if "cod":"404"
                    console.log("Data.cod : " + data.cod);

                    if (data.cod === 200) {
                        console.log("Data.id : " + data.id);
                        console.log("Data.name : " + data.name);

                        if (Cities.get(data.id) == null) {

                            vm.foundCity = {
                                id: parseInt(data.id),
                                name: data.name,
                                desc: "a beautiful city",
                                logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Cool_City_Neighborhood_Logo.png',
                                lat: parseFloat(data.coord.lat),
                                lng: parseFloat(data.coord.lon),
                            };

                        } else {
                            vm.scMessage="City is already in the list";
                        }
                    } else {
                        vm.scMessage='Malheureusement, la ville \'' + query.city_name +  '\' n\'est pas trouvé dans le service météo.';
                    }

                })
                .error(function(data, status, headers, config) {
                    console.log("Data : " + data);
                    console.log("Status : " + status);
                    $scope.showAlert('Erreur de l\'application', 'Nous sommes désolé');
                });

        };

        function _remove_city(city) {
            console.log('Remove city : ' + city.name + ' | count=' + vm.cities.length);
            Cities.remove(city.id);
            _request_all_cities();
            console.log('Remove city : ' + city.name + ' | count=' + vm.cities.length);
        };

        function _reorder_city(city, fromIndex, toIndex) {
            Cities.reorder(city, fromIndex, toIndex);
        };

        function _add_found_city() {
            if (vm.foundCity != null) {
                Cities.add(vm.foundCity);
                _request_all_cities();
                $cordovaToast.showShortBottom("La ville est ajoutée dans la liste");
            }
        }

        ///////////////////////////////
        // Modal dialog
        ///////////////////////////////

        $ionicModal.fromTemplateUrl('search_city_dialog', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        vm.openModal = function() {
            $scope.modal.show();
        };
        vm.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });


    };

})();