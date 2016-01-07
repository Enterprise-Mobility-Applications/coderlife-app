/**
* Copyright (c) 2016 Genuitec, LLC.  All rights reserved.
* 
* This Software, including any Licensed Content, is protected by copyright under
* United States, foreign laws and international treaties. Unauthorized use of
* this Software or Licensed Content may violate copyright, trademark and other
* laws.  Please refer to the "CoderLife Mobile App End User License Agreement"
* for more details on the rights and limitations for this Software.
*/

// TODO: Move directives, constants, etc to separate files
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.constant('ApiPrefix', {
  url: '{$BASE_URL}'
})
.constant('PushNotificationValues', {
  senderId: '{$SENDER_ID}',
  channels: [{$PUSH_NOTIFICATION_CHANNELS}]
})
.constant('Parse', {
  applicationId: '{$PARSE_APP_ID}',
  restAPIKey: '{$PARSE_REST_API_KEY}'
})
.run(function($ionicPlatform, $http, PushNotificationValues, Parse) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var push = PushNotification.init({
        android: {
          senderID: PushNotificationValues.senderId
        }
    });

    push.on('notification', function(data) {
      console.log('notification received', data);
    });

    push.on('error', function(e) {
        console.log(e.message);
    });

    push.on('registration', function(data) {
        var token = data.registrationId;

        var reqData = {
            "deviceType": "android",
            "deviceToken": token,
            "pushType": "gcm",
            "GCMSenderId": PushNotificationValues.senderId,
            "channels": PushNotificationValues.channels
        }
        return $http.post('https://parse.com/1/installations', reqData , {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": Parse.applicationId,
                    "X-Parse-REST-API-Key": Parse.restAPIKey
                }
            })
            .success(function(res, status, headers, config) {
                console.log("Registering NEW device successfull");
            })
            .error(function(res, status, headers, config) {
                console.log("Something went wrong");
            });
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('tab.comic', {
    url: '/comic',
    views: {
      'tab-comic': {
        templateUrl: 'templates/tab-comic.html',
        controller: 'ComicCtrl'
      }
    }
  })
  .state('tab.humor', {
    url: '/humor',
    views: {
      'tab-humor': {
        templateUrl: 'templates/tab-humor.html',
        controller: 'HumorCtrl'
      }
    }
  })
  .state('tab.share', {
    url: '/share',
    views: {
      'tab-share': {
        templateUrl: 'templates/tab-share.html',
        controller: 'ShareCtrl'
      }
    }
  })
  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html',
        controller: 'AboutCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');
}).
directive('thumbnailGallery', function ($interval, $ionicScrollDelegate, $window) {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/thumbnail-gallery.html',
    scope: {
      data: '=',
      selectedIndex: '=',
      nextComicEnabled: '=',
      previousComicEnabled: '=',
    },
    controller: ['$scope', '$ionicScrollDelegate', function($scope, $ionicScrollDelegate) {
      $scope.dataPolish = [];

      $scope.$watch('data', function(newValue, oldValue) {
        $ionicScrollDelegate.$getByHandle('thumbnail-gallery').scrollTo(0, 0, true);
        if (Array.isArray(newValue)) {
          $scope.dataPolish = _.clone(newValue, true);
        }
        $scope.dataPolish.splice(0,0, {dummy: true});
        $scope.dataPolish.push({dummy: false});
      });

      // TODO: Convert item width to constant
      var itemWidth = 130;
      $scope.$watch('selectedIndex', function(newValue, oldValue) {
        var offset = ($window.innerWidth / 2) - (itemWidth / 2);
        var scrollTo = (newValue  * itemWidth) -  (offset - itemWidth);
        $ionicScrollDelegate.$getByHandle('thumbnail-gallery').scrollTo(scrollTo, 0, false);
      });

      $scope.handleItemTap = function (index) {
        if ($scope.selected != index && index !== 0 && index !== ($scope.dataPolish.length - 1) ) {
          $scope.$emit('thumbnailItemSelected', index - 1);
        }

      };

      $scope.handleNextTap = function () {
        if ($scope.nextComicEnabled) {
          $scope.$emit('nextComic');
        }
      };

      $scope.handlePreviousTap = function () {
        if ($scope.previousComicEnabled) {
          $scope.$emit('previousComic');
        }
      };

    }],
  }
});