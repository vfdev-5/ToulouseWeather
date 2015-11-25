angular.module('starter.services', [])

.factory('Cities', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var cities = [{
    id: 2972315,
    name: 'Toulouse',
    desc: 'Berceau des Airbus',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg/73px-Blason_ville_fr_Toulouse_%28Haute-Garonne%29.svg.png'
  }, {
    id: 524901,
    name: 'Москва',
    desc: 'Столица нашей Родины',
    logo: 'http://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_Arms_of_Moscow.png'
  }];

  return {
    all: function() {
      return cities;
    },
    get: function(id) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].id === parseInt(id)) {
          return cities[i];
        }
      }
      return null;
    }
  };
});
