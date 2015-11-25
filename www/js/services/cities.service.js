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
            all: get_all_cities,
            get: get_city,
            set: set_city,
        };

        var vm = this;
        vm.cities = null;

        return service;

        /////////

        $localForage.getItem('cities').then(function(data) {
        console.log("Get data from local forage : " + data);
        cities = data;


        });

        //  if (cities === null) {
        //    console.log("Initialize localforage storage at first launch");
        //    // initialize localforage storage at first launch:
        //    cities = [{
        //      id: 2972315,
        //      name: 'Toulouse',
        //      desc: 'Berceau des Airbus',
        //      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg/73px-Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg.png'
        //      }, {
        //      id: 524901,
        //      name: 'Москва',
        //      desc: 'Столица нашей Родины',
        //      logo: 'http://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_Arms_of_Moscow.png'
        //    }];
        //
        //    $localForage.setItem(
        //      'cities',
        //      cities,
        //      function(err, result) {
        //        alert("Failed to store cities in the local storage");
        //    });
        //  }

        function get_all_cities() {
            return vm.cities;
        }

        function get_city(id) {
        for (var i = 0; i < cities.length; i++) {
        if (cities[i].id === parseInt(id)) {
        return cities[i];
        }
        }
        return null;
        }

        function set_city(id, name, desc, logo) {
        var new_city = {
        id: parseInt(id),
        name: name,
        desc: desc,
        logo: logo
        };

        cities.push(new_city);

        $localForage.setItem(
        'cities',
        cities,
        function(err, result) {
        alert("Failed to store cities in the local storage");
        });

        }
    };


})();