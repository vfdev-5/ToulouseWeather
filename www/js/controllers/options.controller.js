(function () {
    'use strict';

    angular
        .module('starter.controllers.options', [])
        .controller('OptionsCtrl', OptionsController);

    OptionsController.$inject = ['$scope', '$http', '$ionicPopup', 'Cities'];

    function OptionsController($scope, $http, $ionicPopup, Cities) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        var vm = this;

        vm.reinit = reinit;


        // Define local functions

        function reinit() {
            Cities.reinit();
        }


    };

})();