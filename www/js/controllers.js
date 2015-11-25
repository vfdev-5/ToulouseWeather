angular.module('starter.controllers', [])

.controller('CityCtrl', function($scope, Cities) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("CityCtrl inside");
  $scope.cities = Cities.all();

})

.controller('CityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup) {

  $scope.data = {};
  $scope.id = $stateParams.id;
  $scope.showAlert = function(title, text) {
    $ionicPopup.alert({
      title: title,
      template: text
    });
  };
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
  $scope.refresh();

})

