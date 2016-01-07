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

.controller('ShareCtrl', function($scope, $ionicModal) {
  $scope.workstationPhoto = {
    image: null
  };

  $ionicModal.fromTemplateUrl('templates/modal/share-workstation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.handleTakePhoto = function () {
      navigator.camera.getPicture(function (cameraResult) {
        $scope.workstationPhoto =  { image: 'data:image/jpeg;base64,' + cameraResult };
        $scope.$digest();
      },
      function () {
        console.log('error camera');
      }, { sourceType: Camera.PictureSourceType.CAMERA, destinationType: Camera.DestinationType.DATA_URL });   
    }

  $scope.handleShareMyWorkstationTap = function() {
    console.log("handle share my workstation tap");
    $scope.openModal();
  };
})

.controller('AboutCtrl', function($scope) {});
