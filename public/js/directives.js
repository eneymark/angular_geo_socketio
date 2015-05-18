'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).
directive('googleMap', function($rootScope) {
	return {
		link: function($scope, element, attrs) {
		    window.map_initialize = function() {
                    //delete window.map_initialize;

                    var latLong = attrs['googleMap'].split(",")
                    var mapOptions = {
                        zoom: 8,
                        center: new google.maps.LatLng(latLong[0], latLong[1]),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var infoWindow = new google.maps.InfoWindow();
                    var map = new google.maps.Map(element[0], mapOptions);
                    var markers = {};
                    var content = function(marker, role, name, id) {
                    	return function() {
                                        $scope.message(id);
                                        $scope.$apply();
                    		            infoWindow.setContent("<b>" + name + ", </b>" + role + "<br/>");
            							infoWindow.open(map, marker);
                    	};
                    }
                    var placeMarker = function(lat, long, name, role, id) {
            	        var marker = new google.maps.Marker();
				        var latLong = new google.maps.LatLng(lat, long);
				        //set position
				        marker.setPosition(latLong);
				        //set icon
				        marker.setIcon(new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + name + "|00FF00|000000"));
				        //set title
				        marker.setTitle(name);
				        marker.setMap(map);
				        map.panTo(latLong);
				        google.maps.event.addListener(marker, 'click', content(marker, role, name, id));
				        markers[id] = marker;
                    };
        
                    $rootScope.$on('user:connect', function(evt, args) {
            	        var marker = new google.maps.Marker();
				        var latLong = new google.maps.LatLng(args[0].lat, args[0].long);
				        //set position
				        marker.setPosition(latLong);
				        //set icon
				        marker.setIcon(new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + args[1] + "|00FF00|000000"));
				        //set title
				        marker.setTitle(args[1]);
				        marker.setMap(map);
				        map.panTo(latLong);
				        google.maps.event.addListener(marker, 'click', content(marker, args[2], args[1], args[3]));
				        markers[args[3]] = marker;
                    });
                    $rootScope.$on('all:users', function(evt, args) {
                    	for(var userId in args[0]) {
                    		var user = args[0][userId];
                    		if(!markers[user.socket]) {
                    			placeMarker(user.coords.lat, user.coords.long, user.name, user.role, user.socket);	
                    		}
                    	}
                    });
                    $rootScope.$on('user:moved', function(evt, args){
                    	var marker = markers[args[1]];
                    	if(marker) {
                            var latLong = new google.maps.LatLng(args[0].lat, args[0].long);
                        	marker.setPosition(latLong);
                        }
                    });
			};
			
			if (!window.google || !window.google.maps) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "http://maps.googleapis.com/maps/api/js?client=gme-expedia&sensor=false&callback=map_initialize&language=en";
                    document.body.appendChild(script);
                } else {
                    map_initialize();
            }
		}
	};
  });
