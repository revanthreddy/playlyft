// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'angularMoment','starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider,$compileProvider ) {
    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|lyft|chrome-extension):/);
    
    $stateProvider
      .state('map', {
        url: '/',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      })
      .state('sample', {
        url: '/sample',
        templateUrl: 'templates/sample.html',
        controller: 'SampleCtrl'
      });

    $urlRouterProvider.otherwise("/");

  })



  .controller('MapCtrl', function ($scope, $state, $location,$cordovaGeolocation,$window , Planner) {
    var options = { timeout: 15000, enableHighAccuracy: true };
    
    $scope.doRefresh = function(){
      $location.path("/");
    }
    
    $scope.markStopAsDone = function(route_id , stop){
      Planner.markStopAsDone (route_id , stop.position , function(err , newroutes){
        $scope.stops = [];
        $scope.stops = newroutes;
      })
      //$scope.stops.splice($scope.stops.indexOf(stop), 1);
    };
    
    $scope.openLyft = function(lat,long){
      
      var url = "lyft://ridetype?id=lyft&destination[latitude]="+lat+"&destination[longitude]="+long;
      
      window.open(url,'_system','location=yes'); 
    }
    
    if(!$window.localStorage['playlyft_user_id']){
      $window.localStorage['playlyft_user_id'] = generateUUID();
    } 
    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
    Planner.playlist($window.localStorage['playlyft_user_id'],position.coords.latitude , position.coords.longitude ,function (err, playlist) {
      if (err) {
        console.log("fail");
      } else {
        $scope.routeId = playlist.route_id;
        var planstops = playlist.stops;
        
        $scope.stops = assignTimeStampToEachStop(planstops);
        
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
            center: latLng,
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


          google.maps.event.addListenerOnce($scope.map, 'idle', function () {

            for (var i = 0; i < planstops.length; i++) {
              // 30.270152  -97.736036
              var latlng = new google.maps.LatLng(planstops[i].lat, planstops[i].long);
              var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latlng
              });
            }



          });
        
      }
    }) }, function (error) {
          console.log("Could not get location");
        });;

  })

  .controller('SampleCtrl', function ($scope) {
    $scope.stops = [
      {
        "position": 0,
        "venue_name": "stubbs",
        "lat": 30.268479,
        "long": -97.736181,
        "artist_name": "ed sharpe",
        "start_time": "time str"
      },
      {
        "position": 1,
        "venue_name": "mohawk",
        "lat": 30.442023,
        "long": -97.752688,
        "artist_name": "KING",
        "start_time": "time str"
      },
      {
        "position": 2,
        "venue_name": "zilker park",
        "lat": 30.266962,
        "long": -97.772859,
        "artist_name": "KING",
        "start_time": "time str"
      }
				];
  });



function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function assignTimeStampToEachStop(stops){
  for(var i = 0 ; i < stops.length ; i++){
    stops[i].start_time = new Date(stops[i].start_time);
  }
  return stops;
}