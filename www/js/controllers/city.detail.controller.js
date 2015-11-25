


angular.module('starter.controllers.city.detail', [])

.controller('CityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup) {

  $scope.data = {};
  $scope.id = $stateParams.id;
  $scope.showAlert = function(title, text) {
    $ionicPopup.alert({
      title: title,
      template: text
    });
  };

  // Refresh
  $scope.refresh = function() {
    $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?id=' + $scope.id + '&APPID=8eb6e9b0f16cd2d2504e1bd6ea1e707a')
    .success(function(data, status, headers, config) {
      $scope.data = data;
      $scope.$broadcast('scroll.refreshComplete');
    })
    .error(function(data, status, headers, config) {
      $scope.showAlert(status, data);
	  $scope.$broadcast('scroll.refreshComplete');
    });
  };


  // Default actions:
  $scope.refresh();

});