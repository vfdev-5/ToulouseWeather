(function () {
    'use strict';

    angular.module('starter.services.options', [])
            .factory('Options', OptionsService);


    OptionsService.$inject = ['$rootScope'];

    function OptionsService($rootScope) {

        console.log('Options Service init');

        var service = {
            hasHighAccuracyGPS: _has_high_accuracy_gps,
        };

        return service;

        /////////

        function _has_high_accuracy_gps() {
            return false;
        }

    };


})();