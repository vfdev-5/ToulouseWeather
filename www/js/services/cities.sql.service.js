(function () {
    'use strict';

    angular.module('starter.services.sql.cities', [''])
            .factory('CitiesSQL', CitiesService);


    CitiesService.$inject = ['$rootScope'];

    function CitiesService($rootScope) {

        console.log('Cities SQL Service init');

        var service = {
            request_all: _request_all,
            get: _get_city,
            add: _add_city,
            remove: _remove_city,
            reorder: _reorder_city,
            reinit: _reinit,
        };

        var _cities = null;

        return service;

        /////////

        function _request_all() {

        }

        function _get_city(id) {
            return null;
        }

        function _add_city(id, name, desc, logo) {

        }

        function _remove_city(city_id) {

        }

        function _reorder_city(city, fromIndex, toIndex) {

        }

        function _reinit() {
            console.log('Reinitialize cities in DB');
        }


        function _commit_cities(cities) {

        }

    };


})();