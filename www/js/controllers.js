/**
* Copyright (c) 2016 Genuitec, LLC.  All rights reserved.
* 
* This Software, including any Licensed Content, is protected by copyright under
* United States, foreign laws and international treaties. Unauthorized use of
* this Software or Licensed Content may violate copyright, trademark and other
* laws.  Please refer to the "CoderLife Mobile App End User License Agreement"
* for more details on the rights and limitations for this Software.
*/

angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {})

.controller('ComicCtrl', function($scope, $http, $q, $ionicScrollDelegate, Comics) {
  $scope.comic = null;
  $scope.selectedFrame = null;
  $scope.selectedFrameIndex = 0;
  $scope.nextComicEnabled = false;
  $scope.previousComicEnabled = false;

  Comics.getLatest()
  .then(function (comic) {
    $scope.comic = comic;
    $scope.nextComicEnabled = comic.next;
    $scope.previousComicEnabled = comic.previous;
    $scope.selectedFrame = comic.frames[$scope.selectedFrameIndex].image;
  }).catch(function (error) {
    alert('error while getting the latest comic');
  });

  $scope.handleSwipeRight = function (event) {
    var zoom = $ionicScrollDelegate.$getByHandle('comic-image').getScrollPosition().zoom;
    if (zoom === 1 && $scope.selectedFrameIndex > 0 ) {
      console.log('swipe right');
      $scope.selectedFrameIndex = $scope.selectedFrameIndex - 1;
      $scope.selectedFrame = $scope.comic.frames[$scope.selectedFrameIndex].image;
    }
  };

  $scope.handleSwipeLeft = function (event) {
    var zoom = $ionicScrollDelegate.$getByHandle('comic-image').getScrollPosition().zoom;
    if (zoom === 1 && $scope.selectedFrameIndex < $scope.comic.frames.length - 1) {
      $scope.selectedFrameIndex = $scope.selectedFrameIndex + 1;
      $scope.selectedFrame = $scope.comic.frames[$scope.selectedFrameIndex].image;
    }
  };

  $scope.$on('thumbnailItemSelected', function (event, indexSelected) {
    console.log('indexSelected: ', indexSelected);
    $scope.selectedFrameIndex = indexSelected;

    $scope.selectedFrame = $scope.comic.frames[indexSelected].image;
  });

  $scope.$on('nextComic', function () {
    Comics.get($scope.comic.next)
      .then(function (comic) {
        $scope.comic = comic;
        $scope.nextComicEnabled = comic.next;
        $scope.previousComicEnabled = comic.previous;
        $scope.selectedFrameIndex = 0;
        $scope.selectedFrame = comic.frames[$scope.selectedFrameIndex].image;
      });
  });

  $scope.$on('previousComic', function () {
    Comics.get($scope.comic.previous)
      .then(function (comic) {
        $scope.comic = comic;
        $scope.nextComicEnabled = comic.next;
        $scope.previousComicEnabled = comic.previous;
        $scope.selectedFrameIndex = 0;
        $scope.selectedFrame = comic.frames[$scope.selectedFrameIndex].image;
      });
  });
})

.controller('HumorCtrl', function($scope, $ionicScrollDelegate, Humor) {
  $scope.selectedImage = null;
      Humor.get()
        .then(function (humorEntry) {
          $scope.selectedImage = humorEntry;
        });

  $scope.handleSwipeRight = function (event) {
    console.log('swipe right');
    var zoom = $ionicScrollDelegate.$getByHandle('humor-image').getScrollPosition().zoom;
    if (zoom === 1) {
      Humor.get()
        .then(function (humorEntry) {
          $scope.selectedImage = humorEntry;
        });
    }
  };

  $scope.handleSwipeLeft = function (event) {
    console.log('swipe left');
    var zoom = $ionicScrollDelegate.$getByHandle('humor-image').getScrollPosition().zoom;
    if (zoom === 1) {
      Humor.get()
      .then(function (humorEntry) {
        $scope.selectedImage = humorEntry;
      });

    }
  };
})

.controller('ShareCtrl', function($scope, $ionicModal) {})
.controller('AboutCtrl', function($scope) {})
.controller('ShareWorkstationCtrl', function($scope, $ionicHistory, Share) {
  $scope.shareWorkstationForm = {
    invalid: true
  };

  $scope.shareWorkstationParams = {
    base64Image: null,
    twitterHandle: null
  };

  $scope.$watch('shareWorkstationParams.base64Image', function (newValue, oldValue) {
    console.log("new value:", newValue);
    if (newValue && newValue.length > 0) {
      $scope.shareWorkstationForm.invalid = false;
    } else {
      $scope.shareWorkstationForm.invalid = true;
    }
  });

  $scope.handleTakePhoto = function () {
    navigator.camera.getPicture(function (cameraResult) {
      $scope.shareWorkstationParams.base64Image =  cameraResult;
      $scope.$digest();
    },
    function () {
      console.log('error camera');
    }, { sourceType: Camera.PictureSourceType.CAMERA, destinationType: Camera.DestinationType.DATA_URL });   
  };

  $scope.handleSubmitButtonTap = function () {
    console.log("Submit button tap");
    Share.shareWorkstation($scope.shareWorkstationParams)
    .then(function () {
      $ionicHistory.goBack();
    })
    .catch(function () {
      //TODO: Display error message
      console.log('Error while submiting story');
    })
  };
})
.controller('ShareStoryCtrl', function($scope, $ionicHistory, Share) {
  $scope.shareStoryParams = {
    story: null,
    twitterHandle: null
  };

  $scope.shareStoryForm = {
    invalid: true
  }

  $scope.$watch('shareStoryParams.story', function (newValue, oldValue) {
    if (String(newValue).length > 5) {
      $scope.shareStoryForm.invalid = false;
    } else {
      $scope.shareStoryForm.invalid = true;
    }
  });

  $scope.handleSubmitButtonTap = function () {
    console.log("Submit button tap");
    Share.shareStory($scope.shareStoryParams)
    .then(function () {
      $ionicHistory.goBack();
    })
    .catch(function () {
      //TODO: Display error message
      console.log('Error while submiting story');
    })
  };
});
