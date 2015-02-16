'use strict';

angular.module('core').
controller('ExploreController', ['$scope', 'TTSService', 'ClipService', function ($scope, TTSService, ClipService) {

  $scope.showSentence = false;
  $scope.currentClip = 0;

  $scope.clip = null;

  $scope.init = function () {
    ClipService.getClips().$promise.then(
      function (clips) {
        $scope.clips = clips;
        $scope.currentClip = -1;
        $scope.nextClip();
      },
      function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
  }

  $scope.$on('youtube.player.paused', function ($event, player) {
    $scope.showSentence = true;
  });

  $scope.replay = function () {
    $scope.showSentence = false;
    $scope.playing = true;
    for (var i = 0; i < $scope.sentenceOptions.length; i++) {
      $scope.sentenceOptions[i].selectedWord = '';
    }
  }


  $scope.nextClip = function () {
    $scope.showSentence = false;
    $scope.currentClip = ($scope.currentClip + 1) % $scope.clips.length;
    var clip = $scope.clips[$scope.currentClip];

    var words = clip.text.split(' ');
    var sentenceOptions = [];

    var patterns = ClipService.getSentencePatterns($scope.clips);

    for (var i = 0; i < words.length; i++) {
      var word = {
        selectedWord: '',
        options: patterns[i]
      };

      sentenceOptions.push(word);
    }
    $scope.sentenceOptions = sentenceOptions;
  }

  $scope.$watch('sentence', function () {
    var sentence = $scope.sentence;
    if (sentence) {
      if (sentence.indexOf('  ') != -1) {
        $scope.sentenceComplete = false;
      } else {
        $scope.sentenceComplete = true;
        for (var i = 0; i < $scope.clips.length; i++) {
          var clip = $scope.clips[i];
          if (clip.text == sentence) {
            $scope.clip = clip;
            $scope.playing = true;
            break;
          }
        }
      }
    }

  });

  $scope.init();

}]);