(function () {
    'use strict';

    angular.module('starter.services.lf.cities', ['LocalForageModule'])
            .config(['$localForageProvider', Configuration])
            .factory('CitiesLF', CitiesService);


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

        console.log('Cities LocalForage Service init');

        var service = {
            request_all: _request_all,
            get: _get_city,
            add: _add_city,
            remove: _remove_city,
            reorder: _reorder_city,
            reinit: _reinit,
        };

        // local copy
        var _cities = null;

        return service;

        /////////

        function _request_all() {

            if (_cities == null) {
                $localForage.getItem('cities').then(function(data) {
                    console.log("Get data from local forage : " + data);

                    if (data == null) {
                        console.log("Initialize localforage storage at first launch");
                        // initialize localforage storage at first launch:
                        data = [
                            {
                                id: 2972315,
                                name: 'Toulouse',
                                desc: 'Berceau des Airbus',
                                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg/73px-Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg.png',
                                lat: 43.604259,
                                lng: 1.44367,
                            },
                            {
                                id: 524901,
                                name: 'Москва',
                                desc: 'Столица нашей Родины',
                                logo: 'http://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_Arms_of_Moscow.png',
                                lat: 55.75222,
                                lng: 37.615555,
                            }
                        ];

                        _commit_cities(data);
                        console.log("Initialized data : " + data);
                    }
                    _cities = data;
                    _debug_display_cities();
                    $rootScope.$broadcast('sendAllCities', _cities);
                });

            } else {
                $rootScope.$broadcast('sendAllCities', _cities);
            }
        }

        function _get_index(city_id) {
            // Loop on whole array
            for (var i=0; i<_cities.length; i++) {
                if (_cities[i].id === city_id) {
                    return i;
                }
            }
            return -1;
        }

        function _get_city(city_id) {
            var index = _get_index(city_id);
            return _cities[index];
        }

        function _add_city(new_city) {
            _cities.push(new_city);
            _commit_cities(_cities);
        }

        function _remove_city(city_id) {

            _debug_display_cities();
            console.log('remove city from LF : id=' + city_id);

            var index = _get_index(city_id);

            if (index >= 0) {
                console.log('remove city from LF : count=' + _cities.length);
                _cities.splice(index, 1);
                _commit_cities(_cities);
                console.log('remove city from LF : count=' + _cities.length);
            } else {
                console.error('Failed to remove inexisting city');
            }
            _debug_display_cities();
        }

        function _reorder_city(city, fromIndex, toIndex) {
            _cities.splice(fromIndex, 1);
            _cities.splice(toIndex, 0, city);
            _commit_cities(_cities);
        }

        function _reinit() {
            console.log('Reinitialize cities in DB');
            $localForage.clear();
            _cities = null;
            _request_all();
        }


        function _commit_cities(cities) {
            $localForage.setItem(
                'cities',
                cities,
                function(err, result) {
                    alert("Failed to store cities in the local storage");
                }
            );
        }

        function _debug_display_cities() {
            console.log('DEBUG : Display cities : ');
            for (var i=0; i< _cities.length; i++) {
                var city = _cities[i];
                console.log('city : ' + city.id + ', ' + city.name);
            }
            console.log('END DEBUG');
        }

    };


})();