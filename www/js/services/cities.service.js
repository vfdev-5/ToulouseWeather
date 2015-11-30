(function () {
    'use strict';

    angular.module('starter.services.cities', ['LocalForageModule'])
            .config(['$localForageProvider', Configuration])
            .factory('Cities', CitiesService);


    function Configuration($localForageProvider) {
        console.log("Local forage Configuration")
            $localForageProvider.config({
                // driver      : 'localStorageWrapper', // if you want to force a driver
                name        : 'tw', // name of the database and prefix for your data, it is "lf" by default
                version     : 1.0, // version of the database, you shouldn't have to use this
                storeName   : 'keyvaluepairs', // name of the table
                description : 'some description'
            }
        );
    }


    CitiesService.$inject = ['$localForage', '$rootScope'];

    function CitiesService($localForage, $rootScope) {

        console.log('CitiesService init');

        var service = {
            request_all: request_all,
            get: get_city,
            set: set_city,
            remove: remove_city,
            reinit: reinit,
        };

        var vm = this;
        vm.cities = null;

        return service;

        /////////

        function request_all() {

            if (vm.cities == null) {
                $localForage.getItem('cities').then(function(data) {
                    console.log("Get data from local forage : " + data);

                    if (data == null) {
                        console.log("Initialize localforage storage at first launch");
                        // initialize localforage storage at first launch:
                        data = {
                            2972315:
                            {
                                id: 2972315,
                                name: 'Toulouse',
                                desc: 'Berceau des Airbus',
                                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg/73px-Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg.png'
                            },
                            524901:
                            {
                                id: 524901,
                                name: 'Москва',
                                desc: 'Столица нашей Родины',
                                logo: 'http://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_Arms_of_Moscow.png'
                            }
                        };

                        commit_cities(data);
                        console.log("Initialized data : " + data);
                    }
                    vm.cities = data;

                    debug_display_cities();

                    var response = dict_to_array(vm.cities);
                    $rootScope.$broadcast('sendAllCities', response);
                });

            } else {
                var response = dict_to_array(vm.cities);
                $rootScope.$broadcast('sendAllCities', response);
            }
        }

        function dict_to_array(dict) {
            var response = [];
            for (var key in dict) {
                response.push(dict[key]);
            }
            return response;
        }

        function get_city(id) {
            var c = vm.cities[id];
            return (typeof c === "undefined") ? null : c;
        }

        function set_city(id, name, desc, logo) {
            var new_city = {
                id: parseInt(id),
                name: name,
                desc: desc,
                logo: logo
            };

            vm.cities[new_city.id] = new_city;
            commit_cities(vm.cities);
        }

        function remove_city(city_id) {

            debug_display_cities();
            console.log('remove city from DB : id=' + city_id);

            if (typeof vm.cities[city_id] !== "undefined") {
                var list = dict_to_array(vm.cities);
                console.log('remove city from DB : count=' + list.length);
                delete vm.cities[city_id];
                commit_cities(vm.cities);
                console.log('remove city from DB : count=' + list.length);
            } else {
                console.error('Failed to remove inexisting city');
            }

            debug_display_cities();
        }

        function reinit() {
            console.log('Reinitialize cities in DB');
            $localForage.clear();
            vm.cities = null;
            request_all();
        }


        function commit_cities(cities) {
            $localForage.setItem(
                'cities',
                cities,
                function(err, result) {
                    alert("Failed to store cities in the local storage");
                }
            );
        }


        function debug_display_cities() {
            console.log('DEBUG : Display cities : ');
            for (var key in vm.cities) {
                var city = vm.cities[key];
                console.log('key=' + key + ' | city : ' + city.id + ', ' + city.name);
            }
            console.log('END DEBUG');
        }

    };


})();