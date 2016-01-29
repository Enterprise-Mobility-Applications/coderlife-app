/**
* Copyright (c) 2016 Genuitec, LLC.  All rights reserved.
* 
* This Software, including any Licensed Content, is protected by copyright under
* United States, foreign laws and international treaties. Unauthorized use of
* this Software or Licensed Content may violate copyright, trademark and other
* laws.  Please refer to the "CoderLife Mobile App End User License Agreement"
* for more details on the rights and limitations for this Software.
*/

var shareSuccessMessage = {
  title: 'Awesome!',
  text: "Thanks for sharing!  Bob over at @thecoderlife will take a look and if all looks good, get this shared up online.  Thanks for the contribution!\n" +
       "Questions?  DM us on @thecoderlife on Twitter"
};

var shareErrorMessage = {
  title: 'Oh Shoot.',
  text: "Maybe the Internet gods hate us, or maybe some fluke happened.  Unfortunately your share didn’t get uploaded.  Maybe try later?\n" +
      "Questions?  DM us on @thecoderlife on Twitter"
};

angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $q, Comics, Humor) {
  $scope.lastUpdatedSections = {
    comics: null,
    humor: null
  }

  $q.all([Comics.getLatest(), Humor.getLatest()])
    .then(function (responses) {
      $scope.lastUpdatedSections.comics = moment(responses[0].created_at * 1000).fromNow();
      $scope.lastUpdatedSections.humor = moment(responses[1].created_at * 1000).fromNow();
    })
    .catch(function () {
      // TODO: Handle error
    });
})

.controller('ComicCtrl', function($scope, $http, $q, $ionicScrollDelegate, Comics) {
  $scope.comic = null;
  $scope.selectedFrame = null;
  $scope.selectedFrameIndex = 0;
  $scope.nextComicEnabled = false;
  $scope.previousComicEnabled = false;

  $scope.processComicEntry = function (comic) {
    $scope.nextComicEnabled = comic.next;
    $scope.previousComicEnabled = comic.previous;
    for (var i = 0; i < comic.frames.length; i++) {
      var imageURL = comic.frames[i].image;
      cache.add(imageURL)
    }

    return cache.download().then(function () {
      $scope.comic = comic;
      for (var i = 0; i < comic.frames.length; i++) {
        var imageURL = comic.frames[i].image;
        comic.frames[i].image = cache.get(imageURL);
      }

      $scope.selectedFrame = cache.get($scope.comic.frames[$scope.selectedFrameIndex].image);    
    });
  };

  Comics.getLatest()
  .then($scope.processComicEntry)
  .catch(function (error) {
    alert('error while getting the latest comic');
  });

  $scope.handleSwipeRight = function (event) {
    var zoom = $ionicScrollDelegate.$getByHandle('comic-image').getScrollPosition().zoom;
    if (zoom === 1 && $scope.selectedFrameIndex > 0 ) {
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
    $scope.selectedFrameIndex = indexSelected;
    $scope.selectedFrame = $scope.comic.frames[indexSelected].image;
  });

  $scope.$on('nextComic', function () {
    Comics.get($scope.comic.next)
      .then($scope.processComicEntry)
      .catch(function (error) {
        alert('error while getting the latest comic');
      });
  });

  $scope.$on('previousComic', function () {
    Comics.get($scope.comic.previous)
      .then($scope.processComicEntry)
      .catch(function (error) {
        alert('error while getting the latest comic');
      });
  });
})

.controller('HumorCtrl', function($scope, $state, $ionicScrollDelegate, Humor) {
  $scope.selectedImage = null;

  $scope.processHumorEntry = function (humorEntry) {
    cache.add(humorEntry.image);
    return cache.download().then(function () {
      humorEntry.image = cache.get(humorEntry.image);
      $scope.selectedImage = humorEntry;
    });
  };

  if (typeof $state.current.data != 'undefined' && $state.current.data.latest) {
    Humor.getLatest()
      .then($scope.processHumorEntry);
  } else {
    Humor.getRandom()
      .then($scope.processHumorEntry);  
  }

  $scope.handleSwipeRight = function (event) {
    var zoom = $ionicScrollDelegate.$getByHandle('humor-image').getScrollPosition().zoom;
    if (zoom === 1) {
      Humor.getRandom()
        .then($scope.processHumorEntry);
    }
  };

  $scope.handleSwipeLeft = function (event) {
    var zoom = $ionicScrollDelegate.$getByHandle('humor-image').getScrollPosition().zoom;
    if (zoom === 1) {
      Humor.getRandom()
        .then($scope.processHumorEntry);
    }
  };
})

.controller('ShareCtrl', function($scope, $ionicModal) {})
.controller('AboutCtrl', function($scope) {
  $scope.handleAboutCoderLifeTap = function () {
    cordova.InAppBrowser.open('https://twitter.com/thecoderlife', '_system');
  };

  $scope.handleAboutGenuitecTap = function () {
    cordova.InAppBrowser.open('https://www.genuitec.com/', '_system');
  };

  $scope.handlePowerUpCoderTap = function () {
    cordova.InAppBrowser.open('https://www.genuitec.com/developer_workflow/', '_system');
  };

  $scope.handleGetMyEclipseTap = function () {
    cordova.InAppBrowser.open('https://www.genuitec.com/products/myeclipse/', '_system');
  };

  $scope.handlePowerUpWebCodingTap = function () {
    cordova.InAppBrowser.open('https://www.genuitec.com/products/webclipse/', '_system');
  };

  $scope.handleDriveYourTeamTap = function () {
    cordova.InAppBrowser.open('https://www.genuitec.com/products/sdc/', '_system');
  };
})
.controller('ShareWorkstationCtrl', function($scope, $ionicHistory, Share) {
  $scope.shareWorkstationForm = {
    invalid: true
  };

  $scope.shareWorkstationParams = {
    base64Image: null,
    twitterHandle: null
  };

  $scope.$watch('shareWorkstationParams.base64Image', function (newValue, oldValue) {
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
    }, { sourceType: Camera.PictureSourceType.CAMERA, destinationType: Camera.DestinationType.DATA_URL });   
  };

  $scope.handleSubmitButtonTap = function () {
    Share.shareWorkstation($scope.shareWorkstationParams)
    .then(function () {
      navigator.notification.alert(shareSuccessMessage.text, function () {
        $ionicHistory.goBack();
      }, shareSuccessMessage.title);
    })
    .catch(function () {
      navigator.notification.alert(shareErrorMessage.text, function () {
        $ionicHistory.goBack();
      }, shareErrorMessage.title);
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
      navigator.notification.alert(shareSuccessMessage.text, function () {
        $ionicHistory.goBack();
      }, shareSuccessMessage.title);
    })
    .catch(function () {
      navigator.notification.alert(shareErrorMessage.text, function () {
        $ionicHistory.goBack();
      }, shareErrorMessage.title);
    })
  };
});
