(function () {
    'use strict';

    angular
        .module('starter.controllers.map', [])
        .controller('MapCtrl', MapController);

    MapController.$inject = ['$scope', '$http', '$ionicPopup'];

    function MapController($scope, $http, $ionicPopup) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        var vm = this;

    };

})();