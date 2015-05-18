'use strict';
angular.module('myApp', [
  'myApp.controllers',
  'myApp.directives',
  // 3rd party dependencies
  'btford.socket-io',
  'geolocation'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/connect', {
      templateUrl: 'partials/partial_connect',
      controller: 'ConnectController'
    }).
    when('/geo', {
      templateUrl: 'partials/partial_geo',
      controller: 'GeoController'
    }).
    otherwise({
      redirectTo: '/geo'
    });
  $locationProvider.html5Mode(true);
});
