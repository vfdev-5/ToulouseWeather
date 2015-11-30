(function () {
    'use strict';

    angular
        .module('starter.controllers.cities', [])
        .controller('CityCtrl', CityController);

    CityController.$inject = ['$scope', '$http', '$ionicPopup', 'Cities', '$ionicModal'];

    function CityController($scope, $http, $ionicPopup, Cities, $ionicModal) {
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
                                id: data.id,
                                name: data.name
                            };

                        } else {
//                            console.log("City is already in the list");
                            vm.scMessage="City is already in the list";
                        }
                    } else {
//                        $scope.showAlert('La ville n\'est pas trouvé',
//                        'Malheureusement, la ville \'' + query.city_name +  '\' n\'est pas trouvé dans le service météo.');
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
            vm.cities
            Cities.remove(city.id);
            vm.cities.splice(vm.cities.indexOf(city), 1);
            console.log('Remove city : ' + city.name + ' | count=' + vm.cities.length);
        };

        function _reorder_city(city, fromIndex, toIndex) {
            vm.cities.splice(fromIndex, 1);
            vm.cities.splice(toIndex, 0, city);
        };

        function _add_found_city() {
            if (vm.foundCity != null) {
                Cities.set(vm.foundCity.id,
                        vm.foundCity.name,
                        "a beautiful city", 'https://upload.wikimedia.org/wikipedia/en/b/b9/Cool_City_Neighborhood_Logo.png');
                _request_all_cities();
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