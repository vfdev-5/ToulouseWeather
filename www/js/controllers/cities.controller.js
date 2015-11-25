

angular.module('starter.controllers.cities', [])

.controller('CityCtrl', function($scope, $http, $ionicPopup, Cities) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.showAlert = function(title, text) {
    $ionicPopup.alert({
      title: title,
      template: text
    });
  };

  $scope.cities = Cities.all();

  // Search
  $scope.searchCity = function(query) {

    $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + query.city_name + '&APPID=8eb6e9b0f16cd2d2504e1bd6ea1e707a')
    .success(function(data, status, headers, config) {

      // check the 'cod' : Error if "cod":"404"
      console.log("Data.cod : " + data.cod);

      if (data.cod === 200) {
        console.log("Data.id : " + data.id);
        console.log("Data.name : " + data.name);

        if (Cities.get(data.id) == null) {
          Cities.set(data.id, data.name, "a beautiful city", 'https://upload.wikimedia.org/wikipedia/en/b/b9/Cool_City_Neighborhood_Logo.png');

          $scope.cities = Cities.all();

        } else {
          console.log("City is already in the list");
        }
      } else {
        $scope.showAlert('La ville n\'est pas trouvé',
          'Malheureusement, la ville \'' + query.city_name +  '\' n\'est pas trouvé dans le service météo.');
      }

    })
    .error(function(data, status, headers, config) {
      console.log("Data : " + data);
      console.log("Status : " + status);
      $scope.showAlert('Erreur de l\'application', 'Nous sommes désolé');
    });

  };
});

