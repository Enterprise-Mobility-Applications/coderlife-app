/**
* Copyright (c) 2016 Genuitec, LLC.  All rights reserved.
* 
* This Software, including any Licensed Content, is protected by copyright under
* United States, foreign laws and international treaties. Unauthorized use of
* this Software or Licensed Content may violate copyright, trademark and other
* laws.  Please refer to the "CoderLife Mobile App End User License Agreement"
* for more details on the rights and limitations for this Software.
*/

angular.module('starter.services', [])

.factory('Comics', function ($http, $q, ApiPrefix) {
  return {
    getLatest: function () {
      SpinnerDialog.show(null, null, function () {return true});

      return $http.get(ApiPrefix.url+'/comic/latest')
        .then(function (response){
          return response.data;
        })
        .finally(function () {
          SpinnerDialog.hide();
        });
    },
    get: function (comicId) {
      SpinnerDialog.show(null, null, function () {return true});

      return $http.get(ApiPrefix.url+'/comic/'+comicId).then(function (response){
        return response.data;
      })
      .finally(function () {
        SpinnerDialog.hide();
      });

    }
  }
}).factory('Humor', function ($http, $q, ApiPrefix) {
  return {
    getLatest: function () {
      SpinnerDialog.show(null, null, function () {return true});

      return $http.get(ApiPrefix.url+'/humor/latest')
        .then(function (response){
          return response.data;
      })
      .finally(function () {
        SpinnerDialog.hide();
      });
    },
    getRandom: function () {
      SpinnerDialog.show(null, null, function () {return true});

      return $http.get(ApiPrefix.url+'/humor/random')
        .then(function (response){
          return response.data;
      })
      .finally(function () {
        SpinnerDialog.hide();
      });
    }
  }
}).factory('Share', function($http, $q, ApiPrefix) {
  return {
    shareWorkstation: function (params) {
      SpinnerDialog.show(null, null, function () {return true});
      return $http.post(ApiPrefix.url+'/share/workstation', params)
        .then(function (response) {
          return response.data;
        })
        .finally(function () {
          SpinnerDialog.hide();
        });
    },  
    shareStory: function (params) {
      SpinnerDialog.show(null, null, function () {return true});
      return $http.post(ApiPrefix.url+'/share/story', params)
        .then(function (response) {
          return response.data;
        })
        .finally(function () {
          SpinnerDialog.hide();
        });pl
    }
  }
});
