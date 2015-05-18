'use strict';
angular.module('myApp.controllers', ['geolocation']).
  controller('ApplicationController', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('ConnectController', function($scope, socket, $location, geolocation) {
      $scope.roles = ['qa', 'developer', 'ux', 'other'];
      $scope.connect = function() {
          geolocation.getLocation().then(function(data){
            $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
            socket.emit("user:connected", {coords:$scope.coords, name:$scope.name, role:$scope.role});
          });

          $location.path("/geo:name/:role", {name:$scope.name});
      };
  }).
  controller('GeoController', function ($scope, socket, geolocation) {
    $scope.haveMessages = [];
    setTimeout(function() {
          geolocation.getLocation().then(function(data) {
            $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
            socket.emit("send:coords", $scope.coords);
          });
    },1000);

    $scope.message = function(id) {
      $scope.showSendMessage = true;
      $scope.toId = id;
    };

    $scope.sendMessage = function() {
      socket.emit("sent:message", {socket:$scope.toId, message:$scope.messageToSend, from:socket.sessionid, name:$scope.name});
    };

    socket.on("new:message", function(data) {
      $scope.haveMessages.pop(data);
      console.log(data.message + " " + data.name + " " + data.from);
    });
    $scope.tasks = ['painting', 'moving', 'gardening', 'cleaning', 'hauling', 'digging'];

    socket.on('all:coords', function (data) {
      console.log(data);
      console.log(data.all);
      $scope.$emit("all:users", [data.all]);
    });    
    socket.on('new:coords', function (data) {
      $scope.$emit("user:moved", [data.coords, data.socket]);
    });
    socket.on('got:coords', function (data) {
      console.log(data);
    });
    socket.on('new:guy', function (data) {
      $scope.$emit("user:connect", [data.coords, data.name, data.role, data.socket]);
    });
  });
